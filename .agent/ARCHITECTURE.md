# Antigravity Kit Architecture

> Comprehensive AI Agent Capability Expansion Toolkit

---

## 📋 Overview

Antigravity Kit is a modular system consisting of- **21 Specialist Agents** - Role-based AI personas
- **55 Skills** - Domain-specific knowledge modules
- **13 Workflows** - Slash command procedures

---

## 🏗️ Directory Structure

```plaintext
.agent/
├── ARCHITECTURE.md          # This file
├── agents/                  # 21 Specialist Agents
├── skills/                  # 53 Skills
├── workflows/               # 13 Slash Commands
├── rules/                   # Global Rules
└── scripts/                 # Master Validation Scripts
```

---

## 🤖 Agents (21)

Specialist AI personas for different domains.

| Agent                    | Focus                      | Skills Used                                              |
| ------------------------ | -------------------------- | -------------------------------------------------------- |
| `orchestrator`           | Multi-agent coordination   | parallel-agents, behavioral-modes, skill-creator         |
| `project-planner`        | Discovery, task planning   | brainstorming, plan-writing, architecture                |
| `frontend-specialist`    | Web UI/UX                  | frontend-design, nextjs-react-expert, tailwind-patterns  |
| `backend-specialist`     | API, business logic        | api-patterns, nodejs-best-practices, database-design     |
| `database-architect`     | Schema, SQL                | database-design, prisma-expert                           |
| `mobile-developer`       | iOS, Android, RN           | mobile-design                                            |
| `game-developer`         | Game logic, mechanics      | game-development                                         |
| `devops-engineer`        | CI/CD, Docker              | deployment-procedures, docker-expert                     |
| `security-auditor`       | Security compliance        | vulnerability-scanner, red-team-tactics                  |
| `penetration-tester`     | Offensive security         | red-team-tactics                                         |
| `test-engineer`          | Testing strategies         | testing-patterns, tdd-workflow, webapp-testing           |
| `debugger`               | Root cause analysis        | systematic-debugging                                     |
| `performance-optimizer`  | Speed, Web Vitals          | performance-profiling                                    |
| `seo-specialist`         | Ranking, visibility        | seo-fundamentals, geo-fundamentals                       |
| `documentation-writer`   | Manuals, docs              | documentation-templates, doc-coauthoring                 |
| `product-manager`        | Requirements, user stories | plan-writing, brainstorming                              |
| `product-owner`          | Strategy, backlog, MVP     | plan-writing, brainstorming                              |
| `qa-automation-engineer` | E2E testing, CI pipelines  | webapp-testing, testing-patterns                         |
| `code-archaeologist`     | Legacy code, refactoring   | clean-code, code-review-checklist                        |
| `explorer-agent`         | Codebase analysis          | -                                                        |
| `3d-animation-specialist`| 3D Web & Immersive UX      | premium-3d-scroll-page, nextjs-react-expert              |

---

## 🧩 Skills (53)

Modular knowledge domains that agents can load on-demand based on task context.

### Frontend & UI

| Skill                   | Description                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| `nextjs-react-expert`   | React & Next.js performance optimization (Vercel - 57 rules)          |
| `web-design-guidelines` | Web UI audit - 100+ rules for accessibility, UX, performance (Vercel) |
| `tailwind-patterns`     | Tailwind CSS v4 utilities                                             |
| `frontend-design`       | UI/UX patterns, design systems                                        |
| `theme-factory`         | Rapid theme application and generation                                |
| `premium-3d-scroll-page`| High-end 3D & Lerp scroll experiences                                 |
| `web-artifacts-builder` | Multi-component React/Tailwind/Shadcn artifact creation               |
| `ag47-designer-labs-landing-pages`| High-end Ag47 Landing Pages with Labs Blueprint aesthetic             |
| `ag47-designer-labs-miniapps-frontpages`| Immersive UI/UX for Labs mini-apps and interactive dashboards         |

### Backend & API

| Skill                   | Description                    |
| ----------------------- | ------------------------------ |
| `api-patterns`          | REST, GraphQL, tRPC            |
| `nodejs-best-practices` | Node.js async, modules         |
| `python-patterns`       | Python standards, FastAPI      |
| `rust-pro`              | Async Rust, systems programming|

### Database

| Skill             | Description                 |
| ----------------- | --------------------------- |
| `database-design` | Schema design, optimization |
| `prisma-expert`   | Prisma ORM, migrations      |

### Content & Documents

| Skill             | Description                            |
| ----------------- | -------------------------------------- |
| `doc-coauthoring` | Structured document authoring workflow |
| `docx`            | Word document manipulation             |
| `pdf`             | PDF extraction and creation            |
| `pptx`            | PowerPoint slide generation            |
| `xlsx`            | Spreadsheet analysis and editing       |
| `internal-comms`  | Corporate communication formats        |

### Tools & Infrastructure

| Skill                   | Description               |
| ----------------------- | ------------------------- |
| `docker-expert`         | Containerization, Compose |
| `deployment-procedures` | CI/CD, deploy workflows   |
| `server-management`     | Infrastructure management |
| `helper-pro-gemini-cli` | Antigravity/Gemini CLI    |
| `mcp-builder`           | Model Context Protocol    |

