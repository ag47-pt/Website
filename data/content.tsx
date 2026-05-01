import React from 'react'

export const hotspotsData = [
  { title: "Design 3D", desc: "Modelagem e renderização premium para marcas modernas.", pos: [1.6, 0.8, 0.4] },
  { title: "Animações", desc: "Movimento fluido e interativo que prende a atenção.", pos: [-1.8, -0.5, 0.8] },
  { title: "Performance", desc: "Otimizado para web com carregamento ultra-rápido.", pos: [0.4, 1.8, -1.0] },
  { title: "UX/UI", desc: "Interfaces intuitivas focadas na conversão do usuário.", pos: [0.9, -1.5, -1.2] },
  { title: "Inovação", desc: "Uso de tecnologias de ponta como R3F e Next.js.", pos: [-1.2, 1.2, -1.8] }
]

export const servicesData = {
  websites: {
    tag: "Desenvolvimento Elite",
    title: <><span className="whitespace-nowrap">Websites &</span><br/>Landing Pages</>,
    subtitle: "Websites & Landing Pages",
    img: "/imgs/service_web_design.png",
    setup: "150€",
    monthly: "29€",
    desc: (
      <>
        <span className="font-bold text-white">🤣 Quem manda <span className="text-yellow-400 font-black">AQUI</span> é seu cliente! </span><br/>
        <b>💭 Filosofia de solução e foco no </b> <span className="text-blue-400 font-black">SEU PÚBLICO</span>.<br/> 
        🧬 É como escrever código com o <span className="text-purple-400 font-black">DNA da SUA EMPRESA</span>. <br/>🫵🏻 Dando <span className="text-pink-400 font-black">FORMA</span> ao que você quer e precisa !!!<br/>
        <span className="font-medium text-white italic">🚀 Isso catapulta <span className="text-green-400 font-black">SEU NEGÓCIO</span> para o espaço </span>
      </>
    )
  },
  saas: {
    tag: "Desenvolvimento As Service",
    title: <><span className="whitespace-nowrap">Saas, Micro-saas,</span><br/>WebApps</>,
    subtitle: "Software as a Service",
    img: "/imgs/service_saas.png",
    setup: "A partir de 500€",
    monthly: "Sob Consulta",
    badge: "Inovação",
    desc: (
      <>
        <span className="font-bold text-white">Sua ideia em escala global! 🌎</span><br/><br/>
        Desenvolvemos arquiteturas robustas e escaláveis para o seu modelo de negócio <span className="text-blue-400 font-black">RECORRENTE</span>. Do MVP à plataforma final, código limpo com <span className="text-purple-400 font-black">FOCO EM ROI</span>.<br/><br/>
        <span className="font-medium text-white italic">Construa o futuro do seu ecossistema digital ⚡</span>
      </>
    )
  }
}
