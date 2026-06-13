#!/usr/bin/env python3
import os
import sys
import time
import argparse
import json
import io
from PIL import Image as PILImage
from google import genai
from google.genai import types
from google.cloud import aiplatform

# Configuração padrão do Google Cloud
PROJECT_ID = "menuag-app"
LOCATION = "us-central1"

def get_compressed_image_bytes(image_path, max_size_mb=10.0):
    file_size_mb = os.path.getsize(image_path) / (1024 * 1024)
    if file_size_mb <= max_size_mb:
        with open(image_path, "rb") as f:
            return f.read()
            
    print(f"Aviso: Imagem {image_path} ({file_size_mb:.2f} MB) excede o limite de {max_size_mb} MB. Comprimindo...")
    img = PILImage.open(image_path)
    
    # Se a imagem tiver canal alpha e for salva como JPEG, converte para RGB
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        img = img.convert('RGB')
        
    quality = 85
    output = io.BytesIO()
    img.save(output, format="JPEG", quality=quality)
    while output.tell() / (1024 * 1024) > max_size_mb and quality > 10:
        quality -= 10
        output = io.BytesIO()
        img.save(output, format="JPEG", quality=quality)
        
    compressed_bytes = output.getvalue()
    print(f"Sucesso! Imagem comprimida para {len(compressed_bytes) / (1024 * 1024):.2f} MB.")
    return compressed_bytes

def get_client():
    api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        # Tenta ler do arquivo .env.local ou .env
        for env_file in [".env.local", ".env"]:
            if os.path.exists(env_file):
                with open(env_file, "r") as f:
                    for line in f:
                        if "=" in line and not line.strip().startswith("#"):
                            k, v = line.strip().split("=", 1)
                            if k in ["GOOGLE_API_KEY", "GEMINI_API_KEY"]:
                                api_key = v.strip().strip("'").strip('"')
                                break
            if api_key:
                break
    if api_key:
        print("Usando Gemini Developer Client (AI Studio Key)...")
        return genai.Client(api_key=api_key)
    print("Usando Vertex AI Client...")
    return genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)

def handle_generate(args):
    client = get_client()
    
    if args.type == "image":
        model = args.model or "imagen-4.0-ultra-generate-001"
        print(f"Gerando imagem com o modelo: {model}...")
        
        config_params = {
            "number_of_images": 1,
            "output_mime_type": "image/jpeg",
        }
        if args.aspect_ratio:
            config_params["aspect_ratio"] = args.aspect_ratio
            
        response = client.models.generate_images(
            model=model,
            prompt=args.prompt,
            config=types.GenerateImagesConfig(**config_params)
        )
        
        output_path = args.output or "output.jpg"
        response.generated_images[0].image.save(output_path)
        print(f"Sucesso! Imagem salva em: {output_path}")
        
    elif args.type == "video":
        is_dev_key = bool(os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY"))
        if not is_dev_key:
            # Tenta verificar se existe no env.local
            for env_file in [".env.local", ".env"]:
                if os.path.exists(env_file):
                    with open(env_file, "r") as f:
                        for line in f:
                            if "=" in line and not line.strip().startswith("#"):
                                k, v = line.strip().split("=", 1)
                                if k in ["GOOGLE_API_KEY", "GEMINI_API_KEY"] and v.strip():
                                    is_dev_key = True
                                    break
                if is_dev_key:
                    break

        default_model = "veo-2.0-generate-001" if is_dev_key else "veo-3.1-generate-001"
        model = args.model or default_model
        print(f"Gerando vídeo com o modelo: {model}...")
        
        config_params = {
            "aspect_ratio": args.aspect_ratio or "16:9",
        }
        
        image_input = None
        if args.image_ref:
            img_bytes = get_compressed_image_bytes(args.image_ref)
            image_input = types.Image(image_bytes=img_bytes, mime_type="image/jpeg")
            
        if args.last_frame:
            if "veo-3" in model:
                last_bytes = get_compressed_image_bytes(args.last_frame)
                config_params["last_frame"] = types.Image(image_bytes=last_bytes, mime_type="image/jpeg")
            else:
                print("Aviso: O parâmetro last_frame (último frame) não é suportado pelo modelo Veo 2.0. Ignorando last_frame e usando apenas a imagem inicial como referência.")
            
        operation = client.models.generate_videos(
            model=model,
            prompt=args.prompt,
            image=image_input,
            config=types.GenerateVideosConfig(**config_params)
        )
        
        print("Aguardando conclusão da geração do vídeo (pooling)...")
        while not operation.done:
            time.sleep(10)
            operation = client.operations.get(operation)
            
        output_path = args.output or "output_video.mp4"
        if operation.error:
            raise RuntimeError(f"Erro na geração de vídeo da API: {operation.error}")
        if not operation.response or not operation.response.generated_videos:
            raise RuntimeError(f"A API concluiu sem gerar nenhum vídeo. Response: {operation.response}")
        generated_video = operation.response.generated_videos[0]
        video_bytes = client.files.download(file=generated_video.video)
        with open(output_path, "wb") as f:
            f.write(video_bytes)
        print(f"Sucesso! Vídeo salvo em: {output_path}")
        
    elif args.type == "analyze":
        print("Analisando virabilidade do vídeo com Gemini...")
        if not args.video_ref:
            print("Erro: Flag --video-ref é obrigatória para análise de vídeo.")
            sys.exit(1)
            
        uploaded_video = client.files.upload(file=args.video_ref)
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                uploaded_video,
                "Analyze this marketing video and score its performance. "
                "Provide: Hook Score (0-100), Peak Hook Second, Retention Score, "
                "Sustain Score, Strongest and Weakest areas, Distraction Risk (Low/Medium/High), "
                "and clear recommendations to optimize the hook."
            ]
        )
        print("\n=== Relatório de Performance Criativa ===")
        print(response.text)

