'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { Star, MapPin, Clock, Phone, Utensils, Calendar } from 'lucide-react';
import Image from 'next/image';

const RESTAURANTS = {
  'osteria-del-mare': {
    name: 'Osteria Del Mare',
    type: 'Italiana • Frutos do Mar',
    rating: 4.8,
    reviews: 342,
    location: 'Chiado, Lisboa',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    description: 'A autêntica culinária italiana com os melhores frutos do mar da costa portuguesa.',
    menuUrl: '#',
    bookUrl: '#',
  },
  'tasca-do-ze': {
    name: 'Tasca do Zé',
    type: 'Portuguesa Tradicional',
    rating: 4.6,
    reviews: 890,
    location: 'Alfama, Lisboa',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
    description: 'Sabores que contam histórias. O verdadeiro bacalhau e vinhos da casa em um ambiente acolhedor.',
    menuUrl: '#',
    bookUrl: '#',
  },
  'sakura-sushi': {
    name: 'Sakura Sushi Bar',
    type: 'Japonesa',
    rating: 4.9,
    reviews: 512,
    location: 'Príncipe Real, Lisboa',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
    description: 'A arte do sushi tradicional japonês com toques contemporâneos.',
    menuUrl: '#',
    bookUrl: '#',
  }
};

export default function RestaurantPage({ params }: { params: { slug: string } }) {
  // @ts-ignore
  const rest = RESTAURANTS[params.slug];

  if (!rest) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden shadow-sm bg-gray-900">
        <Image 
          src={rest.image} 
          alt={`Imagem principal do restaurante ${rest.name}`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 md:mb-3">{rest.name}</h1>
          <p className="text-base md:text-lg text-gray-200 font-medium">{rest.type}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre o Restaurante</h2>
            <p className="text-gray-600 leading-relaxed">
              {rest.description}
            </p>
          </section>

          <section className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore o Menu</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <Utensils className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Cardápio Digital Interativo</h3>
                <p className="text-sm text-gray-500">Veja fotos, descrições e preços atualizados.</p>
              </div>
              <button className="w-full sm:w-auto px-6 py-2 bg-white border border-gray-300 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none">
                Ver Menu
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <span className="text-2xl font-bold text-gray-900">{rest.rating}</span>
              </div>
              <span className="text-gray-500 text-sm">{rest.reviews} avaliações do Google</span>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <span>{rest.location}</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <span>Aberto hoje • 12:00 - 23:00</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <span>+351 912 345 678</span>
              </li>
            </ul>

            <button className="w-full bg-blue-600 text-white py-3 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
              <Calendar className="w-5 h-5" />
              Reservar Mesa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}