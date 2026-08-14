# Plano do Sprint 2

## 1. Diagnóstico Resumido

O Sprint 1 estabeleceu toda a infraestrutura base (Modelos, API, UI e Providers). No entanto, o Sprint 2 requer robustez: é preciso solidificar a documentação de scoring (`scoring-v1.md`), implementar os testes de interface e integração faltantes (especialmente para a lista, busca, filtros e watchlist), bem como formalizar a camada final de testes para garantir que tudo (ingestão, armazenamento e visualização) funciona sob as restrições do novo Sprint.

## 2. Objetivo

Garantir e testar o núcleo operacional mínimo do radar, confirmando a conectividade de dados reais, resiliência do scoring e a solidez da visualização e watchlist por meio de uma cobertura de testes e correção de possíveis gaps de validação.

## 3. Escopo

- Escrever `docs/scoring-v1.md` conforme exigido, baseando-se no atual modelo.
- Adicionar testes de interface (Unitários/Integração) em React (Lista, Filtros, Detalhes, Watchlist).
- Reforçar testes do pipeline de integração do backend.
- Garantir sucesso no comando `npm run verify`.
- Consolidar a documentação final (`sprint-2-report.md`).

## 4. Tarefas e Ordem de Implementação

1. **Documentação de Scoring**: Renomear e ajustar `docs/scoring-model.md` para `docs/scoring-v1.md`.
2. **Setup de Testes UI**: Configurar o ambiente de testes na Web, se necessário, ou escrever componentes testes em `__tests__` / vitest.
3. **Escrever Testes Frontend**: Cobrir carregamento de oportunidades, watchlist, filtros, estados vazios.
4. **Validar Pipeline Backend**: Verificar e rodar os testes do backend usando virtual env e resolver qualquer pendência no `npm run verify`.
5. **Relatório**: Produzir `docs/sprint-2-report.md`.

## 5. Critérios de Aceite

- `docs/scoring-v1.md` deve existir com as regras exigidas.
- Componentes da interface devem ter testes verificando carregamento, pesquisa, filtros, detalhes e watchlist.
- `npm run verify` deve rodar com sucesso.
- O relatório final (`docs/sprint-2-report.md`) descreve as entregas e testes rodados.

## 6. Riscos e Fora de Escopo

- **Risco:** O tempo necessário para cobrir totalmente a interface com testes unitários; focaremos nos fluxos críticos exigidos (lista, filtros, watchlist, erro).
- **Fora de Escopo:** Melhorias visuais, novas funcionalidades na API, execuções de trade ou autenticação real, refatoração de providers de mercado (pois já funcionam).
