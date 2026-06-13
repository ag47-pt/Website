'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Utensils, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import Image from 'next/image';

const RESTAURANTS = [
  {
    id: 'rest-1',
    name: 'Osteria Del Mare',
    type: 'Italiana • Frutos do Mar',
    rating: 4.8,
    reviews: 342,
    location: 'Chiado, Lisboa',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    slug: 'osteria-del-mare',
  },
  {
    id: 'rest-2',
    name: 'Tasca do Zé',
    type: 'Portuguesa Tradicional',
    rating: 4.6,
    reviews: 890,
    location: 'Alfama, Lisboa',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    slug: 'tasca-do-ze',
  },
  {
    id: 'rest-3',
    name: 'Sakura Sushi Bar',
    type: 'Japonesa',
    rating: 4.9,
    reviews: 512,
    location: 'Príncipe Real, Lisboa',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    slug: 'sakura-sushi',
  }
];

export default function MenuAGDiscovery() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/50 -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-6 md:space-y-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Descubra o seu próximo <span className="text-blue-600">favorito</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 px-4">
            Experiências gastronômicas autênticas em Lisboa, a um clique de distância. Sem taxas ocultas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto bg-white p-2 rounded-2xl sm:rounded-full shadow-md border border-gray-200">
            <div className="flex-1 flex items-center px-4 gap-2 h-12">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Pratos, restaurantes ou cozinhas" 
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400"
                aria-label="Pesquisar pratos ou restaurantes"
              />
            </div>
            <div className="hidden sm:block w-px bg-gray-200 my-2" />
            <div className="sm:hidden h-px bg-gray-100 mx-4" />
            <div className="flex-1 flex items-center px-4 gap-2 h-12">
              <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Lisboa" 
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400"
                aria-label="Localização"
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl sm:rounded-full font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto h-12 mt-2 sm:mt-0 flex items-center justify-center">
              Buscar
            </button>
          </div>
        </motion.div>
      </section>

      {/* Featured Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            Destaques em Lisboa
          </h2>
          <button className="text-blue-600 font-medium hover:underline flex items-center gap-1">
            Ver todos <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESTAURANTS.map((rest, idx) => (
            <motion.div 
              key={rest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/menuag/${rest.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <Image 
                    src={rest.image} 
                    alt={`Imagem do restaurante ${rest.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1 text-gray-900 shadow-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {rest.rating}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{rest.name}</h3>
                    <p className="text-sm text-gray-500">{rest.type}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {rest.location}
                    </span>
                    <span className="text-gray-400">({rest.reviews} avaliações)</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* For Restaurants CTA */}
      <section className="bg-blue-600 rounded-3xl p-8 sm:p-12 text-center text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/3">
          <Utensils className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">É dono de um restaurante?</h2>
          <p className="text-blue-100 text-lg">
            Junte-se ao menuAG. Zero taxas por reserva. LPs imersivas, menu digital e gestão simplificada com custos fixos mensais a partir de 0€.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menuag/planos" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors">
              Conhecer Planos
            </Link>
            <Link href="/menuag/merchant" className="bg-blue-700 text-white px-8 py-3 rounded-full font-bold border border-blue-500 hover:bg-blue-800 transition-colors">
              Acessar Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
