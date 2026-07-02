import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

          // Injeta aprendizados do Firebase se existirem
          if (Array.isArray(learnings) && learnings.length > 0) {
            const learnBlock = `\n\n═══ APRENDIZADOS ACUMULADOS (aplique) ═══\n${learnings.slice(0, 5).map((l: any, i: number) => `${i + 1}. ${l.text || l}`).join('\n')}\n`;
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
    // 1. ANTHROPIC (Claude)
    // ==========================================
    if (provider === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured on server.");

      const body: any = { 
        model: model, 
        max_tokens: 3200, 
        messages: [{ role: "user", content: prompt }] 
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
      return NextResponse.json({ content: [{ type: "text", text }] });
    }
    
    // ==========================================
    // 2. GOOGLE (Gemini)
    // ==========================================
    if (provider === 'google') {
      const apiKey = process.env.GOOGLE_API_KEY; 
      if (!apiKey) throw new Error("GOOGLE_API_KEY not configured on server.");

      const body: any = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 3200 }
      };

      if (systemPrompt) {
        body.systemInstruction = {
          parts: [{ text: systemPrompt }]
        };
      }

      if (withSearch) {
        body.tools = [{ googleSearch: {} }];
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Google API Error");

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return NextResponse.json({ content: [{ type: "text", text }] });
    }

    // ==========================================
    // 3. DEEPSEEK
    // ==========================================
    if (provider === 'deepseek') {
      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) throw new Error("DEEPSEEK_API_KEY not configured on server.");

      const messages: any[] = [];
      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
      }
      messages.push({ role: "user", content: prompt });

      const body = {
        model: model,
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
      return NextResponse.json({ content: [{ type: "text", text }] });
    }

    // ==========================================
    // 4. OPENROUTER
    // ==========================================
    if (provider === 'openrouter') {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured on server.");

      const messages: any[] = [];
      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
      }
      messages.push({ role: "user", content: prompt });

      const body = {
        model: model,
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
      return NextResponse.json({ content: [{ type: "text", text }] });
    }

    throw new Error(`Unsupported provider: ${provider}`);

  } catch (error: any) {
    console.error("Oracle API Error:", error);
    return NextResponse.json({ error: { message: error.message || "Internal Server Error" } }, { status: 500 });
  }
}
