'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function MenuAGHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Fechar menu mobile ao mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/menuag" className="flex items-center gap-2" aria-label="menuAG Início">
          <span className="text-2xl font-bold text-blue-600 tracking-tight">menuAG</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600" aria-label="Navegação Principal">
          <Link 
            href="/menuag" 
            className={`hover:text-blue-600 transition-colors ${pathname === '/menuag' ? 'text-blue-600' : ''}`}
          >
            Início
          </Link>
          <Link 
            href="/menuag/planos" 
            className={`hover:text-blue-600 transition-colors ${pathname === '/menuag/planos' ? 'text-blue-600' : ''}`}
          >
            Para Restaurantes
          </Link>
          <Link 
            href="/menuag/merchant" 
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Área do Merchant
          </Link>
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg absolute w-full left-0 z-40">
          <nav className="px-4 pt-2 pb-6 space-y-1" aria-label="Navegação Mobile">
            <Link 
              href="/menuag" 
              className={`block px-3 py-3 rounded-md text-base font-medium ${pathname === '/menuag' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              Início
            </Link>
            <Link 
              href="/menuag/planos" 
              className={`block px-3 py-3 rounded-md text-base font-medium ${pathname === '/menuag/planos' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              Para Restaurantes
            </Link>
            <div className="pt-2">
              <Link 
                href="/menuag/merchant" 
                className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Área do Merchant
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}