### Testing & Quality

| Skill                   | Description              |
| ----------------------- | ------------------------ |
| `testing-patterns`      | Jest, Vitest, strategies |
| `webapp-testing`        | E2E, Playwright          |
| `tdd-workflow`          | Test-driven development  |
| `code-review-checklist` | Code review standards    |
| `lint-and-validate`     | Linting, validation      |

### Security

| Skill                   | Description              |
| ----------------------- | ------------------------ |
| `vulnerability-scanner` | Security auditing, OWASP |
| `red-team-tactics`      | Offensive security       |

### Planning & Intelligence

| Skill                 | Description                         |
| --------------------- | ----------------------------------- |
| `app-builder`         | Full-stack app scaffolding          |
| `architecture`        | System design patterns              |
| `plan-writing`        | Task planning, breakdown            |
| `brainstorming`       | Socratic questioning                |
| `intelligent-routing` | Automatic agent selection           |
| `skill-creator`       | Evolution of agent capabilities     |

### Creative & Other

| Skill                | Description                        |
| -------------------- | ---------------------------------- |
| `algorithmic-art`    | Generative art with p5.js          |
| `slack-gif-creator`  | Optimized GIF generation for Slack |
| `brand-guidelines`   | Visual brand identity application  |
| `canvas-design`      | Static visual asset creation       |
| `claude-api`         | Advanced AI integration patterns    |

### Core Framework

| Skill                     | Description               |
| ------------------------- | ------------------------- |
| `clean-code`              | Coding standards (Global) |
| `behavioral-modes`        | Agent personas            |
| `parallel-agents`         | Multi-agent patterns      |
| `documentation-templates` | Doc formats               |
| `i18n-localization`       | Internationalization      |
| `performance-profiling`   | Web Vitals, optimization  |
| `systematic-debugging`    | Troubleshooting           |

---

## 🔄 Workflows (13)

Slash command procedures. Invoke with `/command`.

| Command                              | Description                          |
| ------------------------------------ | ------------------------------------ |
| `/brainstorm`                        | Socratic discovery                   |
| `/create`                            | Create new features                  |
| `/debug`                             | Debug issues                         |
| `/deploy`                            | Deploy application                   |
| `/enhance`                           | Improve existing code                |
| `/orchestrate`                       | Multi-agent coordination             |
| `/plan`                              | Task breakdown                       |
| `/preview`                           | Preview changes                      |
| `/status`                            | Check project status                 |
| `/test`                              | Run tests                            |
| `/ui-ux-pro-max`                     | Design with 50 styles                |
| `/create-3d`                         | Create immersive 3D page             |
| `/ag47-designer-build-labs-pages`    | Build full Ag47 Labs page or LP      |

---

## 🎯 Skill Loading Protocol

```plaintext
User Request → Skill Description Match → Load SKILL.md
                                            ↓
                                    Read references/
                                            ↓
                                    Read scripts/
```

### Skill Structure

```plaintext
skill-name/
├── SKILL.md           # (Required) Metadata & instructions
├── scripts/           # (Optional) Python/Bash scripts
├── references/        # (Optional) Templates, docs
└── assets/            # (Optional) Images, logos
```

---

## 🛠️ Scripts (5)

Master validation and management scripts.

| Script               | Purpose                                 | When to Use              |
| -------------------- | --------------------------------------- | ------------------------ |
| `checklist.py`       | Priority-based validation (Core checks) | Development, pre-commit  |
| `verify_all.py`      | Comprehensive verification (All checks) | Pre-deployment, releases |
| `checklist_safe.py`  | Validation with non-destructive actions | CI/CD, restricted envs   |
| `auto_preview.py`    | Automatic dev server & preview mgmt     | Development, UX reviews  |
| `session_manager.py` | Agent state and context tracking        | Long-running tasks       |

---

## 📊 Statistics

| Metric              | Value                         |
| ------------------- | ----------------------------- |
| **Total Agents**    | 21                            |
| **Total Skills**    | 55                            |
| **Total Workflows** | 13                            |
| **Total Scripts**   | 5 (master) + 22 (skill-level) |
| **Coverage**        | ~98% web/mobile development   |

---

## 🔗 Quick Reference

| Need     | Agent                 | Skills                                |
| -------- | --------------------- | ------------------------------------- |
| Web App  | `frontend-specialist` | react-best-practices, frontend-design |
| API      | `backend-specialist`  | api-patterns, nodejs-best-practices   |
| Mobile   | `mobile-developer`    | mobile-design                         |
| Database | `database-architect`  | database-design, prisma-expert        |
| Security | `security-auditor`    | vulnerability-scanner                 |
| Testing  | `test-engineer`       | testing-patterns, webapp-testing      |
| Debug    | `debugger`            | systematic-debugging                  |
| Plan     | `project-planner`     | brainstorming, plan-writing           |
| 3D Web   | `3d-animation-specialist` | premium-3d-scroll-page            |
