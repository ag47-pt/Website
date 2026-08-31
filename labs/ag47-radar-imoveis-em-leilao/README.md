# Radar de Leilões Imobiliários

MVP rápido para análise de viabilidade em leilões imobiliários.

## Como executar

```bash
cd "c:\Users\moise\Desktop\Agencia47\DEV\DEVELOPING\SANDBOX\Ag47.pt\labs\ag47-radar-imoveis-em-leilao"
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

A aplicação será aberta em `http://localhost:5000`.

## Objetivo do MVP

- Landing page com proposta de valor clara.
- Formulário de avaliação de lote em leilão.
- Score de viabilidade com custo total, yield e risco.
- Base para validação de ICP e campanha de oferta.

## Arquitetura mínima

- Front-end: HTML + CSS + JS
- Back-end: Flask
- Dados: estrutura em memória / JSON
- Próxima iteração: banco relacional e integração com edital
