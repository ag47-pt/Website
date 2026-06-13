# Server-Sent Events (SSE) & Telemetria APEX

> A telemetria moderna e os Cockpits da Agência 47 dependem de fluxos contínuos de dados (Streaming), não apenas requisições estáticas `Response.json()`.
> **Think: Streaming-first for high performance logs & UI.**

---

## 1. O Problema das Respostas Estáticas

Ao construir Agentes Autônomos (Swarms) ou painéis de telemetria (Cockpits), processamentos são lentos ou geram logs parciais úteis. 
- **O Anti-Padrão**: Fazer o cliente esperar a resposta completa com JSON: `return Response.json(result)`
- **O Efeito Colateral**: O Frontend exibe um "Loading..." entediante, escondendo a inteligência e as etapas de decisão do Agente.

## 2. A Solução: Server-Sent Events (SSE) via Web Streams

Para painéis de controle no formato **APEX Cockpit / Labs Blueprint**, utilize **Server-Sent Events** combinados com o padrão Web Streams (`ReadableStream`, `TransformStream`).

Isso garante que o servidor rode em ambientes **Edge (Cloudflare Workers, Vercel Edge Runtime)** e envie pacotes em tempo real.

### Implementação Base no Backend (Exemplo Next.js App Router / Edge)

```typescript
export const runtime = 'edge'; // Opcional, mas SSE funciona perfeitamente aqui.

export async function POST(req: Request) {
  // 1. Cria-se o encoder para SSE (formato `data: {...}\n\n`)
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // 2. Lógica assíncrona desacoplada
  (async () => {
    try {
      // Exemplo: Dispara a engine, que yielda estados.
      // Em produção, a lógica "agentica" é um Async Generator
      for await (const log of agentDecisionEngine(req)) {
        const payload = \`data: \${JSON.stringify({ type: 'log', message: log })}\n\n\`;
        await writer.write(encoder.encode(payload));
      }
      // Fim
      await writer.write(encoder.encode(\`data: \${JSON.stringify({ type: 'done' })}\n\n\`));
    } catch (e) {
      // Emissão de erros seguros (sem vazar stack trace)
      await writer.write(encoder.encode(\`data: \${JSON.stringify({ type: 'error', message: 'Internal Engine Error' })}\n\n\`));
    } finally {
      await writer.close();
    }
  })();

  // 3. Responde IMEDIATAMENTE com o lado legível do stream
  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
```

## 3. Desacoplando o "Cérebro" do "Transporte"

**NÃO** misture a lógica pesada diretamente no endpoint.
Sempre utilize **Async Generators** (`async function*`) no design da lógica de negócios, de forma que o endpoint HTTP apenas converta os `yields` em SSE.

### Padrão de Async Generator (Service Layer):
```typescript
export async function* agentDecisionEngine(input: any) {
  yield "Iniciando avaliação do risco...";
  await sleep(500);
  yield "Calculando Power Law e métricas base...";
  const finalResult = await calculate(input);
  yield "Finalizado. Resultado: " + finalResult.score;
}
```

## 4. Cockpit JSON Contract

Para padronização dos HUDs do frontend e ferramentas como `ag47-designer-labs-miniapps-frontpages`, seus pacotes de streaming devem sempre tentar seguir uma estrutura previsível:

```json
// Pacote SSE padrão emitido pelo backend
{
  "type": "log" | "metric" | "error" | "done",
  "message": "String legível para o HUD do usuário",
  "data": { /* ... propriedades extras (preços, scores, etc) ... */ },
  "timestamp": 1718222340200 
}
```

## Resumo das Regras
- **Use Web Streams (`TransformStream`)** para construir o pipeline.
- Envie com **`Content-Type: text/event-stream`**.
- Encapsule a string enviada com `data: {payload}\n\n` e certifique-se de terminar os envios usando o método `.close()` no writer.
- Evite vazamento de memória verificando a desconexão do cliente caso a runtime suporte o `req.signal`.
