import { ServiceLP } from './services'

export interface RestaurantLP extends Omit<ServiceLP, 'slug'> {
  slug: string
  address: string
  cuisine: string
  priceRange: string
  rating: number
  location: { lat: number; lng: number }
  menu: {
    category: string
    items: { name: string; price: string; desc: string; popular?: boolean }[]
  }[]
  giftCards: {
    id: string
    name: string
    value: string
    description: string
    img: string
  }[]
  reservationSettings: {
    maxPartySize: number
    intervals: number // minutes
    notice: string // e.g. "2 hours"
  }
  phone: string
  operatingHours: { [key: string]: string }
  gallery: string[]
  features: string[]
  descriptionLong: string;
  video?: string;
  videoWatermark?: string;
  brandingColor?: string;
  effectsEnabled?: boolean;
}

export const restaurants: RestaurantLP[] = [
  {
    slug: 'bipolar',
    effectsEnabled: true,
    tag: '\nReinventada\n ',
    cardTitle: '*Bipolar*',
    cardSubtitle: 'Bipolar\nGrill & Wine',
    img: "/restag/franguia_gallery_0.png",
    badge: 'Popular',
    metaTitle: 'Bipolar | Cozinha Variada Contemporânea em Lisboa',
    metaDescription: 'Descobre o melhor do **grill e vinhos** em Lisboa. Ambiente acolhedor e **sabores autênticos** reinventados.',
    heroLabel: 'Grill & Wine Experience',
    heroTitle: 'A brasa e radição',
    heroSubtitle: "A convergência entre a força do fogo e a precisão da engenharia gastronômica.",
    descriptionLong: "Neste refúgio gastronômico em Lisboa, a consistência e a autenticidade são os pilares de cada prato. O Bipolar é onde o calor da brasa encontra uma garrafeira curada, criando um ambiente moderno e familiar que celebra o melhor da cozinha contemporânea reinventada. Os pratos grelhados são o destaque absoluto, preparados com precisão técnica e paixão pela tradição.",
    heroCta: 'Reservar Mesa',
    address: 'Lisboa, Portugal',
    cuisine: 'Portuguesa',
    priceRange: 'avg. 25,00 €',
    rating: 4.8,
    location: { lat: 38.8029, lng: -9.3817 },
    valueProps: [
      {
        icon: '🔥',
        title: 'Grelha a Carvão',
        body: 'O sabor autêntico do fogo em cada corte de carne.',
        detail: 'Usamos apenas carvão vegetal de alta qualidade para garantir o aroma defumado perfeito.'
      },
      {
        icon: '🍷',
        title: 'Garrafeira Curada',
        body: 'Uma seleção dos melhores rótulos nacionais.',
        detail: 'De pequenos produtores a grandes clássicos, temos o vinho ideal para cada prato.'
      }
    ],
    process: [
      { step: '01', title: 'A Chegada', desc: 'Sê recebido num ambiente que respira história e modernidade.', detail: 'O nosso host irá guiar-te até à tua mesa pré-configurada.' },
      { step: '02', title: 'O Menu', desc: 'Explora pratos que respeitam a sazonalidade dos ingredientes.', detail: 'Ingredientes frescos vindos diretamente de produtores locais.' },
      { step: '03', title: 'O Brinde', desc: 'Harmonização perfeita sugerida pelo nosso sommelier.', detail: 'Cada trago é pensado para elevar o sabor da tua escolha.' }
    ],
    results: [
      { value: '15+', label: 'Anos de história', desc: 'Mais de uma década servindo excelência em Lisboa.' },
      { value: '4.8', label: 'Avaliação média', desc: 'Baseado em mais de 1000 reviews de clientes satisfeitos.' },
      { value: '250', label: 'Rótulos de vinho', desc: 'Uma das garrafeiras mais completas da região.' }
    ],
    faqs: [
      { q: 'Têm opções vegetarianas?', a: 'Sim, dispomos de pratos de assinatura focados em vegetais da época.' },
      { q: 'É necessário reservar?', a: 'Recomendamos reserva antecipada, especialmente aos fins de semana.' }
    ],
    ctaTitle: 'Pronto para uma *experiência* inesquecível?',
    ctaBody: 'Escolhe a tua data e deixa o resto connosco.',
    menu: [
      {
        category: 'Entradas',
        items: [
          { name: 'Pica-pau de Novilho', price: '12€', desc: 'Cubos de lombo com molho de cerveja e pickles caseiros.', popular: true },
          { name: 'Queijo de Azeitão', price: '8€', desc: 'Queijo amanteigado com tostas de pão de mafra.' }
        ]
      },
      {
        category: 'Pratos Principais',
        items: [
          { name: 'Frango na Brasa "Bipolar"', price: '15€', desc: 'O nosso clássico com molho secreto e batata frita.', popular: true },
          { name: 'Arroz de Marisco', price: '22€', desc: 'Arroz malandrinho com gambas, amêijoas e coentros.' }
        ]
      }
    ],
    giftCards: [
      { id: 'gc-25', name: 'Experiência Brunch', value: '25€', description: 'O presente perfeito para um domingo preguiçoso.', img: '/imgs/gc_brunch.webp' },
      { id: 'gc-50', name: 'Jantar Romântico', value: '50€', description: 'Menu completo para dois com vinho incluído.', img: '/imgs/gc_dinner.webp' }
    ],
    reservationSettings: {
      maxPartySize: 12,
      intervals: 30,
      notice: '1 hour'
    },
    phone: '+351 21 586 5388',
    operatingHours: {
      'Segunda': 'Encerrado',
      'Terça': 'Encerrado',
      'Quarta': '18:00 - 01:00',
      'Quinta': '18:00 - 01:00',
      'Sexta': '18:00 - 01:00',
      'Sábado': '18:00 - 01:00',
      'Domingo': '13:00 - 21:00'
    },
    gallery: [
      "/restag/franguia_gallery_0.png",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop"
    ],
    features: ['Grelha a Carvão', 'Family-Friendly', 'Ambiente Moderno', 'Garrafeira Premium', 'Estacionamento Fácil'],
    video: "/restag/videos/bipolar-explanada.mp4",
    videoWatermark: "Bipolar Explanada",
    brandingColor: "#D1FF00"
  },
  {
    slug: 'carbon-core',
    effectsEnabled: true,
    tag: 'LABS_CERTIFIED_v1.0',
    cardTitle: '*Carbon Core*',
    cardSubtitle: 'Carbon Core\nThermal Dining',
    img: "/restag/carbon_core_gallery_0.png",
    badge: 'Labs Exclusive',
    metaTitle: 'Carbon Core | Thermal Gastronomy Laboratory',
    metaDescription: 'Experience the **precision** of **thermal cooking** at Carbon Core. A **Labs-certified** dining environment.',
    heroLabel: 'Gastro-Engineering Prototype',
    heroTitle: 'Precision *Thermal*\nGastronomy',
    heroSubtitle: 'Where molecular physics meets the art of the perfect sear. A technical dining readout.',
    descriptionLong: "Carbon Core é um protótipo de gastronomia termal onde a física molecular se encontra com a arte do selado perfeito. Cada prato é um experimento em precisão e sabor, desenvolvido nos laboratórios da Ag47.",
    heroCta: 'Initiate Booking',
    address: 'Labs District, Lisbon',
    cuisine: 'Molecular/Experimental',
    priceRange: 'avg. 85,00 €',
    rating: 4.9,
    location: { lat: 38.7223, lng: -9.1393 },
    valueProps: [
      {
        icon: '🔬',
        title: 'Thermal Precision',
        body: 'Cooked to the exact millidegree.',
        detail: 'Our ovens are calibrated daily using Labs-grade thermal sensors.'
      }
    ],
    process: [
      { step: '01', title: 'System Scan', desc: 'Arrive at the air-locked entrance for thermal calibration.', detail: 'Your sensory profile is established upon entry.' }
    ],
    results: [
      { value: '99%', label: 'Thermal Accuracy', desc: 'Maximum variance of 0.1°C across all proteins.' },
      { value: '4.9', label: 'Safety Rating', desc: 'Certified for high-end experimental consumption.' }
    ],
    faqs: [
      { q: 'Is it safe?', a: 'All protocols are verified by Ag47 Labs Safety Division.' }
    ],
    ctaTitle: 'Ready for *System* Consumption?',
    ctaBody: 'Secure your slot in the next thermal cycle.',
    menu: [
      {
        category: 'Prototypes',
        items: [
          { name: 'Cured Carbon Beef', price: '45€', desc: 'Sous-vide for 72 hours at 54.5°C exactly.', popular: true }
        ]
      }
    ],
    giftCards: [
      { id: 'gc-labs', name: 'Labs Access Pass', value: '100€', description: 'Priority access to all experimental menus.', img: '/imgs/gc_labs.webp' }
    ],
    reservationSettings: {
      maxPartySize: 4,
      intervals: 60,
      notice: '24 hours'
    },
    phone: '+351 21 000 0000',
    operatingHours: {
      'Segunda - Sexta': '19:00 - 23:00',
      'Sábado': '19:00 - 00:00',
      'Domingo': 'Encerrado'
    },
    gallery: [
      "/restag/carbon_core_gallery_0.png",
      "https://images.unsplash.com/photo-1550966841-3ee7adac1668?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1635349911418-46d822f0801c?q=80&w=1000&auto=format&fit=crop"
    ],
    features: ['Molecular Lab', 'Thermal Sensors', 'Experimental Dining', 'Air-Locked Entrance', 'Restricted Access']
  }
]
