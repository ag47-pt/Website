/**
 * LiveSkills — tokens de superfície
 * ==================================
 * Extraídos da linguagem visual real do /labs para o mini app não parecer
 * um corpo estranho dentro do portal:
 *
 *   - `LabVisitCard`      → border-white/10 · bg-white/5 · rounded-2xl · p-8
 *   - `app/labs/layout`   → bg-white/5 backdrop-blur-xl (header)
 *   - `LabStatusTag`      → bg-white/5 · rounded-full · border-white/10
 *   - chips de spec       → primary+'10' bg · primary+'40' border
 *
 * Regra que o portal segue e o LiveSkills passou a seguir: o fundo do /labs
 * (nebulosa) fica visível — a legibilidade vem do vidro dos cards, não de um
 * véu por cima da página. Texto de corpo usa `theme.colors.textSecondary`
 * para acompanhar o tema ativo (lime, orange, blue, tomate, default).
 */

/** Card principal — equivalente ao LabVisitCard. */
export const CARD = 'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl';

/** Card principal com resposta a hover, para elementos navegáveis. */
export const CARD_INTERACTIVE =
  'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.08] hover:border-white/20';

/** Painel encaixado dentro de um card — mais fundo, para blocos densos. */
export const PANEL = 'rounded-xl border border-white/10 bg-black/50';

/** Painel encaixado sem borda forte, para listas internas. */
export const PANEL_SOFT = 'rounded-xl border border-white/5 bg-black/40';

/** Pill de estado, no padrão LabStatusTag. */
export const PILL = 'inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1';

/** Rótulo mono de secção/campo. */
export const MONO_LABEL = 'font-mono text-[10px] uppercase tracking-[0.2em]';

/** Espaçamento vertical entre secções, alinhado com `space-y-8 sm:space-y-10` do /labs. */
export const SECTION = 'scroll-mt-28 pt-8 sm:pt-10';
