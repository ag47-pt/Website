# 📖 Livro de Pendências (Backlog) - Agência 47

Este arquivo é o nosso guia oficial de tarefas futuras e otimizações. Sempre que identificarmos algo que precisa ser feito, mas não é prioridade imediata, anotamos aqui. 

Para resolver uma pendência, basta me pedir: *"Vamos trabalhar na pendência X do backlog"*.

---

## 🍴 Ecossistema RESTAG (Próximos Passos)

- [ ] **Módulo Menu Digital**: Implementar gerador de QR Code dinâmico e interface de menu interativo para restaurantes.
- [ ] **Integração Google Business**: Desenvolver widgets e sincronização automática de horários/reservas com o Google.
- [ ] **Sistema de Planos/Billing**: Integrar Stripe ou similar para gestão de mensalidades fixas (21€, 81€, 350€).
- [ ] **Orquestrador de ADS**: Criar painel de controle para os 150€ de tráfego gerido no plano Full Stack.
- [ ] **App Mobile (Android/iOS)**: Iniciar desenvolvimento da versão nativa para clientes amantes de culinária.
- [ ] **WhatsApp Automation**: Desenvolver bot de atendimento e agendamento via WhatsApp para comerciantes.
- [ ] **Analytics de Mercado Real-time**: Implementar dashboard de tendências gastronômicas em Lisboa para ajuste ágil da plataforma.


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
