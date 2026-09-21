# Catálogo de serviços — implementação e validação

Data: 21 de setembro de 2026. Branch de trabalho: `main`, base `9473153`. Implementação local, sem commit, push ou publicação.

## Resultado

- Sete macroserviços e 17 ofertas ativas na fonte canónica `data/services.ts`.
- Novas LPs: `/servicos/ia-automacao`, `/servicos/solucoes-restaurantes`, `/servicos/digitalizacao-negocios`.
- As quatro URLs anteriores foram mantidas. A grelha existente de `/servicos` foi extraída para `ServicesCatalog`, mantendo o visual e o alvo único `#grid-servicos`.
- `Basic3DScene`, Earth, ScrollManager, hotspots, refs e gestos não foram alterados. O 3D continua com quatro destaques na homepage; não existia uma segunda cena 3D em `/servicos`.
- Cada LP apresenta as ofertas ativas com destinatários, entregáveis, preço inicial, prazo indicativo e contacto. Ofertas inativas são filtradas.
- O `ItemList` usa a ordem e os slugs reais da coleção. As sete LPs reutilizam a geração estática, metadata, canonical, Open Graph, Twitter e JSON-LD existentes.
- Não foi adicionado `Offer` ao Schema.org. IVA, licenças, âmbito e recorrência são confirmados na proposta; os valores não são um orçamento fechado.
- Navegação entre catálogo e LPs preserva as cinco UTMs convencionais. Os links de e-mail incluem serviço, oferta quando aplicável e origem. Outros parâmetros não são copiados para o contacto. Não foi introduzido analytics, CRM ou armazenamento de atribuição persistente.
- O contacto da listagem passou a ter um alvo real. As novas LPs usam os CTAs específicos do documento. A oferta de reservas exige validação do fluxo e distingue pedido de confirmação; não anuncia integração com terceiros.

## Ficheiros

| Ficheiro | Alteração |
|---|---|
| `data/services.ts` | Modelo, sete serviços, 17 ofertas, índices derivados, conteúdo revisto e ItemList |
| `components/ServicesCatalog.tsx` | Grelha reutilizável, imagens dimensionadas e foco visível |
| `components/ServiceOffers.tsx` | Ofertas ativas e condições comerciais |
| `components/ServiceContactLink.tsx` | Links com atribuição e contactos contextualizados |
| `lib/service-attribution.ts` | Filtragem/serialização das UTMs e construção dos links |
| `app/servicos/ServicosClient.tsx` | Integração da grelha e contacto da listagem |
| `app/servicos/page.tsx` | Metadata e JSON-LD derivados |
| `app/servicos/[slug]/ServicoDetalheClient.tsx` | Ofertas, CTAs, resultados qualitativos e ajuste móvel das novas LPs |
| `data/restaurants.ts` | Exclusão dos campos comerciais na herança de `ServiceLP`; nenhum dado de restaurante alterado |
| `agent/knowledge-base.ts` | Serviços e ofertas derivados do catálogo, removendo resultados típicos sem evidência |
| `agent/config.ts` | Exemplos comerciais sem percentagens nem prazo garantido |
| `data/universo-2d.ts` | Métricas de serviços derivadas e neutralização de garantias de desempenho repetidas |
| `app/universo-2d/components/SocialProofSection.tsx` | Compromissos qualitativos derivados, sem apresentar médias como prova |
| `app/universo-2d/components/Universo2DFooter.tsx` | SLA definido por projeto em vez de uptime garantido |
| `data/__tests__/services.test.ts` | Contratos do catálogo, destinos, SEO e atribuição |

As alterações preexistentes em `eco/youlearn/data/index.ts`, o objeto de conhecimento não rastreado e `public/eco/` foram preservadas.

## Auditoria de alegações

Não foi identificada documentação que satisfaça cliente/período/método/ferramenta/autorização para as médias do catálogo. Não se assumiu evidência a partir da repetição de um número no código.

