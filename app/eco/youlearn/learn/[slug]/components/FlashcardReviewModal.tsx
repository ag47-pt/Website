'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Section, QuizSectionContent, ConceptSectionContent, InsightSectionContent, ProcessSectionContent } from '@/eco/youlearn/schema/types';
import { X, ChevronLeft, ChevronRight, RotateCcw, BrainCircuit } from 'lucide-react';

interface FlashcardReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  type: string;
  hint?: string;
}

export function FlashcardReviewModal({ isOpen, onClose, sections }: FlashcardReviewModalProps) {
  // Extract flashcards from sections
  const cards = useMemo(() => {
    const extracted: Flashcard[] = [];
    
    sections.forEach(section => {
      if (section.type === 'quiz') {
        const content = section.content as QuizSectionContent;
        content.questions.forEach(q => {
          extracted.push({
            id: q.id,
            front: q.question,
            back: `${q.options[q.correctOptionIndex]}\n\n${q.explanation}`,
            type: 'Quiz',
            hint: q.hint
          });
        });
      }
      
      if (section.type === 'concept') {
        const content = section.content as ConceptSectionContent;
        extracted.push({
          id: `concept-${section.id}`,
          front: content.coreIdea,
          back: content.deepDive || content.keyTakeaways.join('\n'),
          type: 'Conceito'
        });
      }
      
      if (section.type === 'insight') {
        const content = section.content as InsightSectionContent;
        content.items.forEach(item => {
          extracted.push({
            id: item.id,
            front: item.title,
            back: `${item.description}${item.actionableAdvice ? '\n\nDica: ' + item.actionableAdvice : ''}`,
            type: 'Insight'
          });
        });
      }

      if (section.type === 'process') {
        const content = section.content as ProcessSectionContent;
        content.steps.forEach(step => {
          extracted.push({
            id: `process-${section.id}-${step.stepNumber}`,
            front: `Passo ${step.stepNumber}: ${step.title}`,
            back: step.description,
            type: 'Processo'
          });
        });
      }
    });
    
    // Shuffle cards once per load could be good, but linear is fine for now
    return extracted;
  }, [sections]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // reset state when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsFlipped(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  if (cards.length === 0) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
          <BrainCircuit className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Sem Cartões Disponíveis</h2>
          <p className="text-zinc-400 mb-6">Não foram encontrados conceitos, quizzes ou insights suficientes para gerar cartões de revisão.</p>
          <button onClick={onClose} className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200">
            Fechar
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-[#D1FF00]">
            <BrainCircuit className="w-6 h-6" />
            <h2 className="text-lg font-bold">Revisão Rápida</h2>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Progress */}
        <div className="w-full flex justify-between items-center mb-4">
          <div className="text-sm font-medium text-zinc-400">
            Cartão {currentIndex + 1} de {cards.length}
          </div>
          <div className="flex gap-1">
            {cards.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full ${idx === currentIndex ? 'w-4 bg-[#D1FF00]' : 'w-1.5 bg-zinc-700'}`}
              />
            ))}
          </div>
        </div>

        {/* Flashcard Container (3D perspective) */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] [perspective:1000px]">
          <div 
            className={`w-full h-full transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-zinc-900 border border-white/10 rounded-2xl p-8 sm:p-12 flex flex-col shadow-2xl">
              <div className="text-xs font-bold tracking-widest text-[#D1FF00]/70 uppercase mb-auto">
                {currentCard.type}
              </div>
              <div className="flex-grow flex items-center justify-center text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {currentCard.front}
                </h3>
              </div>
              <div className="mt-auto pt-4 text-center text-sm text-zinc-500 animate-pulse">
                Clique para virar
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-zinc-800 border border-[#D1FF00]/30 rounded-2xl p-8 sm:p-12 flex flex-col shadow-2xl overflow-y-auto">
              <div className="text-xs font-bold tracking-widest text-[#D1FF00]/70 uppercase mb-6 flex justify-between">
                <span>{currentCard.type} - Resposta</span>
              </div>
              <div className="flex-grow flex items-center justify-center">
                <div className="text-lg sm:text-xl text-zinc-200 whitespace-pre-wrap leading-relaxed text-center">
                  {currentCard.back}
                </div>
              </div>
              {currentCard.hint && (
                <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-400">
                  <span className="font-bold text-white">Dica:</span> {currentCard.hint}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-8">
          <button 
            onClick={handlePrev}
            className="p-3 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-8 py-3 bg-[#D1FF00] text-black font-bold rounded-full hover:bg-[#D1FF00]/90 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(209,255,0,0.3)] flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {isFlipped ? 'Esconder' : 'Mostrar Resposta'}
          </button>

          <button 
            onClick={handleNext}
            className="p-3 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
