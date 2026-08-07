import os
import re
import sys
from pathlib import Path

# Paths
ROOT_DIR = Path(__file__).parent.parent.resolve()
DOC_PATH = ROOT_DIR / "docs" / "next-sprints.md"
API_FILE = ROOT_DIR / "apps" / "api" / "src" / "ag47_radar" / "evolution.py"
WEB_FILE = ROOT_DIR / "apps" / "web" / "lib" / "evolution.ts"

def parse_sprints(doc_text):
    sprints = {}
    # Find list items like: - **Sprint 7**: Title (description)
    list_matches = re.finditer(r"- \*\*Sprint (\d+)\*\*: (.*?)(?: \((.*?)\))?$", doc_text, re.MULTILINE)
    for m in list_matches:
        sprint_num = int(m.group(1))
        title = m.group(2).strip()
        now = m.group(3).strip() if m.group(3) else title
        # Often the list item is like: - **Sprint X**: Title (detail...
        # If there's no parenthesis, maybe the description is in a list or quote below, 
        # but let's try to extract something reasonable.
        if " (" in title:
            title_parts = title.split(" (", 1)
            title = title_parts[0]
            now = title_parts[1].rstrip(")")
        sprints[sprint_num] = {"title": title, "now": now}
        
    # Find h3 headers like: ### Sprint 11: Title
    h3_matches = re.finditer(r"### Sprint (\d+): (.*?)\n\n> \*\*Objetivo:\*\* (.*?)\n", doc_text, re.MULTILINE)
    for m in h3_matches:
        sprint_num = int(m.group(1))
        title = m.group(2).strip()
        # Remove (Próximo Ciclo) etc from title
        title = re.sub(r"\s*\(.*?\)$", "", title)
        now = m.group(3).strip()
        sprints[sprint_num] = {"title": title, "now": now}

    return sprints

def update_api_file(sprint_num, sprint_data, completed_steps, total_steps, goal):
    content = API_FILE.read_text(encoding="utf-8")
    
    content = re.sub(r'phase="Sprint \d+"', f'phase="Sprint {sprint_num}"', content)
    content = re.sub(r'phase_title=".*?"', f'phase_title="{sprint_data["title"]}"', content)
    content = re.sub(r'now=".*?"', f'now="{sprint_data["now"]}"', content)
    content = re.sub(r'completed_steps=\d+', f'completed_steps={completed_steps}', content)
    content = re.sub(r'total_steps=\d+', f'total_steps={total_steps}', content)
    content = re.sub(r'goal=".*?"', f'goal="{goal}"', content)
    
    API_FILE.write_text(content, encoding="utf-8")
    print(f"Updated {API_FILE}")

def update_web_file(sprint_num, sprint_data, completed_steps, total_steps, goal):
    content = WEB_FILE.read_text(encoding="utf-8")
    
    content = re.sub(r'phase: "Sprint \d+"', f'phase: "Sprint {sprint_num}"', content)
    content = re.sub(r'phaseTitle: ".*?"', f'phaseTitle: "{sprint_data["title"]}"', content)
    content = re.sub(r'now: ".*?"', f'now: "{sprint_data["now"]}"', content)
    content = re.sub(r'completedSteps: \d+', f'completedSteps: {completed_steps}', content)
    content = re.sub(r'totalSteps: \d+', f'totalSteps: {total_steps}', content)
    content = re.sub(r'goal: ".*?"', f'goal: "{goal}"', content)
    
    WEB_FILE.write_text(content, encoding="utf-8")
    print(f"Updated {WEB_FILE}")

def main():
    if len(sys.argv) < 2:
        print("Uso: python update_evolution.py <numero_do_sprint> [completed_steps] [total_steps]")
        sys.exit(1)
        
    target_sprint = int(sys.argv[1])
    
    completed_steps = int(sys.argv[2]) if len(sys.argv) > 2 else target_sprint - 1
    total_steps = int(sys.argv[3]) if len(sys.argv) > 3 else 12
    goal = "Lóbulo Observacional do Organismo Cognitivo"
    
    if not DOC_PATH.exists():
        print(f"File not found: {DOC_PATH}")
        sys.exit(1)
        
    doc_text = DOC_PATH.read_text(encoding="utf-8")
    sprints = parse_sprints(doc_text)
    
    if target_sprint not in sprints:
        print(f"Sprint {target_sprint} não encontrado no arquivo {DOC_PATH}")
        print("Sprints disponíveis:", list(sprints.keys()))
        sys.exit(1)
        
    sprint_data = sprints[target_sprint]
    
    update_api_file(target_sprint, sprint_data, completed_steps, total_steps, goal)
    update_web_file(target_sprint, sprint_data, completed_steps, total_steps, goal)
    print(f"Sucesso! Atualizado para Sprint {target_sprint}: {sprint_data['title']}")

if __name__ == "__main__":
    main()
