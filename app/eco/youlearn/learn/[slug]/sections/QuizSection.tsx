'use client';

import React, { useState } from 'react';
import { QuizSectionContent, BaseSection, Source } from '@/eco/youlearn/schema/types';
import { HelpCircle, CheckCircle2, XCircle, HelpCircle as HintIcon, Sparkles, RefreshCw } from 'lucide-react';

interface QuizSectionProps {
  section: BaseSection<QuizSectionContent>;
  source?: Source;
}

export function QuizSection({ section }: QuizSectionProps) {
  const { title, description, questions } = section.content;
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const toggleHint = (questionId: string) => {
    setShowHints((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowHints({});
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = questions.filter(
    (q) => selectedAnswers[q.id] === q.correctOptionIndex
  ).length;

  return (
    <section id={section.id} className="py-12 border-b border-white/10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-xs font-mono text-[#D1FF00] border border-white/10">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Interactive Knowledge Check</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {title || section.title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-zinc-400">{description}</p>
            )}
          </div>

          {/* Score counter & Reset */}
          {answeredCount > 0 && (
            <div className="flex items-center gap-3 self-start sm:self-auto rounded-xl border border-white/10 bg-zinc-900/90 px-4 py-2">
              <div className="text-xs font-mono">
                <span className="text-zinc-400">Score: </span>
                <span className="font-bold text-[#D1FF00]">
                  {correctCount} / {questions.length}
                </span>
              </div>
              <button
                onClick={handleResetQuiz}
                className="text-zinc-500 hover:text-white transition-colors"
                title="Reset quiz"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q, qIdx) => {
            const selectedOpt = selectedAnswers[q.id];
            const isAnswered = selectedOpt !== undefined;
            const isCorrect = selectedOpt === q.correctOptionIndex;

            return (
              <div
                key={q.id || qIdx}
                className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 backdrop-blur-xl transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="text-base font-bold text-white flex items-start gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 border border-white/10 text-xs font-mono text-[#D1FF00]">
                      Q{qIdx + 1}
                    </span>
                    <span>{q.question}</span>
                  </h3>

                  {q.hint && !isAnswered && (
                    <button
                      onClick={() => toggleHint(q.id)}
                      className="text-xs text-zinc-500 hover:text-[#D1FF00] font-mono shrink-0"
                    >
                      Hint
                    </button>
                  )}
                </div>

                {/* Hint box */}
                {showHints[q.id] && q.hint && !isAnswered && (
                  <div className="mb-4 rounded-xl border border-white/10 bg-zinc-900/60 p-3 text-xs text-amber-300 font-mono">
                    💡 Hint: {q.hint}
                  </div>
                )}

                {/* Options */}
                <div className="space-y-2.5">
                  {q.options.map((optionText, optIdx) => {
                    const isThisSelected = selectedOpt === optIdx;
                    const isThisCorrect = optIdx === q.correctOptionIndex;

                    let buttonStyle =
                      'border-white/10 bg-zinc-900/50 text-zinc-300 hover:border-white/20 hover:bg-zinc-900';

                    if (isAnswered) {
                      if (isThisCorrect) {
                        buttonStyle =
                          'border-emerald-500/50 bg-emerald-500/10 text-white font-medium';
                      } else if (isThisSelected && !isThisCorrect) {
                        buttonStyle =
                          'border-rose-500/50 bg-rose-500/10 text-rose-200 line-through';
                      } else {
                        buttonStyle = 'border-white/5 bg-zinc-950 text-zinc-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left rounded-xl border p-3.5 text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${buttonStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 font-mono text-[10px] text-zinc-400 uppercase">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{optionText}</span>
                        </div>

                        {isAnswered && isThisCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        )}
                        {isAnswered && isThisSelected && !isThisCorrect && (
                          <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card upon answering */}
                {isAnswered && (
                  <div
                    className={`mt-4 rounded-xl border p-4 text-xs sm:text-sm leading-relaxed ${
                      isCorrect
                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200'
                        : 'border-amber-500/20 bg-amber-500/5 text-zinc-300'
                    }`}
                  >
                    <div className="font-mono font-bold uppercase text-[11px] mb-1 flex items-center gap-1.5">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Correct! Explanation:</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5 text-amber-400" />
                          <span className="text-amber-400">Incorrect. Explanation:</span>
                        </>
                      )}
                    </div>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