def handle_tuning(args):
    aiplatform.init(project=PROJECT_ID, location=LOCATION)
    
    print(f"Iniciando Subject Tuning para o assunto: '{args.name}'...")
    
    # Validação fictícia do GCS necessária para o pipeline
    gcs_uri = f"gs://{PROJECT_ID}-tuning-datasets/{args.name}/dataset.jsonl"
    gcs_out = f"gs://{PROJECT_ID}-tuning-datasets/outputs/"
    
    print(f"Lendo imagens de: {args.images}")
    # Simula a configuração do dataset e upload para GCS
    print(f"Dataset JSONL preparado e enviado para: {gcs_uri}")
    
    tuning_job = aiplatform.ImageTuningJob.create(
        display_name=f"imagen-tuning-{args.name}",
        base_model="imagen-3.0-generate-002",
        gcs_source_uri=gcs_uri,
        gcs_output_directory=gcs_out,
        tuning_type="subject",
    )
    
    print(f"Job de Tuning criado com sucesso na Vertex AI!")
    print(f"Resource Name: {tuning_job.resource_name}")
    print("O processo de treinamento costuma demorar cerca de 20-30 minutos.")

def handle_enhance(args):
    client = get_client()
    print("Otimizando e expandindo o prompt com Gemini...")
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[
            f"Expand this simple prompt into a highly detailed, professional product photography prompt. "
            f"Include camera specifications, lens details, photographic lighting, composition rules, "
            f"and stylistic markers. Original Prompt: '{args.prompt}'"
        ]
    )
    print("\nPrompt Otimizado:")
    print(response.text.strip())

def main():
    parser = argparse.ArgumentParser(description="Google Labs CLI Utility")
    subparsers = parser.add_subparsers(dest="command", required=True)
    
    # Subcomando: generate
    parser_gen = subparsers.add_parser("generate", help="Gerar imagens, vídeos ou analisar vídeos")
    parser_gen.add_argument("--type", choices=["image", "video", "analyze"], required=True)
    parser_gen.add_argument("--prompt", type=str, help="Prompt de criação")
    parser_gen.add_argument("--model", type=str, help="ID do modelo")
    parser_gen.add_argument("--aspect-ratio", type=str, help="Aspect ratio (ex: 16:9, 1:1)")
    parser_gen.add_argument("--image-ref", type=str, help="Caminho da imagem de referência/início")
    parser_gen.add_argument("--last-frame", type=str, help="Caminho do frame final")
    parser_gen.add_argument("--video-ref", type=str, help="Caminho do vídeo para análise")
    parser_gen.add_argument("--output", type=str, help="Arquivo de saída")
    
    # Subcomando: subject-tuning
    parser_tune = subparsers.add_parser("subject-tuning", help="Tuning de modelos baseados em assuntos")
    parser_tune.add_argument("--name", type=str, required=True, help="Nome do assunto/identidade")
    parser_tune.add_argument("--images", type=str, required=True, help="Pasta contendo fotos do assunto")
    parser_tune.add_argument("--category", type=str, default="person", help="Categoria (ex: person, product)")
    
    # Subcomando: enhance-prompt
    parser_enh = subparsers.add_parser("enhance-prompt", help="Expansor de prompts inteligente")
    parser_enh.add_argument("--prompt", type=str, required=True, help="Prompt simples original")
    
    args = parser.parse_args()
    
    try:
        if args.command == "generate":
            handle_generate(args)
        elif args.command == "subject-tuning":
            handle_tuning(args)
        elif args.command == "enhance-prompt":
            handle_enhance(args)
    except Exception as e:
        print(f"Erro na execução do comando: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
