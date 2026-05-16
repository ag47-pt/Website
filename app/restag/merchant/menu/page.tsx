'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ChevronLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

// Mock Data
const initialMenuItems = [
  { id: 1, category: "Entradas", name: "Carpaccio de Polvo", price: "14.00", description: "Polvo fatiado finamente com azeite trufado e alcaparras." },
  { id: 2, category: "Entradas", name: "Burrata", price: "12.50", description: "Burrata fresca com tomate cereja confitado e pesto." },
  { id: 3, category: "Pratos Principais", name: "Bife Wellington", price: "32.00", description: "Clássico Bife Wellington com purê de batata trufado." },
  { id: 4, category: "Pratos Principais", name: "Risotto de Cogumelos", price: "24.00", description: "Risotto cremoso com mix de cogumelos selvagens e azeite." },
  { id: 5, category: "Sobremesas", name: "Tiramisu", price: "8.50", description: "Receita tradicional italiana com café espresso." },
];

export default function MenuPage() {
  const { theme } = useTheme();
  const [items, setItems] = useState(initialMenuItems);

  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="relative pb-24 pt-12 md:pt-16">
      <div className="max-w-[1600px] mx-auto space-y-12 md:space-y-16 px-4 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link href="/restag/merchant" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4 font-mono uppercase tracking-widest">
              <ChevronLeft className="w-4 h-4" /> Voltar ao Terminal
            </Link>
            <h1 className="text-4xl font-bold tracking-tighter text-white flex items-center gap-4">
              Gestão de Menu
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-mono tracking-widest uppercase">
                {items.length} Itens
              </span>
            </h1>
          </div>
          
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors font-bold rounded-lg w-full md:w-auto">
            <Plus className="w-4 h-4" /> Adicionar Prato
          </button>
        </div>

        {/* Menu Editor */}
        <div className="space-y-12">
          {categories.map((cat, catIdx) => (
            <motion.div 
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1 }}
              className="space-y-4"
            >
              <h3 className="font-mono text-sm uppercase tracking-[0.3em] text-gray-500 border-b border-white/10 pb-2">
                {cat}
              </h3>
              
              <div className="grid gap-4">
                {items.filter(i => i.category === cat).map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md gap-4 hover:bg-white/10 transition-colors group">
                    <div className="max-w-xl">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-bold text-white">{item.name}</h4>
                        <span className="font-mono text-sm" style={{ color: theme.colors.primary }}>€{item.price}</span>
                      </div>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>

                    <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
