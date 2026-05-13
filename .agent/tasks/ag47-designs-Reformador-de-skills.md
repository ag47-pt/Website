# Task: Criar Skill ag47-designs-Reformador-de-skills

## 🎯 Objetivo
Desenvolver uma skill inteligente que atue como um "zelador e evoluidor" do sistema Antigravity. Ela deve aprender com as interações do usuário, extrair novos padrões de design/código e reformar skills existentes para máxima potência.

## 🛠️ Componentes

### 1. Diretório da Skill
`.agent/skills/ag47-designs-Reformador-de-skills/`

### 2. SKILL.md
Instruções imperativas para o modelo sobre como:
- Ler `overview.txt` (sessão atual).
- Acessar `<appDataDir>/brain/<conversation-id>/` para logs passados.
- Identificar padrões repetitivos e melhorias sugeridas pelo usuário.
- Criar um **Plano de Reforma** (Artifact).
- Aplicar edições via `multi_replace_file_content`.

### 3. Scripts Auxiliares (`scripts/`)
- `session_analyzer.py`: Script Python para extrair entidades, tecnologias e preferências estéticas mencionadas na sessão.
- `skill_patcher.py`: Utilitário para aplicar atualizações estruturais em arquivos `SKILL.md` mantendo a integridade do frontmatter.

## 📝 Plano de Execução

### Fase 1: Fundação
1. Criar a estrutura de pastas.
2. Escrever o `SKILL.md` inicial com foco em "Metacognição".

### Fase 2: Inteligência de Sessão
1. Desenvolver `session_analyzer.py` para ler o `overview.txt`.
2. Integrar lógica de busca no diretório `brain/` para contexto histórico.

### Fase 3: Ação de Reforma
1. Implementar a lógica de "Update Plan" que mapeia mudanças para skills específicas.
2. Adicionar suporte para atualizar o próprio `skill-creator`.

### Fase 4: Teste de Voo
1. Usar a nova skill para reformar a si mesma ou uma skill menor (ex: `brainstorming`).

---

## 🚦 Critérios de Sucesso
- [ ] Skill detectada pelo sistema.
- [ ] Capacidade de ler e resumir o `overview.txt`.
- [ ] Propor edições em `SKILL.md` de terceiros com base em conversas recentes.
- [ ] Não limitar a projetos específicos, mantendo a inteligência agnóstica.
