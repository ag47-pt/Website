'use client';

import React from 'react';
import { ComparisonSectionContent, BaseSection, Source } from '@/eco/youlearn/schema/types';
import { Columns3, Check, Award, Trophy } from 'lucide-react';

interface ComparisonSectionProps {
  section: BaseSection<ComparisonSectionContent>;
  source?: Source;
}

export function ComparisonSection({ section }: ComparisonSectionProps) {
  const { context, columns, rows, verdict } = section.content;

  return (
    <section id={section.id} className="py-12 border-b border-white/10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-xs font-mono text-[#D1FF00] border border-white/10">
            <Columns3 className="h-3.5 w-3.5" />
            <span>Architectural Comparison</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-1 text-sm text-zinc-400">{section.subtitle}</p>
          )}
          {context && (
            <p className="mt-3 text-sm text-zinc-300 leading-relaxed max-w-3xl">
              {context}
            </p>
          )}
        </div>

        {/* Responsive Matrix Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-900/80">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`py-3.5 px-4 font-mono font-bold uppercase tracking-wider ${
                      col.highlight ? 'text-[#D1FF00] bg-[#D1FF00]/5' : 'text-zinc-300'
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-mono font-semibold text-zinc-300">
                    <div>{row.aspect}</div>
                    {row.note && (
                      <div className="text-[11px] font-normal text-zinc-500 mt-0.5">{row.note}</div>
                    )}
                  </td>

                  {columns.slice(1).map((col) => {
                    const val = row.values[col.key] || '—';
                    const isWinner = row.verdictWinnerKey === col.key;

                    return (
                      <td
                        key={col.key}
                        className={`py-4 px-4 leading-relaxed ${
                          col.highlight ? 'bg-[#D1FF00]/5 font-medium text-white' : 'text-zinc-300'
                        }`}
                      >
                        <div className="flex items-start gap-1.5">
                          {isWinner && (
                            <Check className="h-4 w-4 text-[#D1FF00] shrink-0 mt-0.5" />
                          )}
                          <span>{val}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Overall Verdict Banner */}
        {verdict && (
          <div className="mt-6 rounded-2xl border border-[#D1FF00]/30 bg-gradient-to-r from-[#D1FF00]/10 via-zinc-900 to-zinc-950 p-5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D1FF00] mb-1.5">
              <Trophy className="h-4 w-4" />
              <span>ARCHITECTURAL VERDICT</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
              {verdict}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
