# Providers de dados

## Contrato comum

Todo provider retorna dados normalizados, identificador da fonte, coleta UTC, qualidade, erros parciais, duração, modo (`live`/`demo`) e indicador stale. Regras de negócio não importam payloads externos.

## Providers reais

### GeckoTerminal — descoberta

- Endpoint: `GET /api/v2/networks/{network}/new_pools`.
- Redes: `eth`, `bsc`, `solana`.
- Descobre pools criados nas últimas 48 horas, até 20 por página.
- Sem autenticação no tier público; API beta, limite documentado de 30 requisições/minuto.
- Fonte: [documentação oficial de novos pools](https://docs.coingecko.com/reference/latest-pools-network) e [guia público GeckoTerminal](https://apiguide.geckoterminal.com/getting-started).

### DexScreener — busca e market data

- Busca: `GET /latest/dex/search?q=...`.
- Pares: `GET /latest/dex/pairs/{chainId}/{pairId}`.
- Tokens: `GET /tokens/v1/{chainId}/{tokenAddresses}`, no máximo 30 endereços.
- Sem autenticação na API pública.
- Limites documentados: 300 requisições/minuto nesses endpoints; feeds de profiles/boosts possuem 60/minuto.
- Fonte: [referência oficial DexScreener](https://docs.dexscreener.com/api/reference).

O feed `token-profiles/latest` não é apresentado como feed de novos pares. Boosts representam promoção paga e não aumentam comunidade, organicidade ou segurança.

## Providers de demonstração

- Social/Telegram.
- Holders e distribuição.
- Risco de contrato/honeypot.
- Blockchain metadata complementar.
- Entrega externa de alertas.

Esses adapters usam `source=ag47_demo_fixture`, `mode=demo` e nunca são ativados como fallback de uma entidade live. A interface mostra um badge de demonstração junto ao painel afetado.

## Resiliência

- HTTPX assíncrono compartilhado.
- Connect timeout de 3 s e read timeout de 8 s por padrão.
- Até três tentativas somente para transporte, 429, 502, 503 e 504.
- Backoff exponencial com jitter e respeito a `Retry-After`.
- Circuit breaker abre após cinco falhas e tenta recuperação após 60 s.
- Cache padrão: 60 s para descoberta, 30 s para busca/market e 60 s para OHLCV.
- Cache expirado pode ser devolvido como stale durante falha; demo não substitui live.

## Qualidade e campos ausentes

Campos de APIs externas são opcionais. Preço, liquidez, volume, FDV e market cap ausentes permanecem `null`. O provider agrega erros por item sem descartar itens válidos e reduz `data_quality` conforme completude e atualidade.

## Limites legais e operacionais

- O tier GeckoTerminal keyless é voltado a testes de baixo volume; produção comercial precisa de revisão de plano/licença e atribuição.
- Os [termos oficiais da API DexScreener](https://docs.dexscreener.com/api/api-terms-and-conditions) restringem produtos cujo propósito principal concorra diretamente com o serviço. É necessária revisão jurídica/produto antes de lançamento comercial.
- Não há scraping de páginas ou contorno de autenticação.

## Como adicionar um provider real

1. Implementar o protocolo correspondente e normalizar para o domínio interno.
2. Registrar fonte, autenticação, limites e termos nesta documentação.
3. Adicionar testes de contrato com transporte mockado, campos ausentes e rate limit.
4. Tornar a seleção explícita por configuração; nunca habilitar mistura demo/live implícita.
5. Executar uma integração opt-in de baixo volume e registrar a data da verificação.
