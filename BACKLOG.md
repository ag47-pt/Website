# 📖 Livro de Pendências (Backlog) - Agência 47

Este arquivo é o nosso guia oficial de tarefas futuras e otimizações. Sempre que identificarmos algo que precisa ser feito, mas não é prioridade imediata, anotamos aqui. 

Para resolver uma pendência, basta me pedir: *"Vamos trabalhar na pendência X do backlog"*.

---

## ⚡ Performance & SEO (Foco em Mobile/Lighthouse)

- [ ] **Reduzir Estrelas no Mobile:** Diminuir o contador do componente `<Stars />` (ex: de 5000 para 500) ou desativá-lo completamente em telas pequenas para poupar processamento da GPU.
- [ ] **Carregamento Lento (Lazy Load) da Cena 3D:** Exibir um "fundo falso" bonito ou uma imagem de fallback primeiro para garantir LCP imediato (nota 100 no Google), inicializando o Canvas 3D apenas alguns segundos depois ou no primeiro scroll.
- [ ] **Resolução Dinâmica de Texturas:** Implementar uma lógica para baixar texturas de menor resolução (ex: 512x512 em vez de 2K) caso detecte que o usuário está em um dispositivo móvel.

## 🐛 Avisos e Manutenção Técnica

- [ ] **Aviso THREE.Clock (Console):** Aguardar e aplicar a futura atualização da biblioteca `@react-three/fiber` que substitui a classe obsoleta `THREE.Clock` pela `THREE.Timer`, eliminando o aviso amarelo no console do navegador.

## 🎨 Design & UX (Ideias Futuras)

- [ ] *(Adicione novas ideias de design aqui...)*

---
*Dica: Marque as caixas com um 'x' (ex: `[x]`) conforme fomos concluindo as tarefas.*
