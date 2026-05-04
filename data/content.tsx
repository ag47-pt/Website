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
    href: "/servicos/criacao-de-sites",
    title: <><span className="whitespace-nowrap">Websites &</span><br/>Landing Pages</>,
    subtitle: "Websites &\nLanding Pages",
    img: "/imgs/service_web_design_pt.webp",
    desc: (
      <>
        <span className="font-bold text-white">🤣 Quem manda <span className="text-yellow-400 font-black">AQUI</span> é seu cliente! </span><br/>
        <b>💭 Filosofia de solução e foco no </b> <span className="text-blue-400 font-black">SEU PÚBLICO</span><br/> 
        🧬 É código com o <span className="text-purple-400 font-black">DNA da SUA EMPRESA</span><br/>🫵🏻 Dando <span className="text-pink-400 font-black">FORMA</span> da <span className="text-red-400 font-black">FORMA</span> que é preciso<br/>
        <span className="font-medium text-white italic">🚀 Isso catapulta <span className="text-green-400 font-black">SEU NEGÓCIO</span> para o espaço </span>
      </>
    )
  },
  saas: {
    tag: "Desenvolvimento As Service",
    href: "/servicos/sistemas-e-webapps",
    title: <><span className="whitespace-nowrap">Saas, Micro-saas,</span><br/>WebApps</>,
    subtitle: "Saas, Micro-saas,\nWebApps",
    img: "/imgs/service_saas_pt.webp",
    badge: "Inovação",
    desc: (
      <>
        <span className="font-bold text-white">🌎 Sua ideia em <span className="text-yellow-400 font-black">ESCALA GLOBAL</span>! </span><br/>
        <b>🏗️ Arquiteturas escaláveis no modelo </b> <span className="text-blue-400 font-black">RECORRENTE</span><br/>
        💻 Do MVP à plataforma final com <span className="text-purple-400 font-black">CÓDIGO LIMPO</span><br/>
        🎯 Todas as decisões técnicas com <span className="text-pink-400 font-black">FOCO EM ROI</span><br/>
        <span className="font-medium text-white italic">⚡ Construa o futuro do seu <span className="text-green-400 font-black">ECOSSISTEMA DIGITAL</span></span>
      </>
    )
  },
  socialMedia: {
    tag: "Presença Digital",
    href: "/servicos/full-service",
    title: <><span className="whitespace-nowrap">Social Media &</span><br/>Conteúdo</>,
    subtitle: "Social Media &\nConteúdo",
    img: "/imgs/service_social_media_pt.webp",
    desc: (
      <>
        <span className="font-bold text-white">🔥 Quem manda <span className="text-yellow-400 font-black">AQUI</span> é sua audiência! </span><br/>
        <b>💭 Estratégia de engajamento com foco no </b> <span className="text-blue-400 font-black">SEU PÚBLICO</span><br/> 
        🧬 É comunicação com o <span className="text-purple-400 font-black">DNA da SUA MARCA</span><br/>🫵🏻 Conectando da <span className="text-pink-400 font-black">FORMA</span> que é preciso<br/>
        <span className="font-medium text-white italic">🚀 Isso catapulta <span className="text-green-400 font-black">SEU ALCANCE</span> para o espaço </span>
      </>
    )
  },
  trafegoPago: {
    tag: "Performance Total",
    href: "/servicos/trafego-pago",
    title: <><span className="whitespace-nowrap">Tráfego Pago &</span><br/>Conversão</>,
    subtitle: "Tráfego Pago &\nConversão",
    img: "/imgs/service_ads_pt.webp",
    desc: (
      <>
        <span className="font-bold text-white">🎯 Quem manda <span className="text-yellow-400 font-black">AQUI</span> são as vendas! </span><br/>
        <b>📈 Otimização contínua com foco no </b> <span className="text-blue-400 font-black">SEU ROI</span><br/> 
        🧬 É anúncio com o <span className="text-purple-400 font-black">DNA do RESULTADO</span><br/>🫵🏻 Escalando da <span className="text-pink-400 font-black">FORMA</span> que é preciso<br/>
        <span className="font-medium text-white italic">🚀 Isso catapulta <span className="text-green-400 font-black">SEU NEGÓCIO</span> para o espaço </span>
      </>
    )
  }
}
