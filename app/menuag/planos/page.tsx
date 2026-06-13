import React from 'react';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'LP Core',
    price: '0€',
    period: '/mês',
    description: 'A porta de entrada para a digitalização do seu restaurante.',
    features: [
      'Landing Page imersiva',
      'Visual Google Style',
      'Informações de contato e horários',
      'Otimização SEO básica'
    ],
    button: 'Começar Grátis',
    highlighted: false,
  },
  {
    name: 'Menu Digital',
    price: '21€',
    period: '/mês',
    description: 'Cardápio interativo e gestão ágil em tempo real.',
    features: [
      'Tudo do LP Core',
      'Menu QR Code',
      'Gestão de pratos e preços em tempo real',
      'Fotos em alta resolução',
      'Suporte a múltiplos idiomas'
    ],
    button: 'Assinar Menu Digital',
    highlighted: false,
  },
  {
    name: 'Sistema de Reservas',
    price: '81€',
    period: '/mês',
    description: 'Motor de reservas completo sem taxas por transação.',
    features: [
      'Tudo do Menu Digital',
      'Motor de reservas online',
      'Integração Google e Widgets',
      'Notificações por email/SMS',
      'Gestão de mesas'
    ],
    button: 'Assinar Reservas',
    highlighted: true,
  },
  {
    name: 'Full Stack + ADS',
    price: '350€',
    period: '/mês',
    description: 'A solução definitiva com tráfego pago gerido pela agência.',
    features: [
      'Todos os módulos do Sistema',
      '150€ convertidos em Google ADS',
      'Estratégia GTM personalizada',
      'Dashboard avançado de performance',
      'Suporte prioritário 24/7'
    ],
    button: 'Falar com Consultor',
    highlighted: false,
  }
];

export default function MenuAGPlanos() {
  return (
    <div className="py-12 max-w-7xl mx-auto space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Planos sem taxas surpresa</h1>
        <p className="text-xl text-gray-600">
          Transforme a presença digital do seu restaurante. Zero comissões por reserva ou pedido. Apenas uma mensalidade justa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.name} 
            className={`rounded-3xl p-8 flex flex-col bg-white border ${plan.highlighted ? 'border-blue-600 shadow-xl ring-1 ring-blue-600' : 'border-gray-200 shadow-sm'}`}
          >
            <div className="space-y-4 flex-1">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-sm text-gray-500 min-h-[40px]">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 font-medium">{plan.period}</span>
              </div>
              <ul className="space-y-3 pt-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button className={`mt-8 w-full py-3 px-4 rounded-xl font-bold transition-colors ${plan.highlighted ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
              {plan.button}
            </button>
          </div>
        ))}
      </div>
      
      <div className="text-center bg-gray-50 rounded-3xl p-8 mt-16 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Tem dúvidas sobre qual o melhor plano?</h3>
        <p className="text-gray-600 mb-6">Nossa equipe de especialistas em marketing gastronômico está pronta para ajudar a escolher a solução ideal para o seu negócio.</p>
        <button className="bg-white border border-gray-300 text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">
          Entrar em contato
        </button>
      </div>
    </div>
  );
}