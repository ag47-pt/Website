from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]

BOARD = {
    "Remaining Cards": [
        {
            "id": "RC-01",
            "title": "Integrar coleta de leads e CRM",
            "module": "Growth",
            "priority": "Alta",
            "status": "Remaining Cards",
            "files": ["app.py", "templates/index.html"],
        },
        {
            "id": "RC-02",
            "title": "Análise de edital e documento PDF",
            "module": "Due Diligence",
            "priority": "Alta",
            "status": "Remaining Cards",
            "files": ["docs/PRD.md"],
        },
    ],
    "A Decidir": [
        {
            "id": "AD-01",
            "title": "Definir stack de persistência e CRM",
            "module": "Arquitetura",
            "priority": "Alta",
            "status": "A Decidir",
            "files": ["app.py"],
        }
    ],
    "Pronto para Fazer": [
        {
            "id": "PF-01",
            "title": "Implementar validação de imóvel por lote",
            "module": "MVP",
            "priority": "Alta",
            "status": "Pronto para Fazer",
            "files": ["app.py"],
        }
    ],
    "Em Andamento": [
        {
            "id": "EA-01",
            "title": "Landing page + formulário de avaliação",
            "module": "Frontend",
            "priority": "Alta",
            "status": "Em Andamento",
            "files": ["templates/index.html", "static/styles.css", "static/app.js"],
        }
    ],
    "Validar": [
        {
            "id": "VL-01",
            "title": "Validar UX, conversão e score de risco",
            "module": "QA",
            "priority": "Alta",
            "status": "Validar",
            "files": ["app.py", "templates/index.html"],
        }
    ],
    "Concluído": [
        {
            "id": "CC-01",
            "title": "MVP funcional de score de viabilidade",
            "module": "MVP",
            "priority": "Alta",
            "status": "Concluído",
            "files": ["app.py"],
        }
    ],
}


def export_kanban():
    output = ROOT / "docs" / "miro_kanban.json"
    output.write_text(json.dumps(BOARD, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Board exportado em: {output}")


if __name__ == "__main__":
    export_kanban()
