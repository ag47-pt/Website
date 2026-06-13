import os
import re
import sys
import json
import io

# Force UTF-8 for stdout to handle emojis on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def analyze_overview(file_path):
    if not os.path.exists(file_path):
        return {"error": f"File not found: {file_path}"}
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Patterns to look for
    patterns = {
        "melhorias": r"(?:melhoria|melhorar|otimizar|corrigir|ajustar|upgrade)\b",
        "padroes_design": r"(?:blueprint|design|estilo|estetica|ui|ux|cores|typography)\b",
        "instrucoes_globais": r"(?:sempre|nunca|obrigatorio|regra|deve)\b",
        "novas_techs": r"(?:biblioteca|library|framework|npm|install|package)\b"
    }

    results = {
        "session_id": os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(file_path)))),
        "extracted_patterns": [],
        "raw_mentions": []
    }

    lines = content.split('\n')
    for i, line in enumerate(lines):
        for category, pattern in patterns.items():
            if re.search(pattern, line, re.IGNORECASE):
                # Capture context (line before and after)
                context = lines[max(0, i-1):min(len(lines), i+2)]
                results["raw_mentions"].append({
                    "category": category,
                    "line": i + 1,
                    "text": line.strip(),
                    "context": " | ".join([c.strip() for c in context])
                })

    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python session_analyzer.py <path_to_overview.txt>")
        sys.exit(1)
    
    path = sys.argv[1]
    analysis = analyze_overview(path)
    print(json.dumps(analysis, indent=2, ensure_ascii=False))