| Grupo inventariado | Classificação | Tratamento |
|---|---|---|
| Leads +180%, PageSpeed 98+, ROI +240%, uptime 99.9%, crescimento 3×, alcance +65%, CPL -42%, ROAS 3.8× | Não comprovada | Substituído por processo, medição e âmbito acordado |
| Entrega média em 7 dias, MVP médio em 4 semanas, resultados em 30 dias e primeiras leads em 48–72h | Não comprovada | Removida a apresentação como média/garantia; prazo conforme oferta e diagnóstico |
| Universo 2D: ROAS 4.8x, CAC -35%, tracking 99.4%, uptime 99.98%, latência/capacidade/RAG e horas poupadas nos cards de serviços | Não comprovada | Cards passam a derivar compromissos qualitativos do catálogo |
| Diagnóstico, aprovação, documentação, testes, calendário e medição | Operacional, como âmbito proposto | Texto descreve entregáveis a acordar; não é evidência de resultados passados |
| Preços, quantidades e prazos das 17 ofertas | Âncoras comerciais fornecidas na especificação | Mantidos como iniciais/indicativos, sujeitos a confirmação |
| Descontos e quantidades dos planos existentes | Condições comerciais preexistentes, não médias de desempenho | Preservados; a política comercial dos planos não foi redefinida |
| Percentagem de scroll, números de etapas e dimensões de UI | Operacional/técnica | Preservados |

A procura das métricas originais também encontrou um `uptime="99.9%"` na barra técnica de `/labs` e exemplos no comentário de `CountUp`. Estes não pertencem ao catálogo comercial; não foram alterados nem considerados prova. Indicadores de outros produtos e portfolio não foram certificados por esta auditoria.

## Validação

O projeto usa npm (`package-lock.json`). Não existem scripts `typecheck` nem `test` no `package.json`; foram usados TypeScript diretamente e testes de contrato com o `tsx` já instalado.

Evidência versionável em `reports/catalogo-servicos/`: lint antes/depois, build final, resultados dos testes e estado HTTP/SEO das oito páginas.

| Comando/verificação | Antes | Depois |
|---|---|---|
| `npx tsc --noEmit` | Passou | Passou |
| `npm run build` | Passou, 74 páginas | Passou, 77 páginas, incluindo as três novas LPs |
| `npm run lint` | 38 erros, 32 avisos | Mesma base de erros/avisos; ver evidência anexada |
| `npx tsx --test data/__tests__/services.test.ts` | Testes novos | 3 testes passaram |
| `npx eslint components/ServiceContactLink.tsx components/ServiceOffers.tsx components/ServicesCatalog.tsx lib/service-attribution.ts data/services.ts data/__tests__/services.test.ts` | Não aplicável | 0 erros; 1 aviso de `img`, preservando a estratégia visual existente |
| `git diff --check` | — | Passou; apenas avisos Git sobre normalização LF/CRLF |
| Servidor `npm run start -- --hostname 127.0.0.1 --port 3000` | — | Build de produção local validado |
| HTTP e SEO | — | `/servicos` + sete LPs com 200; canonical, Open Graph e JSON-LD válidos; slug inexistente com 404 |
| Contratos | — | Sete slugs únicos, 17 IDs únicos, quatro destaques, imagens existentes, ItemList ordenado e sem Offer |

Verificação no navegador: grelha em 1280, 768 e 320 px; ofertas em tablet e mobile de 390 px; contacto das novas LPs em 320 px. Sete LPs verificadas no navegador, sem overflow horizontal detetado. O foco por Tab na grelha tem contorno visível; o alvo `#grid-servicos` ficou abaixo da navbar. Confirmadas UTMs no destino do card e no corpo do e-mail sem enviar mensagens. Corrigido o texto cortado do CTA das novas LPs em 320 px. Os quatro destinos da experiência 3D permanecem presentes; a navegação pelos destaques foi inspecionada visualmente.

## Limites e pendências

- O lint global continua bloqueado por problemas preexistentes fora desta implementação, incluindo regras de hooks em componentes Eco. Não foram corrigidos fora do escopo.
- Preços, IVA, licenças e condições de operação exigem confirmação em cada proposta; não foi criado checkout nem publicado preço estruturado como Offer.
- Validação feita no servidor local de produção. Não houve deploy, envio de e-mail, integração externa ou alteração noutros repositórios.
- Não foi feita auditoria global de todos os produtos Labs/Eco, certificação de performance nem emulação de gestos tácteis físicos. O código da experiência imersiva foi preservado.
