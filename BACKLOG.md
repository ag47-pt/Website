# 📖 Livro de Pendências (Backlog) - Agência 47

Este arquivo é o nosso guia oficial de tarefas futuras e otimizações. Sempre que identificarmos algo que precisa ser feito, mas não é prioridade imediata, anotamos aqui. 

Para resolver uma pendência, basta me pedir: *"Vamos trabalhar na pendência X do backlog"*.

---

## 🍴 Ecossistema RESTAG (Próximos Passos)

- [ ] **Restauração de Integridade Supabase**: Reativar a constraint `profiles_id_fkey` e tornar `owner_id` obrigatório (`NOT NULL`) assim que o fluxo de Auth real estiver operacional.
- [ ] **Fluxo de Autenticação Real**: Substituir o `MOCK_RESTAURANT_ID` pela ID do restaurante vinculado ao perfil do usuário logado via Supabase Auth.
- [ ] **Pipeline de Onboarding (Admin)**: Implementar a funcionalidade de aprovação/rejeição de novos nós na página `/restag/admin/onboarding`.
- [ ] **Editor de Menu Interativo (Merchant)**: Construir a interface para gestão de categorias e itens de menu em `/restag/merchant/menu`.
- [ ] **Reservas Real-time**: Ativar o Supabase Realtime no dashboard do Merchant para que novas reservas apareçam instantaneamente sem refresh.
- [ ] **Modo Concierge Ag47**: Desenvolver a lógica de "Impersonate" que permite ao Admin acessar a visão do Merchant com permissões totais para suporte.

## ⚡ Performance, SEO & Acessibilidade (Auditoria Restag)

- [x] **Acessibilidade Crítica**: Adicionar handlers de teclado (`onKeyDown`) em todos os elementos com `onClick` (RestagDetailClient, MapPortal, AuditClient).
- [x] **Labels de Formulário**: Adicionar `aria-label` ou `label` em campos de entrada no `page.tsx` para conformidade WCAG.
- [x] **Skeletons de Carregamento**: Implementar estados de Loading para operações assíncronas no portal principal para evitar Layout Shift.
- [ ] **Otimização de Animações**: Refatorar componentes que animam `top`, `height` ou `margin` para usarem `transform` e `opacity` (melhoria de performance).
- [x] **Security Headers**: Configurar CSP e HSTS no `next.config.js` conforme recomendado na auditoria de segurança.
- [ ] **Suporte a Reduced Motion**: Implementar a verificação de `prefers-reduced-motion` em animações de scroll imersivo.

## ⚡ Performance & SEO (Foco em Mobile/Lighthouse)

## 🐛 Avisos e Manutenção Técnica

- [ ] **Aviso THREE.Clock (Console)**: Atualizar `@react-three/fiber` quando a migração para `THREE.Timer` estiver estável, eliminando o aviso de obsolescência.

## 🎨 Design & UX (Ideias Futuras)

- [ ] **Efeito de Vidro Dinâmico**: Implementar reflexões em tempo real nos cards de "Telemetry" usando `MeshTransmissionMaterial` se a performance permitir.

---
*Dica: Marque as caixas com um 'x' (ex: `[x]`) conforme fomos concluindo as tarefas.*
