import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MODEL_LABELS: Record<string, string> = {
  'claude-3-7-sonnet-20250219': 'Claude 3.7 Sonnet',
  'claude-3-5-haiku-20241022': 'Claude 3.5 Haiku',
  'gemini-2.5-pro': 'Gemini 2.5 Pro',
  'gemini-2.5-flash': 'Gemini 2.5 Flash',
  'deepseek-chat': 'DeepSeek Chat',
  'deepseek-reasoner': 'DeepSeek Reasoner',
  'openai/gpt-4o': 'GPT-4o',
  'meta-llama/llama-3.3-70b-instruct': 'LLaMA 3.3 70B',
  'qwen/qwen-2.5-72b-instruct': 'Qwen 2.5 72B',
};

function buildLLMStamp(provider: string, model: string) {
  return {
    provider,
    model,
    label: MODEL_LABELS[model] || model,
    timestamp: Date.now(),
  };
}

async function performGoogleSearch(query: string, apiKey: string): Promise<string> {
  try {
    const body = {
      contents: [{ role: "user", parts: [{ text: `Busque na web e retorne um resumo detalhado e factual contendo as principais informações (últimos jogos, escalações prováveis, desfalques, odds, motivação e clima/mando) para responder/analisar o seguinte confronto: ${query}` }] }],
      generationConfig: { maxOutputTokens: 1200 },
      tools: [{ googleSearch: {} }]
    };
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini Search Fallback failed:", errorText);
      return "";
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (err) {
    console.error("Error in performGoogleSearch:", err);
    return "";
  }
}

export async function POST(req: Request) {
  try {
    const { 
      prompt, 
      withSearch = true, 
      provider = 'anthropic', 
      model = 'claude-3-7-sonnet-20250219',
      useSkill = false,
      learnings = []
    } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: { message: "Prompt is required" } }, { status: 400 });
    }

    // ==========================================
    // TASK 1.3: OTIMIZAÇÃO DE CUSTOS DE RESOLUÇÃO (Gemini 2.5 Flash fallback)
    // ==========================================
    let finalProvider = provider;
    let finalModel = model;
    
    const isResultCheck = prompt.includes("resultado FINAL") && (prompt.includes("homeScore") || prompt.includes("found"));
    if (isResultCheck) {
      finalProvider = 'google';
      finalModel = 'gemini-2.5-flash';
    }

    // Fallback de segurança caso a chave do provedor selecionado não esteja configurada
    if (finalProvider === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
      finalProvider = 'google';
      finalModel = 'gemini-2.5-flash';
    } else if (finalProvider === 'deepseek' && !process.env.DEEPSEEK_API_KEY) {
      finalProvider = 'google';
      finalModel = 'gemini-2.5-flash';
    } else if (finalProvider === 'openrouter' && !process.env.OPENROUTER_API_KEY) {
      finalProvider = 'google';
      finalModel = 'gemini-2.5-flash';
    }

    // ==========================================
    // LEITURA DINÂMICA DA SKILL
    // ==========================================
    let systemPrompt = '';
    if (useSkill) {
      try {
        const skillPath = path.join(process.cwd(), 'labs', 'oracle-trader-footboll', 'oracle-trader-footbol-skill.md');
        if (fs.existsSync(skillPath)) {
          let skillContent = fs.readFileSync(skillPath, 'utf-8');
          
          // Remove YAML Frontmatter se presente
          if (skillContent.startsWith('---')) {
            const secondDashIndex = skillContent.indexOf('---', 3);
            if (secondDashIndex !== -1) {
              skillContent = skillContent.slice(secondDashIndex + 3).trim();
            }
          }
          systemPrompt = skillContent;

          // ==========================================
          // TASK 1.2: FILTRAGEM CONTEXTUAL DE APRENDIZADOS
          // ==========================================
          if (Array.isArray(learnings) && learnings.length > 0) {
            // Extrai palavras-chave do prompt do confronto (ignora stop words de 3 letras ou comuns)
            const stopWords = new Set(["jogo", "fase", "horário", "previsto", "data", "contra", "versus", "neutro", "neutra", "rodada", "grupo", "grupos"]);
            const promptWords = prompt
              .toLowerCase()
              .replace(/[^\w\s]/g, ' ')
              .split(/\s+/)
              .filter((w: string) => w.length >= 3 && !stopWords.has(w));

            // Filtra aprendizados relevantes
            let relevantLearnings = learnings.filter((l: any) => {
              const text = (l.text || l).toLowerCase();
              return promptWords.some((word: string) => text.includes(word));
            });

            // Se nenhum corresponder, usa o fallback dos mais recentes
            if (relevantLearnings.length === 0) {
              relevantLearnings = learnings;
            }

            const learnBlock = `\n\n═══ APRENDIZADOS ACUMULADOS (aplique) ═══\n${relevantLearnings.slice(0, 5).map((l: any, i: number) => `${i + 1}. ${l.text || l}`).join('\n')}\n`;
            systemPrompt += learnBlock;
          }
        } else {
          console.warn("Skill file not found at path:", skillPath);
        }
      } catch (err) {
        console.error("Error reading skill file:", err);
      }
    }

    // ==========================================
    // TASK 1.1: WEB SEARCH FALLBACK PARA PROVEDORES NÃO-NATIVOS (DeepSeek/OpenRouter)
    // ==========================================
    let searchContext = "";
    if (withSearch && finalProvider !== 'google' && finalProvider !== 'anthropic') {
      const googleApiKey = process.env.GOOGLE_API_KEY;
      if (googleApiKey) {
        try {
          searchContext = await performGoogleSearch(prompt, googleApiKey);
        } catch (e) {
          console.error("Error doing fallback search:", e);
        }
      }
    }

    if (searchContext) {
      const searchBlock = `\n\n═══ CONTEXTO DE PESQUISA EM TEMPO REAL (GOOGLE SEARCH) ═══\n${searchContext}\n`;
      if (systemPrompt) {
        systemPrompt += searchBlock;
      } else {
        systemPrompt = searchBlock;
      }
    }

    // ==========================================
    // 1. ANTHROPIC (Claude)
    // ==========================================
    if (finalProvider === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured on server.");

      // TASK 1.4: Strict output parameter enforcement
      let finalPrompt = prompt;
      if (prompt.includes("JSON") || (systemPrompt && systemPrompt.includes("JSON"))) {
        finalPrompt += "\n\nCRITICAL: You must return ONLY the raw JSON object. Do not wrap the JSON in markdown code blocks like ```json ... ```. Do not include any explanation or preamble text outside of the JSON structure.";
      }

      const body: any = { 
        model: finalModel, 
        max_tokens: 3200, 
        messages: [{ role: "user", content: finalPrompt }] 
      };

      if (systemPrompt) {
        body.system = systemPrompt;
      }

      if (withSearch) {
        body.tools = [{ type: "web_search_20250305", name: "web_search" }];
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Anthropic API Error");

      const text = data.content?.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('\n') || "";
      return NextResponse.json({ content: [{ type: "text", text }], llmStamp: buildLLMStamp(finalProvider, finalModel) });
    }
    
    // ==========================================
    // 2. GOOGLE (Gemini)
    // ==========================================
    if (finalProvider === 'google') {
      const apiKey = process.env.GOOGLE_API_KEY; 
      if (!apiKey) throw new Error("GOOGLE_API_KEY not configured on server.");

      // TASK 1.4: Structured Output Nativo para Gemini (apenas se não usar pesquisa)
      const generationConfig: any = { maxOutputTokens: 3200 };
      if ((prompt.includes("JSON") || (systemPrompt && systemPrompt.includes("JSON"))) && !withSearch) {
        generationConfig.responseMimeType = "application/json";
      }

      let finalPrompt = prompt;
      if ((prompt.includes("JSON") || (systemPrompt && systemPrompt.includes("JSON"))) && withSearch) {
        finalPrompt += "\n\nCRITICAL: You must return ONLY the raw JSON object. Do not wrap the JSON in markdown code blocks like ```json ... ```. Do not include any explanation or preamble text outside of the JSON structure.";
      }

      const body: any = {
        contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
        generationConfig: generationConfig
      };

      if (systemPrompt) {
        body.systemInstruction = {
          parts: [{ text: systemPrompt }]
        };
      }

      if (withSearch) {
        body.tools = [{ googleSearch: {} }];
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${finalModel}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Google API Error");

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return NextResponse.json({ content: [{ type: "text", text }], llmStamp: buildLLMStamp(finalProvider, finalModel) });
    }

    // ==========================================
    // 3. DEEPSEEK
    // ==========================================
    if (finalProvider === 'deepseek') {
      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) throw new Error("DEEPSEEK_API_KEY not configured on server.");

      const messages: any[] = [];
      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
      }
      
      let finalPrompt = prompt;
      if (prompt.includes("JSON") || (systemPrompt && systemPrompt.includes("JSON"))) {
        finalPrompt += "\n\nCRITICAL: You must return ONLY the raw JSON object. Do not wrap the JSON in markdown code blocks like ```json ... ```. Do not include any explanation or preamble text outside of the JSON structure.";
      }
      messages.push({ role: "user", content: finalPrompt });

      const body = {
        model: finalModel,
        messages: messages
      };

      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "DeepSeek API Error");

      const text = data.choices?.[0]?.message?.content || "";
      return NextResponse.json({ content: [{ type: "text", text }], llmStamp: buildLLMStamp(finalProvider, finalModel) });
    }

    // ==========================================
    // 4. OPENROUTER
    // ==========================================
    if (finalProvider === 'openrouter') {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured on server.");

      const messages: any[] = [];
      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
      }
      
      let finalPrompt = prompt;
      if (prompt.includes("JSON") || (systemPrompt && systemPrompt.includes("JSON"))) {
        finalPrompt += "\n\nCRITICAL: You must return ONLY the raw JSON object. Do not wrap the JSON in markdown code blocks like ```json ... ```. Do not include any explanation or preamble text outside of the JSON structure.";
      }
      messages.push({ role: "user", content: finalPrompt });

      const body = {
        model: finalModel,
        messages: messages
      };

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://ag47.pt",
          "X-Title": "Agência 47"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "OpenRouter API Error");

      const text = data.choices?.[0]?.message?.content || "";
      return NextResponse.json({ content: [{ type: "text", text }], llmStamp: buildLLMStamp(finalProvider, finalModel) });
    }

    throw new Error(`Unsupported provider: ${provider}`);

  } catch (error: any) {
    console.error("Oracle API Error:", error);
    return NextResponse.json({ error: { message: error.message || "Internal Server Error" } }, { status: 500 });
  }
}
