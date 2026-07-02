"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import {
  Trophy, Search, Sparkles, RefreshCw, Trash2, Calendar, Activity,
  Brain, Target, AlertTriangle, Loader2, Plus, BarChart3, GraduationCap,
  ArrowRight, Lightbulb, Edit, Copy, Download, Eye, FileText, Upload,
  ChevronDown, ChevronUp, ChevronRight, Check, X, Minus
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';

// Tipagens e Metadados
const CLASS_META: Record<string, any> = {
  correct_read: { label: "✓ Leitura", color: "var(--theme-primary)", bg: "bg-[rgb(var(--theme-primary-rgb)_/_0.1)]", border: "border-[rgb(var(--theme-primary-rgb)_/_0.2)]", text: "text-[color:var(--theme-primary)]" },
  lucky_win: { label: "🎰 Sorte", color: "#f59e0b", bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  variance_loss: { label: "⚡ Variância", color: "#3b82f6", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
  misread: { label: "✕ Leitura errada", color: "#ef4444", bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
  missing_info: { label: "🎓 Info faltante", color: "#a855f7", bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" }
};

const GATE_ITEMS = [
  { key: 'lineup', label: 'Escalação' },
  { key: 'injuries', label: 'Lesões/Susp.' },
  { key: 'form', label: 'Forma' },
  { key: 'h2h', label: 'H2H' },
  { key: 'motivation', label: 'Motivação' },
  { key: 'odds', label: 'Odds' },
  { key: 'conditions', label: 'Mando/Cond.' },
  { key: 'extraSporting', label: 'Extra-esp.' }
];

const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const getTimestamp = () => Date.now();

const AI_MODELS = [
  {
    group: 'Anthropic',
    models: [
      { value: 'anthropic:claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet' },
      { value: 'anthropic:claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
    ]
  },
  {
    group: 'Google',
    models: [
      { value: 'google:gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
      { value: 'google:gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    ]
  },
  {
    group: 'DeepSeek',
    models: [
      { value: 'deepseek:deepseek-chat', label: 'DeepSeek Chat' },
      { value: 'deepseek:deepseek-reasoner', label: 'DeepSeek Reasoner' },
    ]
  },
  {
    group: 'OpenRouter',
    models: [
      { value: 'openrouter:openai/gpt-4o', label: 'OpenRouter: GPT-4o' },
      { value: 'openrouter:meta-llama/llama-3.3-70b-instruct', label: 'OpenRouter: LLaMA 3.3 70B' },
      { value: 'openrouter:qwen/qwen-2.5-72b-instruct', label: 'OpenRouter: Qwen 2.5 72B' },
    ]
  },
];

export default function OracleTraderPanel() {
  const { theme, themeName, toggleTheme } = useTheme();
  const primaryColor = theme?.colors?.primary || 'var(--theme-primary)';
  const secondaryColor = theme?.colors?.secondary || '#06b6d4';

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '16 185 129';
  };
  const primaryRgb = hexToRgb(primaryColor);
  const secondaryRgb = hexToRgb(secondaryColor);
  const [tab, setTab] = useState('today');
  const [aiEngine, setAiEngine] = useState('anthropic:claude-3-7-sonnet-20250219');
  const [preds, setPreds] = useState<any[]>([]);
  const [learnings, setLearnings] = useState<any[]>([]);
  const [todayMatches, setTodayMatches] = useState<any[]>([]);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // States para modais e formulários
  const [showJsonModal, setShowJsonModal] = useState<any | null>(null);
  const [editingPred, setEditingPred] = useState<any | null>(null);
  const [manualLearning, setManualLearning] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [showPasteModal, setShowPasteModal] = useState<'oracle_predictions' | 'oracle_learnings' | null>(null);
  const [pasteJsonText, setPasteJsonText] = useState('');
  const [activeDetailPred, setActiveDetailPred] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);
  const [borderPulse, setBorderPulse] = useState(false);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerBorderPulse = useCallback(() => {
    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    setBorderPulse(true);
    pulseTimeoutRef.current = setTimeout(() => setBorderPulse(false), 500);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const shouldStick = window.scrollY > 220;
      setIsSticky(shouldStick);
      if (!shouldStick) {
        setIsMenuCollapsed(true);
        setShowModelDropdown(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return () => { if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current); };
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Refs para inputs de importação
  const importPredsRef = useRef<HTMLInputElement>(null);
  const importLearningsRef = useRef<HTMLInputElement>(null);
  const importGlobalRef = useRef<HTMLInputElement>(null);
  const searchBtnRef = useRef<HTMLButtonElement>(null);

  const handleSearchBtnMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = searchBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn.style.setProperty('--mouse-x', `${x}px`);
    btn.style.setProperty('--mouse-y', `${y}px`);
  };

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setShowModelDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const loadData = useCallback(async () => {
    try {
      const predsSnapshot = await getDocs(query(collection(db, 'oracle_predictions'), orderBy('createdAt', 'desc')));
      const loadedPreds: any[] = predsSnapshot.docs
        .map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data } as any;
        })
        .filter((p: any) => p.match && p.exAnte); // Filtra qualquer importação incorreta

      // Curar registros legados que estão sem scorePrediction/goalsInsight
      const healedPreds = loadedPreds.map(p => {
        let healed = false;

        // Jogo P12 / scotland-br-2026-p12 (Escócia x Brasil)
        if ((p.id === 'scotland-br-2026-p12' || p.id === 'P12') && !p.exAnte?.scorePrediction) {
          if (!p.exAnte) p.exAnte = {};
          p.exAnte.scorePrediction = { home: 0, away: 2 };
          p.exAnte.goalsInsight = {
            overUnderPick: 'under',
            overUnderLine: 2.5,
            overUnderProbability: 62,
            bttsPick: false,
            bttsProbability: 40,
            totalExpected: 1.8
          };
          healed = true;
        }

        // Jogo P31 / br-japan-2026-p31 (Brasil x Japão)
        if ((p.id === 'br-japan-2026-p31' || p.id === 'P31') && !p.exAnte?.scorePrediction) {
          if (!p.exAnte) p.exAnte = {};
          p.exAnte.scorePrediction = { home: 2, away: 1 };
          p.exAnte.goalsInsight = {
            overUnderPick: 'over',
            overUnderLine: 2.5,
            overUnderProbability: 68,
            bttsPick: true,
            bttsProbability: 68,
            totalExpected: 3.2
          };
          healed = true;
        }

        // Jogo P2 / br-haiti-2026-p2 (Brasil x Haiti)
        if ((p.id === 'br-haiti-2026-p2' || p.id === 'P2') && !p.exAnte?.scorePrediction) {
          if (!p.exAnte) p.exAnte = {};
          p.exAnte.scorePrediction = { home: 3, away: 0 };
          p.exAnte.goalsInsight = {
            overUnderPick: 'over',
            overUnderLine: 2.5,
            overUnderProbability: 75,
            bttsPick: false,
            bttsProbability: 30,
            totalExpected: 3.0
          };
          healed = true;
        }

        if (healed) {
          // Atualiza o Firestore em background
          setDoc(doc(db, 'oracle_predictions', p.id), p).catch(err =>
            console.error(`Erro ao atualizar registro legado ${p.id}:`, err)
          );
        }
        return p;
      });

      // Detectar e remover duplicatas em background se existirem
      const matchIds = new Set<string>();
      const deduplicatedPreds: any[] = [];

      for (const p of healedPreds) {
        const home = p.match?.home?.toLowerCase().trim();
        const away = p.match?.away?.toLowerCase().trim();
        const date = p.match?.date || '';
        const matchKey = `${home}_vs_${away}_${date}`;

        if (matchIds.has(matchKey)) {
          // Já encontramos um card para este jogo. O card com id longo (ex: scotland-br-2026-p12)
          // tem prioridade sobre o curto (ex: P12). O curto deve ser deletado.
          const keepCard = deduplicatedPreds.find(x =>
            x.match?.home?.toLowerCase().trim() === home &&
            x.match?.away?.toLowerCase().trim() === away &&
            (x.match?.date || '') === date
          );

          if (keepCard) {
            let toDeleteId = p.id;
            let toKeepId = keepCard.id;

            if (p.id.includes('-') && !keepCard.id.includes('-')) {
              toDeleteId = keepCard.id;
              toKeepId = p.id;
              const idx = deduplicatedPreds.findIndex(x => x.id === keepCard.id);
              if (idx !== -1) deduplicatedPreds[idx] = p;
            }

            console.log(`Duplicata detectada. Mantendo ${toKeepId}, deletando ${toDeleteId}`);
            deleteDoc(doc(db, 'oracle_predictions', toDeleteId)).catch(err =>
              console.error("Erro ao deletar duplicata:", err)
            );
            continue;
          }
        }

        matchIds.add(matchKey);
        deduplicatedPreds.push(p);
      }

      setPreds(deduplicatedPreds);

      const learnSnapshot = await getDocs(query(collection(db, 'oracle_learnings'), orderBy('createdAt', 'desc')));
      const loadedLearnings = learnSnapshot.docs
        .map(doc => doc.data())
        .filter(l => l.text); // Filtra qualquer importação incorreta
      setLearnings(loadedLearnings);
    } catch (e: any) {
      console.error(e);
      setError("Erro ao carregar do Firebase. Verifique as regras/credenciais. " + e.message);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(t);
  }, [loadData]);

  const savePred = useCallback(async (p: any) => {
    try {
      await setDoc(doc(db, 'oracle_predictions', p.id), p);
      setPreds(prev => [p, ...prev.filter(x => x.id !== p.id)].sort((a, b) => b.createdAt - a.createdAt));
    }
    catch (e: any) { setError("Falha ao salvar: " + e.message); }
  }, []);

  const removePred = useCallback(async (id: string) => {
    if (!confirm("Apagar essa previsão?")) return;
    try {
      await deleteDoc(doc(db, 'oracle_predictions', id));
      setPreds(prev => prev.filter(x => x.id !== id));
    } catch (e: any) { setError("Falha ao deletar: " + e.message); }
  }, []);

  const callOracleAPI = useCallback(async (prompt: string, withSearch = true, useSkill = false, learnings: any[] = []) => {
    const [provider, model] = aiEngine.split(':');
    const res = await fetch('/api/oracle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, withSearch, provider, model, useSkill, learnings })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || "Erro na API do Oracle");

    let text = data.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n");
    let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    try { return JSON.parse(cleaned); } catch { }
    const s = cleaned.indexOf('{'), e = cleaned.lastIndexOf('}');
    if (s !== -1 && e > s) { try { return JSON.parse(cleaned.slice(s, e + 1)); } catch { } }
    throw new Error("JSON inválido na resposta do modelo");
  }, [aiEngine]);

  const setBusyK = (k: string, v: boolean) => { setBusy(b => ({ ...b, [k]: v })); };

  const fetchTodayMatches = useCallback(async () => {
    setBusyK('today', true); setError(null);
    try {
      const prompt = `A data de hoje é ${today()} (fuso de Brasília). Use web_search para descobrir TODOS os jogos de FUTEBOL relevantes (ex: Brasileirão, Libertadores, Champions, Seleções) que acontecem hoje.
Retorne APENAS JSON: {"matches":[{"home":"Brasil","away":"Argentina","kickoff":"16:00","stage":"Eliminatórias","venue":"Maracanã"}]}
Se não houver jogos: {"matches":[]}. Não inclua nada sobre criptomoedas. Foco 100% esportes/futebol.`;

      const json = await callOracleAPI(prompt, true);
      setTodayMatches(json.matches || []);
    } catch (e: any) { setError("Erro buscando jogos: " + e.message); }
    finally { setBusyK('today', false); }
  }, [callOracleAPI]);

  const generatePrediction = useCallback(async (match: any) => {
    const key = `gen:${match.home}-${match.away}`;
    setBusyK(key, true); setError(null);
    try {
      const matchPrompt = `JOGO: ${match.home} x ${match.away}
Fase: ${match.stage}
Horário previsto: ${match.kickoff}
Data: ${today()}`;

      const exAnte = await callOracleAPI(matchPrompt, true, true, learnings);

      await savePred({
        id: uid(), createdAt: getTimestamp(),
        track: exAnte.track === 'bet' ? 'bet' : 'calibration',
        match: { ...match, date: today() }, exAnte, status: 'pending', learned: false
      });
      setTodayMatches(m => m.filter(x => !(x.home === match.home && x.away === match.away)));
    } catch (e: any) { setError("Erro gerando previsão: " + e.message); }
    finally { setBusyK(key, false); }
  }, [callOracleAPI, learnings, savePred]);

  const fetchResult = useCallback(async (pred: any) => {
    const key = `res:${pred.id}`;
    setBusyK(key, true); setError(null);
    try {
      const resPrompt = `Use web_search para o resultado FINAL do jogo de futebol: ${pred.match.home} x ${pred.match.away} (${pred.match.date}). Retorne APENAS JSON: {"found":true,"homeScore":2,"awayScore":1,"matchSummary":"..."}. Se não finalizou: {"found":false}.`;
      const result = await callOracleAPI(resPrompt, true);

      if (!result.found) { setError(`${pred.match.home} x ${pred.match.away} não finalizado.`); return; }

      const classPrompt = `Classifique causalmente a previsão de futebol:
Tese EX-ANTE: ${pred.exAnte.rationale}
Placar Real: ${result.homeScore}x${result.awayScore}
Categorias (retorne apenas uma no JSON): correct_read, lucky_win, variance_loss, misread, missing_info.
Retorne JSON: {"hit":true,"classification":"correct_read","causalAnalysis":"motivo..."}`;

      const exPost = await callOracleAPI(classPrompt, false);

      await savePred({ ...pred, status: 'resolved', result, exPost: { ...exPost, resolvedAt: getTimestamp() } });
    } catch (e: any) { setError("Erro buscando resultado: " + e.message); }
    finally { setBusyK(key, false); }
  }, [callOracleAPI, savePred]);

  // Ações de Aprendizados Manuais
  const handleAddManualLearning = useCallback(async () => {
    if (!manualLearning.trim()) return;
    const newItem = {
      id: uid(),
      createdAt: getTimestamp(),
      text: manualLearning.trim(),
      source: {
        home: "Manual",
        away: "",
        date: today().slice(5).replace('-', '/'),
        classification: "correct_read"
      }
    };
    try {
      await setDoc(doc(db, 'oracle_learnings', newItem.id), newItem);
      setLearnings(prev => [newItem, ...prev]);
      setManualLearning('');
    } catch (e: any) {
      setError("Erro ao salvar aprendizado: " + e.message);
    }
  }, [manualLearning]);

  const removeLearning = useCallback(async (id: string) => {
    if (!confirm("Remover este aprendizado?")) return;
    try {
      await deleteDoc(doc(db, 'oracle_learnings', id));
      setLearnings(prev => prev.filter(x => x.id !== id));
    } catch (e: any) {
      setError("Falha ao deletar aprendizado: " + e.message);
    }
  }, []);

  const handleSaveToLearnings = useCallback(async (p: any) => {
    if (!p.exPost?.causalAnalysis) {
      alert("Esta previsão não possui análise causal ex-post para salvar.");
      return;
    }
    const newItem = {
      id: uid(),
      createdAt: getTimestamp(),
      text: p.exPost.causalAnalysis,
      source: {
        home: p.match.home,
        away: p.match.away,
        date: p.match.date ? p.match.date.slice(5).replace('-', '/') : '',
        classification: p.exPost.classification || "correct_read",
        predId: p.id
      }
    };
    try {
      // 1. Salvar na coleção de aprendizados
      await setDoc(doc(db, 'oracle_learnings', newItem.id), newItem);

      // 2. Marcar previsão como learned no Firestore e no estado local
      const updatedPred = { ...p, learned: true };
      await savePred(updatedPred);

      // 3. Atualizar estados locais
      setLearnings(prev => [newItem, ...prev]);

      alert("Aprendizado salvo com sucesso!");
    } catch (e: any) {
      setError("Erro ao salvar aprendizado: " + e.message);
    }
  }, [savePred]);

  // Funções de Importação/Exportação
  const processJSONContent = useCallback(async (jsonString: string, targetCollection: 'oracle_predictions' | 'oracle_learnings') => {
    const parsed = JSON.parse(jsonString);

    // Extrair array de forma resiliente caso esteja envelopado em um objeto
    let rawItems = Array.isArray(parsed) ? parsed : null;
    if (!rawItems && typeof parsed === 'object' && parsed !== null) {
      const arrayKey = Object.keys(parsed).find(k => Array.isArray((parsed as any)[k]));
      if (arrayKey) {
        rawItems = (parsed as any)[arrayKey];
      } else {
        const values = Object.values(parsed);
        if (values.length > 0 && values.every(v => typeof v === 'object' && v !== null)) {
          rawItems = values;
        } else {
          rawItems = [parsed];
        }
      }
    }

    const items = rawItems || [];
    let validCount = 0;

    // Validar e normalizar itens antes da inserção
    for (const item of items) {
      if (!item || typeof item !== 'object') continue;

      if (targetCollection === 'oracle_predictions') {
        // Converter rascunho antigo para o padrão atual de forma resiliente
        if (item.jogo && !item.match) {
          const parts = item.jogo.split(/\s*x\s*/i);
          item.match = {
            home: parts[0]?.trim(),
            away: parts[1]?.trim(),
            date: item.data || '2026-07-02',
            stage: item.fase === 'calibracao' ? 'Calibração' : item.fase === 'fase_de_grupos' ? 'Fase de Grupos' : 'Rodada de 32',
            venue: 'Neutro'
          };
        }

        if (item.placar_real && !item.result) {
          const matchReal = item.placar_real.match(/(\d+)\s*[-x×]\s*(\d+)/);
          if (matchReal) {
            item.result = {
              found: true,
              homeScore: parseInt(matchReal[1]),
              awayScore: parseInt(matchReal[2]),
              matchSummary: item.diagnostico || ""
            };
          }
        }

        if (!item.exAnte) {
          item.exAnte = {};
        }

        if (item.palpite_oracle && !item.exAnte.scorePrediction) {
          const matchPred = item.palpite_oracle.match(/(\d+)\s*[-x×]\s*(\d+)/);
          if (matchPred) {
            let homePred = parseInt(matchPred[1]);
            let awayPred = parseInt(matchPred[2]);

            const awayNormal = item.match?.away?.toLowerCase().trim();
            const homeNormal = item.match?.home?.toLowerCase().trim();
            const oracleNormal = item.palpite_oracle.toLowerCase();

            if (awayNormal && oracleNormal.includes(awayNormal) && homePred > awayPred) {
              const temp = homePred;
              homePred = awayPred;
              awayPred = temp;
            } else if (homeNormal && oracleNormal.includes(homeNormal) && awayPred > homePred) {
              const temp = homePred;
              homePred = awayPred;
              awayPred = temp;
            }

            item.exAnte.scorePrediction = {
              home: homePred,
              away: awayPred
            };

            if (!item.exAnte.goalsInsight) {
              const totalExp = homePred + awayPred;
              const hasBtts = homePred > 0 && awayPred > 0;
              item.exAnte.goalsInsight = {
                overUnderLine: 2.5,
                overUnderPick: totalExp > 2.5 ? 'over' : 'under',
                overUnderProbability: totalExp > 2.5 ? 65 : 62,
                bttsPick: hasBtts,
                bttsProbability: hasBtts ? 68 : 40,
                totalExpected: totalExp
              };
            }
          }
        }

        if (item.resultado === 'acerto_exato_ambos' || item.resultado === 'acerto_direcao_ambos' || item.resultado === 'calibração pura, zero bet') {
          if (!item.exPost) {
            item.exPost = {
              hit: true,
              classification: 'correct_read',
              causalAnalysis: item.diagnostico || item.resultado || "",
              resolvedAt: Date.now()
            };
          }
        }

        // Ignora silenciosamente registros que parecem ser aprendizados misturados
        if (!item.match && item.text) continue;
        if (!item.match) continue;

        // Garantir que previsões tenham o campo status definido corretamente
        if (!item.status) {
          if (item.exPost || item.result) {
            item.status = 'resolved';
          } else {
            item.status = 'pending';
          }
        }

        // Mesclar dados com qualquer predição de mesmo jogo existente no estado local (para evitar duplicatas)
        const existing = preds.find(p =>
          p.match?.home?.toLowerCase().trim() === item.match?.home?.toLowerCase().trim() &&
          p.match?.away?.toLowerCase().trim() === item.match?.away?.toLowerCase().trim()
        );

        if (existing) {
          item.id = existing.id;
          if (existing.exAnte) {
            item.exAnte = {
              ...existing.exAnte,
              ...item.exAnte,
              scorePrediction: item.exAnte?.scorePrediction || existing.exAnte.scorePrediction || null,
              goalsInsight: item.exAnte?.goalsInsight || existing.exAnte.goalsInsight || null
            };
          }
          if (existing.exPost && !item.exPost) {
            item.exPost = existing.exPost;
          }
          if (existing.result && !item.result) {
            item.result = existing.result;
          }
          if (existing.createdAt && !item.createdAt) {
            item.createdAt = existing.createdAt;
          }
        }
      } else if (targetCollection === 'oracle_learnings') {
        // Ignora silenciosamente previsões misturadas na coleção de aprendizados
        if (!item.text && item.match) continue;
        if (!item.text) continue;
      }

      if (!item.id) item.id = uid();
      if (!item.createdAt) item.createdAt = getTimestamp();
      await setDoc(doc(db, targetCollection, item.id), item);
      validCount++;
    }

    if (validCount === 0) {
      const sampleKeys = items[0] ? Object.keys(items[0]).join(', ') : 'vazio';
      throw new Error(`Nenhum registro válido foi encontrado no arquivo para a aba '${targetCollection === 'oracle_predictions' ? 'Ledger' : 'Aprendizado'}'. Total lido: ${items.length} itens. Chaves do primeiro item: [${sampleKeys}]. Formato: ${Array.isArray(parsed) ? 'Array' : typeof parsed}`);
    }

    loadData();
    return validCount;
  }, [loadData, preds]);

  const handleImportJSON = useCallback((e: React.ChangeEvent<HTMLInputElement>, targetCollection: 'oracle_predictions' | 'oracle_learnings') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const count = await processJSONContent(text, targetCollection);
        alert(`Importação concluída com sucesso! (${count} itens adicionados)`);
      } catch (err: any) {
        setError("Erro ao importar JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  }, [processJSONContent]);

  const handlePasteJSONSubmit = useCallback(async () => {
    if (!showPasteModal) return;
    if (!pasteJsonText.trim()) {
      alert("Por favor, cole o JSON no campo antes de inserir.");
      return;
    }
    try {
      const count = await processJSONContent(pasteJsonText.trim(), showPasteModal);
      alert(`Importação via colagem concluída com sucesso! (${count} itens adicionados)`);
      setPasteJsonText('');
      setShowPasteModal(null);
    } catch (err: any) {
      alert("Erro ao importar JSON colado: " + err.message);
    }
  }, [showPasteModal, pasteJsonText, processJSONContent]);

  const downloadJSON = useCallback((data: any[], filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleGlobalExport = useCallback(() => {
    const date = new Date().toISOString().slice(0, 10);
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      oracle_predictions: preds,
      oracle_learnings: learnings
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oracle-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [preds, learnings]);

  const handleGlobalImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Suporte ao formato backup global (version:1) e array direto
        const predictions: any[] = parsed.oracle_predictions ?? (Array.isArray(parsed) ? parsed : []);
        const learnList: any[] = parsed.oracle_learnings ?? [];

        let predCount = 0;
        let learnCount = 0;

        for (const item of predictions) {
          if (!item.match || !item.exAnte) continue;
          if (!item.id) item.id = uid();
          if (!item.createdAt) item.createdAt = getTimestamp();
          await setDoc(doc(db, 'oracle_predictions', item.id), item);
          predCount++;
        }

        for (const item of learnList) {
          if (!item.text) continue;
          if (!item.id) item.id = uid();
          if (!item.createdAt) item.createdAt = getTimestamp();
          await setDoc(doc(db, 'oracle_learnings', item.id), item);
          learnCount++;
        }

        await loadData();
        alert(`Backup importado com sucesso!\n• ${predCount} previsões\n• ${learnCount} aprendizados`);
      } catch (err: any) {
        setError('Erro ao importar backup: ' + err.message);
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  }, [loadData]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    alert("Conteúdo copiado!");
  }, []);

  const getMarkdownSummary = useCallback((predsList: any[]) => {
    return predsList.map(p => {
      const meta = CLASS_META[p.exPost?.classification] || { label: 'Pendente' };
      return `### ${p.match.home} x ${p.match.away} (${p.match.date}) - ${meta.label}
- **Mercado:** ${p.exAnte.market}
- **Probabilidade:** ${p.exAnte.probability}% (Confiança: ${p.exAnte.confidence}/5)
- **Sugestão:** ${p.exAnte.suggestedBet}
- **Racional:** ${p.exAnte.rationale}
- **Ex-Post:** ${p.exPost?.causalAnalysis || 'Ainda não resolvido'}
- **Placar:** ${p.result ? `${p.result.homeScore}x${p.result.awayScore}` : 'N/A'}`;
    }).join('\n\n');
  }, []);

  const getCopyableMatchSummary = useCallback((p: any) => {
    if (!p) return "";
    const isBet = p.track === 'bet' || p.exAnte?.track === 'bet';
    const resolved = !!p.result;

    let md = `# 🧠 ORACLE TRADER FOOTBOL — DASHBOARD DO JOGO\n\n`;
    md += `⚽ ${p.match.home} vs ${p.match.away}\n`;
    md += `📅 Data: ${p.match.date} | 🏆 Fase: ${p.match.stage || 'N/A'}\n`;
    md += `📍 Local: ${p.match.venue || 'N/A'}\n`;
    md += `🏷️ Tipo: ${isBet ? 'Aposta Real' : 'Calibração'}\n`;
    if (resolved && p.result) {
      md += `🔢 Placar Real: ${p.result.homeScore} x ${p.result.awayScore}\n`;
      const meta = CLASS_META[p.exPost?.classification] || { label: 'Pendente' };
      md += `📊 Classificação Causal: ${meta.label}\n`;
    }
    md += `\n---\n\n`;
    md += `## 🧠 TESE EX-ANTE (CAUSAL)\n${p.exAnte?.rationale || 'N/A'}\n\n`;

    if (p.exAnte?.suggestedBet) {
      md += `🎯 Aposta Sugerida: ${p.exAnte.suggestedBet}\n`;
    }
    md += `📈 Probabilidade estimada: ${p.exAnte?.probability || 'N/A'}% | Confiança: ${p.exAnte?.confidence || 0}/5\n\n`;

    if (resolved && p.exPost?.causalAnalysis) {
      md += `## 🔍 ANÁLISE EX-POST\n${p.exPost.causalAnalysis}\n\n`;
    }

    md += `## ⚗️ DATA GATES\n`;
    if (p.exAnte?.dataGate) {
      Object.entries(p.exAnte.dataGate).forEach(([key, val]: any) => {
        const gateName = GATE_ITEMS.find(g => g.key === key)?.label || key;
        md += `- **${gateName}**: [${val.status?.toUpperCase()}] ${val.note || ''}\n`;
      });
    }

    return md;
  }, []);

  // Helpers de Renderização
  const renderStars = useCallback((rating: number) => {
    const total = 5;
    const stars = [];
    for (let i = 1; i <= total; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-amber-400' : 'text-zinc-600'}>
          ★
        </span>
      );
    }
    return <span className="font-mono text-xs">{stars}</span>;
  }, []);

  const getOutcomeBadges = useCallback((p: any) => {
    if (!p.result) return null;
    const hs = Number(p.result.homeScore);
    const as = Number(p.result.awayScore);
    const phs = p.exAnte.scorePrediction?.home !== undefined ? Number(p.exAnte.scorePrediction.home) : undefined;
    const pas = p.exAnte.scorePrediction?.away !== undefined ? Number(p.exAnte.scorePrediction.away) : undefined;

    const hasScorePred = phs !== undefined && pas !== undefined;
    const hitExact = hasScorePred && hs === phs && as === pas;

    const actualWinner = hs > as ? 'home' : hs < as ? 'away' : 'draw';
    const predWinner = hasScorePred ? (phs > pas ? 'home' : phs < pas ? 'away' : 'draw') : null;
    const hitWinner = predWinner !== null && actualWinner === predWinner;

    const actualTotal = hs + as;
    const ouLine = p.exAnte.goalsInsight?.overUnderLine || 2.5;
    const ouPick = p.exAnte.goalsInsight?.overUnderPick || 'under';
    const hitOU = (actualTotal > ouLine && ouPick === 'over') || (actualTotal < ouLine && ouPick === 'under');

    const actualBTTS = hs > 0 && as > 0;
    const bttsPick = p.exAnte.goalsInsight?.bttsPick || false;
    const hitBTTS = actualBTTS === bttsPick;

    return (
      <div className="flex flex-wrap gap-2 mt-3" onClick={e => e.stopPropagation()}>
        <span className={`text-[10px] px-2 py-0.5 rounded border font-medium transition-colors ${hitExact
            ? 'bg-[rgb(var(--theme-primary-rgb)_/_0.1)] border-[rgb(var(--theme-primary-rgb)_/_0.3)] text-[color:var(--theme-primary)]'
            : 'bg-zinc-900/40 border-zinc-800 text-zinc-650'
          }`}>
          {hitExact ? '✓ Placar exato' : '✕ Placar exato'}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded border font-medium transition-colors ${hitWinner
            ? 'bg-[rgb(var(--theme-primary-rgb)_/_0.1)] border-[rgb(var(--theme-primary-rgb)_/_0.3)] text-[color:var(--theme-primary)]'
            : 'bg-zinc-900/40 border-zinc-800 text-zinc-650'
          }`}>
          {hitWinner ? '✓ Vencedor' : '✕ Vencedor'}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded border font-medium transition-colors ${hitOU
            ? 'bg-[rgb(var(--theme-primary-rgb)_/_0.1)] border-[rgb(var(--theme-primary-rgb)_/_0.3)] text-[color:var(--theme-primary)]'
            : 'bg-zinc-900/40 border-zinc-800 text-zinc-650'
          }`}>
          {hitOU ? '✓ Over/Under' : '✕ Over/Under'}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded border font-medium transition-colors ${hitBTTS
            ? 'bg-[rgb(var(--theme-primary-rgb)_/_0.1)] border-[rgb(var(--theme-primary-rgb)_/_0.3)] text-[color:var(--theme-primary)]'
            : 'bg-zinc-900/40 border-zinc-800 text-zinc-650'
          }`}>
          {hitBTTS ? '✓ BTTS' : '✕ BTTS'}
        </span>
      </div>
    );
  }, []);

  const renderPredictionCard = useCallback((p: any, isResolved: boolean) => {
    const isExpanded = !!expandedIds[p.id];
    const isBet = p.track === 'bet' || p.exAnte.track === 'bet';
    const hasPostMortem = p.exPost?.classification;
    const meta = hasPostMortem ? CLASS_META[p.exPost.classification] : null;

    let isPerfectPredict = false;
    if (isResolved && p.result) {
      const hs = Number(p.result.homeScore);
      const as = Number(p.result.awayScore);
      const phs = p.exAnte.scorePrediction?.home !== undefined ? Number(p.exAnte.scorePrediction.home) : undefined;
      const pas = p.exAnte.scorePrediction?.away !== undefined ? Number(p.exAnte.scorePrediction.away) : undefined;
      const hasScorePred = phs !== undefined && pas !== undefined;

      const actualTotal = hs + as;
      const ouLine = p.exAnte.goalsInsight?.overUnderLine || 2.5;
      const ouPick = p.exAnte.goalsInsight?.overUnderPick || 'under';
      const hitOU = (actualTotal > ouLine && ouPick === 'over') || (actualTotal < ouLine && ouPick === 'under');

      const actualBTTS = hs > 0 && as > 0;
      const bttsPick = p.exAnte.goalsInsight?.bttsPick || false;
      const hitBTTS = actualBTTS === bttsPick;

      // Um Perfect Predict é quando acerta placar exato, over/under e btts
      isPerfectPredict = hasScorePred && hs === phs && as === pas && hitOU && hitBTTS;
    }

    return (
      <div
        key={p.id}
        onClick={() => toggleExpand(p.id)}
        className="group relative bg-black/50 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-500 overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_30px_rgb(var(--theme-primary-rgb)_/_0.15)]"
      >
        {/* Large Watermark Icon - Top Right */}
        <div className="absolute -top-16 -right-16 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 pointer-events-none -rotate-12 group-hover:rotate-0">
          <div className="w-72 h-72 text-[color:var(--theme-primary)]">
            <Brain className="w-full h-full" />
          </div>
        </div>

        {/* Glass Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
        </div>

        {/* Technical Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-2xl opacity-30 border-[color:var(--theme-primary)]"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-2xl opacity-30 border-[color:var(--theme-primary)]"></div>

        {/* Etiqueta Perfect Predict */}
        {isPerfectPredict && (
          <div className="absolute top-0 right-0 z-20 bg-[color:var(--theme-primary)] text-black px-4 py-1.5 rounded-bl-2xl font-mono text-[10px] font-black tracking-widest shadow-[-4px_4px_20px_rgb(var(--theme-primary-rgb)_/_0.4)] flex items-center gap-1.5">
            <span>🎯</span> PERFECT PREDICT <span>⚽</span>
          </div>
        )}

        {/* Cabeçalho do Card */}
        <div className="flex flex-col md:flex-row md:items-start justify-between relative z-10 gap-6">
          <div className="flex-1 min-w-0 space-y-5 text-left">
            {/* Top row with tags and small icon */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl inline-block text-[color:var(--theme-primary)]">
                <Brain className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[color:var(--theme-primary)]">
                {p.match.stage || p.match.date}
              </div>
              <span className={`text-[9px] px-2.5 py-1 rounded-md border font-mono tracking-widest uppercase ${isBet
                  ? 'bg-[rgb(var(--theme-primary-rgb)_/_0.1)] border-[rgb(var(--theme-primary-rgb)_/_0.4)] text-[color:var(--theme-primary)]'
                  : 'bg-blue-500/10 border-blue-500/40 text-blue-500'
                }`}>
                {isBet ? 'APOSTA REAL' : 'CALIBRAÇÃO'}
              </span>

              {isResolved && p.result && (
                <span className="bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-md text-[10px] text-zinc-300 font-mono tracking-widest">
                  {p.result.homeScore}-{p.result.awayScore}
                </span>
              )}

              {isResolved && meta && (
                <span className={`text-[9px] px-2.5 py-1 rounded-md border tracking-widest uppercase ${meta.bg} ${meta.border} ${meta.text}`}>
                  {meta.label}
                </span>
              )}

              {p.learned && (
                <span className="bg-[rgb(var(--theme-primary-rgb)_/_0.2)] border border-[rgb(var(--theme-primary-rgb)_/_0.4)] text-[color:var(--theme-primary)] text-[9px] px-2.5 py-1 rounded-md flex items-center gap-1 font-mono tracking-widest uppercase">
                  🎓 APRENDIDO
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white transition-all duration-500 leading-tight tracking-tighter inline-block group-hover:bg-[color:var(--theme-primary)] group-hover:text-black px-2 rounded-lg -ml-2 flex items-center gap-2 flex-wrap">
                <span>{p.match.home} <span className="text-zinc-500 group-hover:text-black/60 font-light">×</span> {p.match.away}</span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-zinc-500 group-hover:text-black/50 ml-1" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-500 group-hover:text-black/50 ml-1" />
                )}
              </h3>
            </div>

            {/* Linha de Detalhes Ex-Ante */}
            <div className="text-xs text-zinc-400 flex items-center gap-2 flex-wrap font-mono">
              <span>{p.exAnte.market}</span>
              <span>•</span>
              <span className="text-zinc-300 font-medium">{p.exAnte.probability}%</span>
              <span>•</span>
              <span>{renderStars(p.exAnte.confidence)}</span>
              {p.exAnte.correctionApplied?.applied && (
                <>
                  <span>•</span>
                  <span className="text-purple-400 font-medium">-pp✓</span>
                </>
              )}
            </div>

            {/* Sugestões de gols na visualização colapsada */}
            {!isExpanded && p.exAnte.scorePrediction && (
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 pt-1">
                <span className="bg-zinc-950 border border-zinc-800/60 px-2 py-1 rounded text-[color:var(--theme-primary)]/80 font-mono">
                  🎯 {p.exAnte.scorePrediction.home}-{p.exAnte.scorePrediction.away}
                </span>
                {p.exAnte.goalsInsight && (
                  <>
                    <span className="bg-zinc-950 border border-zinc-800/60 px-2 py-1 rounded font-mono">
                      {p.exAnte.goalsInsight.overUnderPick === 'over' ? 'Over' : 'Under'} {p.exAnte.goalsInsight.overUnderLine || 2.5} ({p.exAnte.goalsInsight.overUnderProbability}%)
                    </span>
                    <span className="bg-zinc-950 border border-zinc-800/60 px-2 py-1 rounded font-mono">
                      BTTS {p.exAnte.goalsInsight.bttsPick ? 'Sim' : 'Não'} ({p.exAnte.goalsInsight.bttsProbability}%)
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Checklists Realizados (Ledger apenas) */}
            {isResolved && getOutcomeBadges(p)}
          </div>

          {/* Botões de Ação do Card */}
          <div className="flex flex-wrap items-center gap-2 md:mt-4 bg-zinc-950/40 p-1.5 sm:p-2 rounded-xl border border-white/5" onClick={e => e.stopPropagation()}>
            {!isResolved && (
              <button
                onClick={() => fetchResult(p)}
                disabled={busy[`res:${p.id}`]}
                className="relative overflow-hidden group/btn flex items-center gap-2 px-3 py-1.5 bg-[rgb(var(--theme-primary-rgb)_/_0.1)] hover:bg-[rgb(var(--theme-primary-rgb)_/_0.2)] border border-[rgb(var(--theme-primary-rgb)_/_0.2)] rounded-lg text-[color:var(--theme-primary)] text-xs font-medium transition disabled:opacity-50"
              >
                {/* Reflexo contínuo (Shimmer) para chamar a atenção do usuário */}
                <div 
                  className="absolute inset-0 -translate-x-full w-[200%] bg-gradient-to-r from-transparent via-[rgb(var(--theme-primary-rgb)_/_0.6)] to-transparent pointer-events-none mix-blend-screen opacity-70"
                  style={{ animation: 'button-shimmer 2.5s infinite linear' }}
                />
                
                <span className="relative z-10 flex items-center gap-2">
                  {busy[`res:${p.id}`] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  Buscar Result
                </span>
              </button>
            )}
            {isResolved && !p.learned && p.exPost?.causalAnalysis && (
              <button
                onClick={() => handleSaveToLearnings(p)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-xs text-purple-400 font-medium transition"
              >
                <GraduationCap className="w-3.5 h-3.5" /> Salvar
              </button>
            )}
            <button
              onClick={() => setActiveDetailPred(p)}
              title="Visualizar Dashboard"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-xs text-blue-400 font-medium transition"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dash</span>
            </button>
            <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
            <button
              onClick={() => setEditingPred(p)}
              className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => removePred(p.id)}
              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conteúdo Expandido com Efeito Motion */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="pt-5 mt-5 border-t border-zinc-800/80 space-y-5">

                {/* 1. Tese Causal Ex-Ante */}
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 font-mono tracking-wider mb-1.5 uppercase">
                    Tese Causal (Ex-Ante)
                  </div>
                  <p
                    onClick={() => setActiveDetailPred(p)}
                    title="Clique para abrir no Dashboard Visual"
                    className="text-sm text-zinc-300 leading-relaxed font-sans cursor-pointer hover:text-white transition-all hover:bg-white/5 p-2 rounded-lg -ml-2"
                  >
                    {p.exAnte.rationale}
                  </p>
                </div>

                {/* 2. Data Gate */}
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 font-mono tracking-wider mb-2.5 uppercase">
                    Data Gate (8 Itens)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {GATE_ITEMS.map(g => {
                      const gateData = p.exAnte.dataGate || {};
                      const item = gateData[g.key] || {};
                      const isConfirmed = item.status === 'confirmed';
                      return (
                        <div key={g.key} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950/40 border border-zinc-800/80 rounded-lg text-xs text-zinc-300 relative group/gate cursor-help transition-colors hover:border-zinc-700">
                          <span className={`text-[14px] ${isConfirmed ? 'text-[color:var(--theme-primary)]' : 'text-amber-500'}`}>●</span>
                          <span>{g.label}{!isConfirmed && ' !'}</span>

                          {item.note && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover/gate:opacity-100 transition duration-150 z-20 whitespace-normal leading-normal">
                              <div className="font-bold text-zinc-400 mb-0.5 font-mono uppercase tracking-wider">{g.label}</div>
                              {item.note}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notas de Correção Aplicada */}
                {p.exAnte.correctionApplied?.applied && p.exAnte.correctionApplied.note && (
                  <div className="bg-purple-950/10 border border-purple-500/20 p-3 rounded-lg text-xs text-purple-400/90 leading-relaxed font-mono">
                    <span className="font-bold">Correção -10/-15pp aplicada:</span> {p.exAnte.correctionApplied.note}
                  </div>
                )}

                {/* 3. Fatores-Chave e Riscos */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Fatores-Chave */}
                  <div className="bg-zinc-950/20 border border-zinc-800/60 p-4 rounded-xl">
                    <div className="text-[10px] font-bold text-zinc-500 font-mono tracking-wider mb-2.5 uppercase">
                      Fatores-Chave
                    </div>
                    <ul className="space-y-1.5">
                      {p.exAnte.keyFactors?.map((f: string, idx: number) => (
                        <li key={idx} className="text-xs text-zinc-300 leading-relaxed pl-3.5 relative before:content-['•'] before:absolute before:left-1 before:text-zinc-600 font-sans">
                          {f}
                        </li>
                      )) || <span className="text-xs text-zinc-500 font-mono">Nenhum mapeado</span>}
                    </ul>
                  </div>

                  {/* Riscos */}
                  <div className="bg-zinc-950/20 border border-zinc-800/60 p-4 rounded-xl">
                    <div className="text-[10px] font-bold text-zinc-500 font-mono tracking-wider mb-2.5 uppercase">
                      Riscos
                    </div>
                    <ul className="space-y-1.5">
                      {p.exAnte.risks?.map((r: string, idx: number) => (
                        <li key={idx} className="text-xs text-zinc-300 leading-relaxed pl-3.5 relative before:content-['•'] before:absolute before:left-1 before:text-zinc-600 font-sans">
                          {r}
                        </li>
                      )) || <span className="text-xs text-zinc-500 font-mono">Nenhum mapeado</span>}
                    </ul>
                  </div>
                </div>

                {/* 4. Aposta Sugerida */}
                {p.exAnte.suggestedBet && (
                  <div className="bg-[rgb(var(--theme-primary-rgb)_/_0.1)] border border-[rgb(var(--theme-primary-rgb)_/_0.2)] p-3 rounded-lg text-xs text-[color:var(--theme-primary)]/90 leading-relaxed">
                    <span className="font-bold">Aposta sugerida:</span> {p.exAnte.suggestedBet}
                  </div>
                )}

                {/* 5. Análise Ex-Post */}
                {isResolved && p.result && (
                  <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-[10px] font-bold text-zinc-500 font-mono tracking-wider uppercase">
                        Análise Ex-Post
                      </div>
                      {meta && (
                        <span className="text-[9px] text-zinc-500 font-mono">
                          {meta.label}
                        </span>
                      )}
                    </div>

                    {p.result.matchSummary && (
                      <p className="text-sm text-zinc-300 leading-relaxed italic font-sans">
                        {p.result.matchSummary}
                      </p>
                    )}

                    {p.exPost?.causalAnalysis && (
                      <div
                        onClick={() => setActiveDetailPred(p)}
                        title="Clique para abrir no Dashboard Visual"
                        className="bg-[rgb(var(--theme-primary-rgb)_/_0.1)] border border-[rgb(var(--theme-primary-rgb)_/_0.2)] p-3.5 rounded-lg text-[color:var(--theme-primary)]/90 text-xs leading-relaxed font-sans cursor-pointer hover:bg-[rgb(var(--theme-primary-rgb)_/_0.2)] hover:border-[rgb(var(--theme-primary-rgb)_/_0.45)] transition"
                      >
                        {p.exPost.causalAnalysis}
                      </div>
                    )}

                    <div className="text-[9px] text-zinc-600 font-mono flex justify-between pt-1">
                      <span>Criada em {new Date(p.createdAt).toLocaleDateString()}</span>
                      {p.exPost?.resolvedAt && (
                        <span>Resolvida em {new Date(p.exPost.resolvedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }, [expandedIds, toggleExpand, handleSaveToLearnings, renderStars, getOutcomeBadges, busy, fetchResult, removePred]);

  // Processar dados do gráfico
  const pending = useMemo(() => preds.filter(p => p.status === 'pending' || (!p.status && !p.exPost && !p.result)), [preds]);
  const resolved = useMemo(() => preds.filter(p => p.status === 'resolved' || (!p.status && (p.exPost || p.result))), [preds]);

  const chartData = useMemo(() => {
    const sorted = [...resolved].sort((a, b) => a.createdAt - b.createdAt);
    let hits = 0;
    return sorted.map((p, idx) => {
      const isHit = p.exPost?.hit === true || p.exPost?.classification === 'correct_read' || p.exPost?.classification === 'lucky_win';
      if (isHit) hits++;
      return {
        id: p.id,
        x: idx + 1,
        y: Math.round((hits / (idx + 1)) * 100)
      };
    });
  }, [resolved]);

  // Renderizador do gráfico SVG Customizado
  const renderChart = useCallback(() => {
    if (chartData.length === 0) return null;

    const width = 800;
    const height = 140;
    const paddingLeft = 40;
    const paddingRight = 40;
    const paddingTop = 20;
    const paddingBottom = 25;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const points = chartData.map((d, i) => {
      const x = paddingLeft + (chartData.length > 1 ? (i / (chartData.length - 1)) * chartWidth : chartWidth / 2);
      const y = paddingTop + chartHeight - (d.y / 100) * chartHeight;
      return { x, y, val: d.y, label: d.x };
    });

    let pathD = '';
    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    }
    const areaD = pathD ? `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z` : '';

    return (
      <div className="bg-white/5 border border-white/5 rounded-xl p-5 backdrop-blur-md mb-6">
        <h3 className="text-xs font-semibold text-zinc-400 mb-4 flex items-center gap-2 font-mono">
          <Activity className="w-4 h-4 text-[color:var(--theme-primary)]" /> Hit rate cumulativo
        </h3>
        <div className="relative w-full h-[140px] overflow-x-auto no-scrollbar">
          <div className="w-full min-w-[650px] h-full">
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--theme-primary)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--theme-primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid */}
            {[0, 25, 50, 75, 100].map(val => {
              const y = paddingTop + chartHeight - (val / 100) * chartHeight;
              return (
                <g key={val} className="opacity-20">
                  <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
                  <text x={paddingLeft - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-zinc-400 font-mono font-medium">{val}</text>
                </g>
              );
            })}

            {/* Linha/Área */}
            {pathD && (
              <>
                <path d={areaD} fill="url(#chart-grad)" />
                <path d={pathD} fill="none" stroke="var(--theme-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </>
            )}

            {/* Pontos */}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r="4" className="fill-[color:var(--theme-primary)] stroke-zinc-950 stroke-[2px]" />
                <text x={p.x} y={p.y - 8} textAnchor="middle" className="text-[9px] fill-[color:var(--theme-primary)] font-bold font-mono">{p.val}%</text>
                <text x={p.x} y={height - paddingBottom + 14} textAnchor="middle" className="text-[9px] fill-zinc-500 font-mono">{p.label}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}, [chartData]);

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-sans selection:bg-[rgb(var(--theme-primary-rgb)_/_0.3)]" style={{ '--accent': primaryColor, '--theme-primary': primaryColor, '--theme-primary-rgb': primaryRgb, '--theme-secondary': secondaryColor, '--theme-secondary-rgb': secondaryRgb } as React.CSSProperties}>
      <div className="max-w-5xl mx-auto relative">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8 p-4 md:p-6 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5 relative overflow-hidden gap-4">
          {/* Glass shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgb(var(--theme-primary-rgb)_/_0.2)] to-cyan-500/10 border border-[rgb(var(--theme-primary-rgb)_/_0.2)] flex items-center justify-center backdrop-blur-xl shadow-[0_0_20px_rgb(var(--theme-primary-rgb)_/_0.15)] group cursor-pointer">
              {/* Estilos para quique da esfera e rotação diagonal dos gomos (ilusão 3D Y-Z sem achatar) */}
              <style>{`
                @keyframes bounce-float-sphere {
                  0% {
                    transform: translate(0px, -4px) scale(1);
                  }
                  20% {
                    transform: translate(-6px, -6px) scale(0.92); /* quica no canto superior esquerdo */
                  }
                  40% {
                    transform: translate(6px, 2px) scale(1.05); /* flutua direita */
                  }
                  60% {
                    transform: translate(-4px, 6px) scale(0.92); /* quica embaixo */
                  }
                  80% {
                    transform: translate(5px, -5px) scale(0.96); /* quica no topo direito */
                  }
                  100% {
                    transform: translate(0px, -4px) scale(1);
                  }
                }
                @keyframes spin-panels-diagonal {
                  0% {
                    transform: translate(0px, 0px) rotate(0deg);
                  }
                  100% {
                    transform: translate(-32px, -32px) rotate(360deg);
                  }
                }
                @keyframes button-shimmer {
                  0% { transform: translateX(-150%); }
                  100% { transform: translateX(150%); }
                }
              `}</style>

              {/* Esfera física da bola de futebol (Tamanho maior w-10 h-10) */}
              <div 
                className="w-10 h-10 rounded-full border border-white/20 relative overflow-hidden bg-black/40 shadow-inner z-10"
                style={{
                  animation: 'bounce-float-sphere 8s infinite ease-in-out'
                }}
              >
                {/* Camada de gomos de futebol que desliza diagonalmente e rotaciona (ilusão 3D completa) */}
                <div 
                  className="absolute flex flex-wrap text-[color:var(--theme-primary)]"
                  style={{
                    width: '96px',
                    height: '96px',
                    top: '-28px',
                    left: '-28px',
                    animation: 'spin-panels-diagonal 7s linear infinite'
                  }}
                >
                  {Array.from({ length: 9 }).map((_, idx) => (
                    <svg key={idx} className="w-8 h-8 flex-shrink-0" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                      {/* Pentágonos escuros realistas */}
                      <polygon points="16,7 23,12 20,20 12,20 9,12" className="fill-current opacity-85" />
                      <polygon points="0,0 4,0 0,4" className="fill-current opacity-85" />
                      <polygon points="32,0 28,0 32,4" className="fill-current opacity-85" />
                      <polygon points="0,32 4,32 0,28" className="fill-current opacity-85" />
                      <polygon points="32,32 28,32 32,28" className="fill-current opacity-85" />

                      {/* Linhas de costura */}
                      <polygon points="16,7 23,12 20,20 12,20 9,12" />
                      <path d="
                        M 16 7 L 16 0
                        M 23 12 L 32 9
                        M 20 20 L 26 32
                        M 12 20 L 6 32
                        M 9 12 L 0 9
                        M 0 0 L 5 5
                        M 32 0 L 27 5
                        M 0 32 L 5 27
                        M 32 32 L 27 27
                      " />
                    </svg>
                  ))}
                </div>

                {/* Sombreado 3D por cima dos gomos (Radial gradient para volume esférico) */}
                <div className="absolute inset-0 rounded-full pointer-events-none bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.45)_0%,rgba(0,0,0,0)_50%,rgba(0,0,0,0.9)_100%)] z-20" />
              </div>

              {/* Ponto de Notificação Ativo */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[color:var(--theme-primary)] shadow-[0_0_8px_rgb(var(--theme-primary-rgb)_/_0.8)] animate-pulse z-20" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[color:var(--theme-primary)] mb-0.5">
                ./labs/oracle-trader
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-white leading-none">Oracle Trader</h1>
              <p className="text-xs text-white/40 font-mono mt-0.5 tracking-widest">COGNITIVE_PREDICTION_ENGINE</p>
            </div>
          </div>

          {/* Botões de Backup Global */}
          <div className="flex items-center gap-2 relative z-10">
            <ThemeSwitcher themeName={themeName} onToggle={toggleTheme} />
            <input
              ref={importGlobalRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleGlobalImport}
            />
            <button
              onClick={() => importGlobalRef.current?.click()}
              title="Importar backup completo (.json)"
              className="flex items-center gap-2 px-3 py-2 text-[11px] font-mono font-bold tracking-wider uppercase bg-white/5 hover:bg-[rgb(var(--theme-primary-rgb)_/_0.1)] border border-white/10 hover:border-[rgb(var(--theme-primary-rgb)_/_0.3)] rounded-xl text-white/50 hover:text-[color:var(--theme-primary)] transition-all duration-300"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={handleGlobalExport}
              title="Exportar backup completo (.json)"
              className="flex items-center gap-2 px-3 py-2 text-[11px] font-mono font-bold tracking-wider uppercase bg-[rgb(var(--theme-primary-rgb)_/_0.1)] hover:bg-[rgb(var(--theme-primary-rgb)_/_0.2)] border border-[rgb(var(--theme-primary-rgb)_/_0.3)] rounded-xl text-[color:var(--theme-primary)] hover:text-[color:var(--theme-primary)] transition-all duration-300 shadow-[0_0_10px_rgb(var(--theme-primary-rgb)_/_0.1)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </header>

        {/* Bloco de Controle Unificado (Abas, Modelo e Pipeline) — Labs Blueprint */}
        <style>{`
          @keyframes border-glow-pulse {
            0% { border-color: rgba(var(--theme-primary-rgb), 0.6); box-shadow: 0 0 0px rgba(var(--theme-primary-rgb), 0), 0 8px 32px rgba(0,0,0,0.5); }
            40% { border-color: rgba(var(--theme-primary-rgb), 0.9); box-shadow: 0 0 20px rgba(var(--theme-primary-rgb), 0.35), 0 8px 32px rgba(0,0,0,0.5); }
            100% { border-color: rgba(var(--theme-primary-rgb), 0.25); box-shadow: 0 0 0px rgba(var(--theme-primary-rgb), 0), 0 8px 32px rgba(0,0,0,0.5); }
          }
          .border-pulse-active {
            animation: border-glow-pulse 500ms ease-out forwards;
          }
        `}</style>
        <div 
          className={`flex flex-col mb-10 bg-black/50 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5 relative z-30 sticky transition-all duration-500 ease-in-out ${
            isSticky 
              ? 'top-4 rounded-2xl border-[rgb(var(--theme-primary-rgb)_/_0.25)] shadow-[0_12px_40px_rgba(0,0,0,0.7)]' 
              : 'p-4 md:p-6 gap-6 rounded-[2rem]'
          } ${
            isSticky && isMenuCollapsed ? 'p-2 sm:p-2.5 gap-0' : isSticky ? 'p-2.5 sm:p-3 md:p-4 gap-3' : ''
          } ${
            borderPulse ? 'border-pulse-active' : ''
          }`}
        >
          {/* Glass shine effect */}
          <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none transition-all duration-500 ${
            isSticky ? 'rounded-2xl' : 'rounded-[2rem]'
          }`} />

          {/* Pulse glow overlay — flash rápido na troca de estado */}
          <AnimatePresence>
            {borderPulse && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`absolute inset-0 pointer-events-none z-0 ${
                  isSticky ? 'rounded-2xl' : 'rounded-[2rem]'
                }`}
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(var(--theme-primary-rgb), 0.08) 0%, transparent 70%)',
                }}
              />
            )}
          </AnimatePresence>

          {/* === MODO RECOLHIDO (Sticky + Collapsed): barra mínima === */}
          <AnimatePresence mode="wait">
            {isSticky && isMenuCollapsed && (
              <motion.div
                key="collapsed-bar"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="flex items-center justify-between gap-3 relative z-30"
              >
              {/* Aba ativa resumida — clicável para ciclar */}
              <div className="flex items-center gap-2">
                {(() => {
                  const TAB_META = [
                    { id: 'today', icon: Calendar, label: 'HOJE', n: '01' },
                    { id: 'pending', icon: Activity, label: 'PENDENTES', n: '02' },
                    { id: 'ledger', icon: BarChart3, label: 'LEDGER', n: '03' },
                    { id: 'learnings', icon: GraduationCap, label: 'APRENDIZADO', n: '04' }
                  ];
                  const currentIndex = TAB_META.findIndex(t => t.id === tab);
                  const active = TAB_META[currentIndex >= 0 ? currentIndex : 0];
                  const ActiveIcon = active.icon;
                  const cycleTab = () => {
                    const nextIndex = (currentIndex + 1) % TAB_META.length;
                    setTab(TAB_META[nextIndex].id);
                    triggerBorderPulse();
                  };
                  return (
                    <button
                      onClick={cycleTab}
                      className="flex items-center gap-2 bg-[rgb(var(--theme-primary-rgb)_/_0.08)] hover:bg-[rgb(var(--theme-primary-rgb)_/_0.15)] border border-[rgb(var(--theme-primary-rgb)_/_0.2)] hover:border-[rgb(var(--theme-primary-rgb)_/_0.4)] rounded-xl px-3 py-1.5 transition-all duration-300 group/tab cursor-pointer"
                      title="Próxima aba"
                    >
                      <span className="text-[9px] font-mono font-black text-[color:var(--theme-primary)]">{active.n}</span>
                      <ActiveIcon className="w-3 h-3 text-[color:var(--theme-primary)]" />
                      <span className="text-[10px] font-mono font-bold tracking-[0.12em] uppercase text-white/80 hidden sm:inline">{active.label}</span>
                      <ChevronRight className="w-3 h-3 text-white/30 group-hover/tab:text-[color:var(--theme-primary)] transition-all duration-300 group-hover/tab:translate-x-0.5" />
                    </button>
                  );
                })()}

                {/* Separador */}
                <div className="w-[1px] h-5 bg-white/10 hidden sm:block" />

                {/* Modelo de IA resumido */}
                <div className="flex items-center gap-1.5">
                  <Brain className="w-3 h-3 text-[color:var(--theme-primary)]/50" />
                  <span className="text-[9px] font-mono font-bold tracking-wider text-white/40 uppercase">
                    {AI_MODELS.flatMap(g => g.models).find(m => m.value === aiEngine)?.label ?? 'N/A'}
                  </span>
                </div>
              </div>

              {/* Botão expandir */}
              <button
                onClick={() => { setIsMenuCollapsed(false); triggerBorderPulse(); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-[rgb(var(--theme-primary-rgb)_/_0.1)] border border-white/10 hover:border-[rgb(var(--theme-primary-rgb)_/_0.3)] rounded-xl text-white/40 hover:text-[color:var(--theme-primary)] transition-all duration-300 group"
                title="Expandir menu"
              >
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase hidden sm:inline">MENU</span>
              </button>
              </motion.div>
            )}

          {/* === MODO EXPANDIDO: conteúdo completo === */}
            {(!isSticky || !isMenuCollapsed) && (
              <motion.div
                key="expanded-panel"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col gap-3"
              >
              {/* Botão recolher (só aparece no sticky expandido) */}
              {isSticky && !isMenuCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.25 }}
                  className="flex justify-end relative z-30 -mb-1"
                >
                  <button
                    onClick={() => { setIsMenuCollapsed(true); triggerBorderPulse(); }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-[rgb(var(--theme-primary-rgb)_/_0.1)] border border-white/10 hover:border-[rgb(var(--theme-primary-rgb)_/_0.3)] rounded-lg text-white/40 hover:text-[color:var(--theme-primary)] transition-all duration-300 group"
                    title="Recolher menu"
                  >
                    <Minus className="w-3 h-3" />
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase">RECOLHER</span>
                    <ChevronUp className="w-3 h-3 transition-transform duration-300 group-hover:-translate-y-0.5" />
                  </button>
                </motion.div>
              )}

              {/* Top Row: Tabs e Seletor de Modelo */}
              <div className={`flex flex-col md:flex-row gap-3 md:gap-4 justify-between items-center relative z-30 transition-all duration-500`}>
                <nav className="flex gap-0.5 sm:gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 w-fit">
                  {[
                    { id: 'today', icon: Calendar, label: 'HOJE' },
                    { id: 'pending', icon: Activity, label: 'PENDENTES', badge: pending.length },
                    { id: 'ledger', icon: BarChart3, label: 'LEDGER', badge: resolved.length },
                    { id: 'learnings', icon: GraduationCap, label: 'APRENDIZADO', badge: learnings.length }
                  ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} className={`relative font-mono text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.15em] transition-all duration-300 rounded-xl flex items-center gap-1.5 sm:gap-2 ${
                      isSticky ? 'px-2 py-1.5' : 'px-2.5 py-2 sm:px-4 sm:py-2.5'
                    }`}>
                      {tab === t.id && (
                        <motion.div
                          layoutId="tab-indicator-oracle"
                          className="absolute inset-0 bg-[rgb(var(--theme-primary-rgb)_/_0.1)] border border-[rgb(var(--theme-primary-rgb)_/_0.2)] rounded-xl shadow-[0_0_15px_rgb(var(--theme-primary-rgb)_/_0.15)]"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      <span className={`relative z-10 flex items-center gap-1.5 sm:gap-2 transition-colors duration-300 ${tab === t.id ? 'text-[color:var(--theme-primary)]' : 'text-white/30 hover:text-white/60'
                        }`}>
                        <t.icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="hidden sm:inline">{t.label}</span>
                        {!!t.badge && (
                          <span className="bg-white/10 px-1.5 py-0.5 rounded-md text-[9px] font-mono tabular-nums">
                            {t.badge}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </nav>

                {/* AI Engine Selector — Custom Dropdown */}
                <div ref={modelDropdownRef} className="relative w-full md:w-auto z-40">
                  <button
                    onClick={() => setShowModelDropdown(v => !v)}
                    className={`relative z-10 flex items-center gap-3 bg-white/5 hover:bg-white/[0.08] rounded-2xl border border-white/10 hover:border-white/20 w-full md:w-auto transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] group ${
                      isSticky ? 'px-3 py-2' : 'px-4 py-3'
                    }`}
                  >
                    <Brain className="w-3.5 h-3.5 text-[color:var(--theme-primary)]/60 flex-shrink-0" />
                    <span className="text-[11px] font-mono font-bold tracking-[0.12em] text-white/70 uppercase flex-1 text-left">
                      {AI_MODELS.flatMap(g => g.models).find(m => m.value === aiEngine)?.label ?? 'Selecionar modelo'}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-white/30 transition-transform duration-300 ${showModelDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showModelDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-2 w-64 bg-[#0c0c0c]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
                      >
                        {/* Accent top line */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgb(var(--theme-primary-rgb)_/_0.4)] to-transparent" />

                        <div className="p-2">
                          {AI_MODELS.map(group => (
                            <div key={group.group} className="mb-1 last:mb-0">
                              <div className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase text-white/20 px-3 py-2">
                                {group.group}
                              </div>
                              {group.models.map(model => (
                                <button
                                  key={model.value}
                                  onClick={() => { setAiEngine(model.value); setShowModelDropdown(false); }}
                                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-200 group/item ${aiEngine === model.value
                                      ? 'bg-[rgb(var(--theme-primary-rgb)_/_0.1)] border border-[rgb(var(--theme-primary-rgb)_/_0.2)]'
                                      : 'hover:bg-white/5 border border-transparent'
                                    }`}
                                >
                                  <span className={`text-[11px] font-mono font-bold tracking-wider uppercase ${aiEngine === model.value ? 'text-[color:var(--theme-primary)]' : 'text-white/50 group-hover/item:text-white/80'
                                    }`}>
                                    {model.label}
                                  </span>
                                  {aiEngine === model.value && (
                                    <Check className="w-3 h-3 text-[color:var(--theme-primary)]" />
                                  )}
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Separator Line */}
              <div className="h-[1px] bg-white/10 w-full relative z-10" />

              {/* Bottom Row: Pipeline */}
              <div className="flex items-center justify-center gap-0 overflow-x-auto no-scrollbar py-1 md:py-2 relative z-10">
                {[
                  { n: '01', label: 'ANALISAR', targetTab: 'today' },
                  { n: '02', label: 'BUSCAR RESULTADO', targetTab: 'pending' },
                  { n: '03', label: 'APRENDIZADO', targetTab: 'ledger' },
                  { n: '04', label: 'PRÓXIMO CICLO', targetTab: 'learnings' },
                ].map((step, i, arr) => {
                  const isActive = tab === step.targetTab;
                  return (
                    <div key={step.n} className="flex items-center">
                      <motion.div
                        animate={{
                          backgroundColor: isActive ? 'rgba(var(--theme-primary-rgb), 0.12)' : 'rgba(255, 255, 255, 0.02)',
                          borderColor: isActive ? 'rgba(var(--theme-primary-rgb), 0.5)' : 'rgba(255, 255, 255, 0.05)',
                          scale: isActive ? (isSticky ? 1.02 : 1.05) : 1,
                          y: isActive ? -0.5 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-center gap-1.5 sm:gap-2 rounded-xl border backdrop-blur-md relative ${isActive ? 'shadow-[0_0_15px_rgb(var(--theme-primary-rgb)_/_0.25)]' : ''} ${
                          isSticky ? 'px-2 py-1' : 'px-2.5 py-1.5 sm:px-4 sm:py-2'
                        }`}
                      >
                        <span className={`relative z-10 text-[9px] sm:text-[10px] font-mono font-black transition-colors duration-500 ${isActive ? 'text-[color:var(--theme-primary)]' : 'text-[color:var(--theme-primary)]/40'}`}>{step.n}</span>
                        <span className={`relative z-10 text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/30'} ${isActive ? 'inline' : 'hidden sm:inline'}`}>{step.label}</span>
                      </motion.div>
                      {i < arr.length - 1 && (
                        <div className="w-4 sm:w-8 md:w-12 h-[2px] mx-1 md:mx-2 rounded-full overflow-hidden bg-white/5 relative">
                          {isActive && (
                            <motion.div
                              initial={{ x: '-100%' }}
                              animate={{ x: '100%' }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-[color:var(--theme-primary)] to-transparent opacity-80"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-sm text-red-400 backdrop-blur-md">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">{error}</div>
            <button onClick={() => setError(null)} className="hover:text-red-200 transition">×</button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {tab === 'today' && (
            <motion.div key="today" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <button 
                ref={searchBtnRef}
                onMouseMove={handleSearchBtnMouseMove}
                onClick={fetchTodayMatches} 
                disabled={busy.today} 
                className="group relative flex items-center gap-2 px-6 py-3.5 bg-black/60 hover:bg-black/40 text-white font-mono font-bold text-[11px] tracking-[0.15em] uppercase transition-all duration-300 disabled:opacity-50 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                style={{
                  border: '1px solid transparent',
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), radial-gradient(circle 100px at var(--mouse-x, 0px) var(--mouse-y, 0px), var(--theme-primary), var(--theme-secondary), transparent)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                  boxShadow: '0 0 15px rgba(var(--theme-primary-rgb), 0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
                } as React.CSSProperties}
              >
                {/* Estilo local para animação do reflexo */}
                <style>{`
                  @keyframes glass-shine-btn {
                    0% { transform: translateX(-150%) skewX(-25deg); }
                    30% { transform: translateX(150%) skewX(-25deg); }
                    100% { transform: translateX(150%) skewX(-25deg); }
                  }
                `}</style>
                
                {/* Reflexo Espelhado Periódico */}
                <span className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                  <span 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full"
                    style={{
                      animation: 'glass-shine-btn 7s infinite ease-in-out'
                    }}
                  />
                </span>

                <span className="relative z-10 flex items-center gap-2">
                  {busy.today ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[color:var(--theme-primary)]" />
                  ) : (
                    <span className="text-[13px] leading-none transition-transform duration-500 group-hover:animate-[spin_4s_linear_infinite] select-none">⚽</span>
                  )}
                  BUSCAR JOGOS DO DIA
                </span>
              </button>

              <div className="grid gap-4 md:grid-cols-2">
                {todayMatches.map((m, i) => (
                  <div key={i} className="group relative bg-black/50 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-500 overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_30px_rgb(var(--theme-primary-rgb)_/_0.15)]">
                    {/* Large Watermark Icon - Top Right */}
                    <div className="absolute -top-16 -right-16 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 pointer-events-none -rotate-12 group-hover:rotate-0">
                      <div className="w-72 h-72 text-[color:var(--theme-primary)]">
                        <Brain className="w-full h-full" />
                      </div>
                    </div>

                    {/* Glass Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                    </div>

                    {/* Technical Corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-2xl opacity-30 border-[color:var(--theme-primary)]"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-2xl opacity-30 border-[color:var(--theme-primary)]"></div>

                    <div className="relative z-10 space-y-5 text-left">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl inline-block text-[color:var(--theme-primary)]">
                          <Brain className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[color:var(--theme-primary)]">
                          {m.stage}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-white transition-all duration-500 leading-tight tracking-tighter inline-block group-hover:bg-[color:var(--theme-primary)] group-hover:text-black px-2 rounded-lg -ml-2">
                          {m.home} <span className="text-zinc-500 group-hover:text-black/60 font-light">×</span> {m.away}
                        </h3>
                        <p className="text-xs text-white/50 font-mono mt-2">
                          {m.kickoff}
                        </p>
                      </div>

                      <div className="pt-2">
                        <button onClick={() => generatePrediction(m)} disabled={busy[`gen:${m.home}-${m.away}`]} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[rgb(var(--theme-primary-rgb)_/_0.1)] hover:bg-[rgb(var(--theme-primary-rgb)_/_0.2)] border border-[rgb(var(--theme-primary-rgb)_/_0.3)] rounded-xl text-[color:var(--theme-primary)] text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 disabled:opacity-50 shadow-[0_0_10px_rgb(var(--theme-primary-rgb)_/_0.08)] hover:shadow-[0_0_20px_rgb(var(--theme-primary-rgb)_/_0.15)] backdrop-blur-xl">
                          {busy[`gen:${m.home}-${m.away}`] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} ANALISAR DATA GATE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'pending' && (
            <motion.div key="pending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              {pending.map(p => renderPredictionCard(p, false))}
              {pending.length === 0 && <div className="text-zinc-500 text-center py-12 font-sans">Nenhuma previsão pendente.</div>}
            </motion.div>
          )}

          {tab === 'ledger' && (
            <motion.div key="ledger" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              {renderChart()}

              {/* Botões de Ação do Histórico */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
                <div>
                  <div className="text-[9px] font-mono tracking-[0.2em] uppercase text-[color:var(--theme-primary)]/60 mb-0.5">./oracle/ledger</div>
                  <h3 className="text-sm font-black tracking-tighter text-white">Histórico <span className="text-white/30 font-normal">({resolved.length})</span></h3>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mb-1 w-full max-w-full">
                  <input type="file" ref={importPredsRef} accept=".json" onChange={e => handleImportJSON(e, 'oracle_predictions')} className="hidden" />
                  <button onClick={() => importPredsRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300 transition">
                    <Upload className="w-3.5 h-3.5 text-[color:var(--theme-primary)]" /> Importar
                  </button>
                  <button onClick={() => setShowPasteModal('oracle_predictions')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300 transition">
                    <Plus className="w-3.5 h-3.5 text-[color:var(--theme-primary)]" /> Colar JSON
                  </button>
                  <button onClick={() => downloadJSON(resolved, 'oracle_predictions.json')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300 transition">
                    <Download className="w-3.5 h-3.5 text-[color:var(--theme-primary)]" /> Baixar JSON
                  </button>
                  <button onClick={() => copyToClipboard(JSON.stringify(resolved, null, 2))} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300 transition">
                    <Copy className="w-3.5 h-3.5 text-[color:var(--theme-primary)]" /> Copiar JSON
                  </button>
                  <button onClick={() => setShowJsonModal(resolved)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300 transition">
                    <Eye className="w-3.5 h-3.5 text-[color:var(--theme-primary)]" /> Ver JSON
                  </button>
                  <button onClick={() => {
                    const blob = new Blob([getMarkdownSummary(resolved)], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'oracle_ledger.md';
                    a.click();
                    URL.revokeObjectURL(url);
                  }} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300 transition">
                    <FileText className="w-3.5 h-3.5 text-[color:var(--theme-primary)]" /> Baixar MD
                  </button>
                  <button onClick={() => copyToClipboard(getMarkdownSummary(resolved))} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300 transition">
                    <Copy className="w-3.5 h-3.5 text-[color:var(--theme-primary)]" /> Copiar MD
                  </button>
                </div>
              </div>


              {/* Lista do Ledger do App Real */}
              <div className="space-y-4">
                {resolved.map(p => renderPredictionCard(p, true))}
              </div>
              {resolved.length === 0 && <div className="text-zinc-500 text-center py-12 font-sans">Nenhuma previsão resolvida no ledger.</div>}
            </motion.div>
          )}

          {tab === 'learnings' && (
            <motion.div key="learnings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

              {/* Adicionar Aprendizado Manual */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Adicionar aprendizado manual..."
                  value={manualLearning}
                  onChange={e => setManualLearning(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddManualLearning()}
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[rgb(var(--theme-primary-rgb)_/_0.4)] focus:bg-white/[0.07] transition-all duration-300 backdrop-blur-xl font-sans"
                />
                <button onClick={handleAddManualLearning} className="px-5 py-3 bg-[color:var(--theme-primary)] hover:bg-[color:var(--theme-primary)] text-black font-mono font-black rounded-2xl text-[11px] tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 shadow-[0_0_20px_rgb(var(--theme-primary-rgb)_/_0.25)] hover:shadow-[0_0_30px_rgb(var(--theme-primary-rgb)_/_0.4)]">
                  <Plus className="w-4 h-4" /> ADD
                </button>
              </div>

              {/* Botões de Ação do Aprendizado */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 w-full max-w-full border-b border-white/5">
                <input type="file" ref={importLearningsRef} accept=".json" onChange={e => handleImportJSON(e, 'oracle_learnings')} className="hidden" />
                <button onClick={() => downloadJSON(learnings, 'oracle_learnings.json')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300 transition">
                  <Download className="w-3.5 h-3.5 text-[color:var(--theme-primary)]" /> Baixar JSON ({learnings.length})
                </button>
                <button onClick={() => copyToClipboard(JSON.stringify(learnings, null, 2))} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300 transition">
                  <Copy className="w-3.5 h-3.5 text-[color:var(--theme-primary)]" /> Copiar JSON
                </button>
                <button onClick={() => setShowJsonModal(learnings)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300 transition">
                  <Eye className="w-3.5 h-3.5 text-[color:var(--theme-primary)]" /> Ver JSON
                </button>
                <button onClick={() => importLearningsRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300 transition">
                  <Upload className="w-3.5 h-3.5 text-[color:var(--theme-primary)]" /> Importar JSON
                </button>
                <button onClick={() => setShowPasteModal('oracle_learnings')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300 transition">
                  <Plus className="w-3.5 h-3.5 text-[color:var(--theme-primary)]" /> Colar JSON
                </button>
              </div>

              {/* Lista de Aprendizados */}
              <div className="space-y-3">
                {learnings.map((l, index) => {
                  const srcMeta = CLASS_META[l.source?.classification] || CLASS_META.correct_read;
                  return (
                    <div key={l.id} className="group bg-white/[0.04] hover:bg-white/[0.07] border border-white/8 hover:border-white/15 rounded-2xl p-4 flex gap-4 items-start transition-all duration-300 backdrop-blur-xl relative shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
                      {/* Número de índice Labs */}
                      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-[color:var(--theme-primary)]/70 font-mono font-black flex-shrink-0 mt-0.5">
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      <div className="flex-1">
                        <p className="text-zinc-200 text-sm leading-relaxed">{l.text}</p>

                        {/* Rodapé do Aprendizado */}
                        <div className="flex items-center gap-2 mt-2.5 text-[10px] text-zinc-500 font-mono">
                          {l.source?.home && (
                            <>
                              <span>{l.source.home} {l.source.away ? `x ${l.source.away}` : ''}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>{l.source?.date}</span>
                          {l.source?.classification && (
                            <>
                              <span>•</span>
                              <span className={`${srcMeta.text} font-bold`}>{srcMeta.label}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Excluir aprendizado */}
                      <button onClick={() => removeLearning(l.id)} className="p-1.5 text-zinc-600 hover:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition absolute right-3 top-3">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                {learnings.length === 0 && <div className="text-zinc-500 text-center py-12">Nenhum aprendizado acumulado.</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL PARA COLAR JSON MANUALMENTE */}
        {showPasteModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-2xl w-full p-6 flex flex-col max-h-[85vh] shadow-2xl">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[color:var(--theme-primary)]" />
                  Colar e Inserir JSON ({showPasteModal === 'oracle_predictions' ? 'Ledger' : 'Aprendizado'})
                </h3>
                <button onClick={() => { setShowPasteModal(null); setPasteJsonText(''); }} className="text-zinc-400 hover:text-white text-lg font-bold">×</button>
              </div>

              <p className="text-xs text-zinc-400 mb-3 font-sans leading-relaxed">
                Cole o JSON com as informações no campo abaixo. O sistema irá autodetectar estruturas, normalizar os dados de forma resiliente e salvar diretamente no banco de dados.
              </p>

              <textarea
                value={pasteJsonText}
                onChange={e => setPasteJsonText(e.target.value)}
                placeholder={showPasteModal === 'oracle_predictions' ? '[\n  {\n    "match": {\n      "home": "Espanha",\n      "away": "Áustria",\n      ...\n    }\n  }\n]' : '[\n  {\n    "text": "Estatísticas agregadas..."\n  }\n]'}
                rows={12}
                className="w-full flex-1 bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-xs text-zinc-350 focus:outline-none focus:border-[rgb(var(--theme-primary-rgb)_/_0.4)] resize-none min-h-[300px]"
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => { setShowPasteModal(null); setPasteJsonText(''); }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-zinc-300 text-sm font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePasteJSONSubmit}
                  className="px-5 py-2 bg-[color:var(--theme-primary)] hover:bg-[color:var(--theme-primary)] rounded-lg text-zinc-950 font-bold text-sm transition"
                >
                  Processar e Inserir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DETALHE / DASHBOARD DO JOGO */}
        {activeDetailPred && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-start justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-3xl max-w-5xl w-full flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.8)] my-8 relative overflow-hidden">

              {/* Accent glow top */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgb(var(--theme-primary-rgb)_/_0.6)] to-transparent" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[rgb(var(--theme-primary-rgb)_/_0.05)] rounded-full blur-3xl pointer-events-none" />

              {/* Glass shine */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-0 h-full w-[60%] bg-gradient-to-br from-white/[0.02] to-transparent" />
              </div>

              <div className="p-6 md:p-8 overflow-y-auto max-h-[90vh]">

                {/* ── Cabeçalho do Modal ── */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/8 mb-6">
                  <div className="min-w-0 flex-1">
                    {/* Overtitle Labs */}
                    <div className="text-[9px] font-mono tracking-[0.25em] uppercase text-[color:var(--theme-primary)]/60 mb-2">
                      ./oracle/match_dashboard
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white leading-none mb-3 flex items-center gap-3 flex-wrap">
                      <span className="text-[color:var(--theme-primary)]">⚽</span>
                      {activeDetailPred.match.home}
                      <span className="text-white/20 font-light">×</span>
                      {activeDetailPred.match.away}
                    </h2>

                    {/* Badges row */}
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded-lg border font-mono font-bold tracking-wider uppercase ${activeDetailPred.track === 'bet' || activeDetailPred.exAnte?.track === 'bet' ? 'bg-[rgb(var(--theme-primary-rgb)_/_0.1)] border-[rgb(var(--theme-primary-rgb)_/_0.2)] text-[color:var(--theme-primary)]' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                        {activeDetailPred.track === 'bet' || activeDetailPred.exAnte?.track === 'bet' ? '$ Aposta Real' : '⚗ Calibração'}
                      </span>

                      {activeDetailPred.result && (
                        <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-black text-white font-mono tracking-widest">
                          {activeDetailPred.result.homeScore} — {activeDetailPred.result.awayScore}
                        </span>
                      )}

                      {activeDetailPred.exPost?.classification && (
                        <span className={`text-[10px] px-2.5 py-1 rounded-lg border font-mono font-bold uppercase ${CLASS_META[activeDetailPred.exPost.classification]?.bg || 'bg-white/5'
                          } ${CLASS_META[activeDetailPred.exPost.classification]?.border || 'border-white/10'
                          } ${CLASS_META[activeDetailPred.exPost.classification]?.text || 'text-white'
                          }`}>
                          {CLASS_META[activeDetailPred.exPost.classification]?.label}
                        </span>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 flex-wrap text-[10px] font-mono text-white/30 tracking-wider">
                      <span>{activeDetailPred.match.date}</span>
                      <span className="text-white/10">|</span>
                      <span>{activeDetailPred.match.stage || 'Fase Indefinida'}</span>
                      <span className="text-white/10">|</span>
                      <span>{activeDetailPred.match.venue || 'Local Neutro'}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 self-start">
                    <button
                      onClick={() => {
                        const summary = getCopyableMatchSummary(activeDetailPred);
                        navigator.clipboard.writeText(summary);
                        setCopiedId(activeDetailPred.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-[rgb(var(--theme-primary-rgb)_/_0.1)] hover:bg-[rgb(var(--theme-primary-rgb)_/_0.2)] border border-[rgb(var(--theme-primary-rgb)_/_0.2)] rounded-xl text-[10px] font-mono font-bold tracking-wider uppercase text-[color:var(--theme-primary)] transition-all duration-300"
                    >
                      {copiedId === activeDetailPred.id ? (
                        <><Check className="w-3.5 h-3.5" /><span>Copiado!</span></>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /><span className="hidden sm:inline">Copiar</span></>
                      )}
                    </button>
                    <button
                      onClick={() => { setActiveDetailPred(null); setCopiedId(null); }}
                      className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* ── Métricas rápidas (topo) ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'Probabilidade', value: `${activeDetailPred.exAnte?.probability ?? '—'}%`, accent: true },
                    { label: 'Confiança IA', value: renderStars(activeDetailPred.exAnte?.confidence), accent: false },
                    { label: 'Placar Proj.', value: activeDetailPred.exAnte?.scorePrediction ? `${activeDetailPred.exAnte.scorePrediction.home} × ${activeDetailPred.exAnte.scorePrediction.away}` : '—', accent: true },
                    { label: 'Over/Under', value: activeDetailPred.exAnte?.goalsInsight ? `${activeDetailPred.exAnte.goalsInsight.overUnderPick?.toUpperCase()} ${activeDetailPred.exAnte.goalsInsight.overUnderLine}` : '—', accent: false },
                  ].map((m, i) => (
                    <div key={i} className="bg-white/[0.04] border border-white/8 rounded-2xl p-4 backdrop-blur-md">
                      <div className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/30 mb-2">{m.label}</div>
                      <div className={`text-lg font-black tracking-tighter ${m.accent ? 'text-[color:var(--theme-primary)]' : 'text-white'}`}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* ── Grid Principal ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                  {/* Col 1-3: Análise narrativa */}
                  <div className="lg:col-span-3 space-y-4">

                    {/* Tese Ex-Ante */}
                    <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 backdrop-blur-md">
                      <div className="flex items-center gap-2 mb-4">
                        <Brain className="w-4 h-4 text-[color:var(--theme-primary)]" />
                        <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/40">Tese Causal — Ex-Ante</span>
                      </div>
                      <div className="space-y-2 text-sm text-white/70 leading-relaxed font-sans">
                        {activeDetailPred.exAnte?.rationale?.split('\n').map((para: string, idx: number) => (
                          para.trim() && <p key={idx}>{para}</p>
                        ))}
                      </div>
                    </div>

                    {/* Análise Ex-Post */}
                    {activeDetailPred.result && (
                      <div className="bg-[rgb(var(--theme-primary-rgb)_/_0.2)] border border-[rgb(var(--theme-primary-rgb)_/_0.15)] rounded-2xl p-5 backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-4">
                          <Activity className="w-4 h-4 text-[color:var(--theme-primary)]" />
                          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[color:var(--theme-primary)]/60">Análise Causal — Ex-Post</span>
                        </div>

                        {activeDetailPred.result.matchSummary && (
                          <p className="text-sm text-white/50 leading-relaxed italic font-sans mb-3 pb-3 border-b border-white/5">
                            {activeDetailPred.result.matchSummary}
                          </p>
                        )}

                        {activeDetailPred.exPost?.causalAnalysis && (
                          <div className="text-sm text-[color:var(--theme-primary)]/80 leading-relaxed font-sans space-y-2">
                            {activeDetailPred.exPost.causalAnalysis.split('\n').map((para: string, idx: number) => (
                              para.trim() && <p key={idx}>{para}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Fatores-Chave vs Riscos */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-4 backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-3.5 h-3.5 text-[color:var(--theme-primary)]" />
                          <span className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-white/30">Fatores-Chave</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-white/50 font-sans">
                          {activeDetailPred.exAnte?.keyFactors?.map((f: string, idx: number) => (
                            <li key={idx} className="leading-relaxed pl-3 relative before:content-['▸'] before:absolute before:left-0 before:text-[color:var(--theme-primary)]/60 before:text-[8px] before:top-0.5">
                              {f}
                            </li>
                          )) || <span className="text-white/20 font-mono text-[10px]">Nenhum mapeado</span>}
                        </ul>
                      </div>

                      <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-4 backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-white/30">Riscos</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-white/50 font-sans">
                          {activeDetailPred.exAnte?.risks?.map((r: string, idx: number) => (
                            <li key={idx} className="leading-relaxed pl-3 relative before:content-['▸'] before:absolute before:left-0 before:text-amber-500/60 before:text-[8px] before:top-0.5">
                              {r}
                            </li>
                          )) || <span className="text-white/20 font-mono text-[10px]">Nenhum mapeado</span>}
                        </ul>
                      </div>
                    </div>

                    {/* Aposta Sugerida */}
                    {activeDetailPred.exAnte?.suggestedBet && (
                      <div className="bg-[rgb(var(--theme-primary-rgb)_/_0.15)] border border-[rgb(var(--theme-primary-rgb)_/_0.2)] rounded-2xl p-4 backdrop-blur-md">
                        <span className="text-[9px] font-mono font-bold block mb-1.5 uppercase tracking-[0.2em] text-[color:var(--theme-primary)]/60">Aposta Recomendada</span>
                        <p className="text-sm text-[color:var(--theme-primary)]/80 font-sans">{activeDetailPred.exAnte.suggestedBet}</p>
                      </div>
                    )}

                    {activeDetailPred.exAnte?.correctionApplied?.applied && activeDetailPred.exAnte.correctionApplied.note && (
                      <div className="bg-purple-950/10 border border-purple-500/20 rounded-2xl p-4 backdrop-blur-md">
                        <span className="text-[9px] font-mono font-bold block mb-1.5 uppercase tracking-[0.2em] text-purple-500/60">Correção de Probabilidade</span>
                        <p className="text-xs text-purple-300/70 font-sans">{activeDetailPred.exAnte.correctionApplied.note}</p>
                      </div>
                    )}
                  </div>

                  {/* Col 4-5: Data Gates + Goals */}
                  <div className="lg:col-span-2 space-y-4">

                    <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 backdrop-blur-md">
                      <div className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase text-white/30 mb-4">
                        Checklist — Data Gates
                      </div>
                      <div className="space-y-2">
                        {GATE_ITEMS.map(g => {
                          const gateData = activeDetailPred.exAnte.dataGate || {};
                          const item = gateData[g.key] || {};
                          const isConfirmed = item.status === 'confirmed';
                          return (
                            <div key={g.key} className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-medium text-white/60 font-sans">{g.label}</span>
                                <span className={`text-[9px] px-2 py-0.5 rounded-lg font-mono font-bold uppercase tracking-wider ${isConfirmed
                                    ? 'bg-[rgb(var(--theme-primary-rgb)_/_0.1)] text-[color:var(--theme-primary)] border border-[rgb(var(--theme-primary-rgb)_/_0.2)]'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  }`}>
                                  {item.status || 'missing'}
                                </span>
                              </div>
                              {item.note && (
                                <p className="text-[10px] text-white/25 leading-normal font-sans">{item.note}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {activeDetailPred.exAnte?.goalsInsight && (
                      <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 backdrop-blur-md">
                        <div className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase text-white/30 mb-4">
                          Goals Insight
                        </div>
                        <div className="space-y-2 font-mono text-xs mb-4">
                          <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                            <span className="text-white/30">Pick O/U</span>
                            <span className="text-white font-bold">
                              {activeDetailPred.exAnte.goalsInsight.overUnderPick?.toUpperCase()} {activeDetailPred.exAnte.goalsInsight.overUnderLine}
                              <span className="text-white/30 font-normal ml-1">({activeDetailPred.exAnte.goalsInsight.overUnderProbability}%)</span>
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                            <span className="text-white/30">BTTS</span>
                            <span className="text-white font-bold">
                              {activeDetailPred.exAnte.goalsInsight.bttsPick ? 'Sim' : 'Não'}
                              <span className="text-white/30 font-normal ml-1">({activeDetailPred.exAnte.goalsInsight.bttsProbability}%)</span>
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                            <span className="text-white/30">Expected Goals</span>
                            <span className="text-[color:var(--theme-primary)] font-bold">{activeDetailPred.exAnte.goalsInsight.totalExpected ?? '—'}</span>
                          </div>
                        </div>

                        {/* Comparativo de Placares */}
                        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
                          <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                            <span className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-white/30 mb-1.5">Oracle</span>
                            <span className="text-sm font-black text-white">
                              {activeDetailPred.exAnte?.scorePrediction ? `${activeDetailPred.exAnte.scorePrediction.home} - ${activeDetailPred.exAnte.scorePrediction.away}` : '—'}
                            </span>
                          </div>
                          <div className="bg-[rgb(var(--theme-primary-rgb)_/_0.05)] border border-[rgb(var(--theme-primary-rgb)_/_0.1)] rounded-xl p-3 flex flex-col items-center justify-center text-center">
                            <span className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-[color:var(--theme-primary)]/50 mb-1.5">Usuário</span>
                            <span className="text-sm font-black text-[color:var(--theme-primary)]">
                              {activeDetailPred.userScorePrediction ? `${activeDetailPred.userScorePrediction.home} - ${activeDetailPred.userScorePrediction.away}` : '—'}
                            </span>
                          </div>
                          <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                            <span className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-white/30 mb-1.5">Resultado</span>
                            <span className="text-sm font-black text-white">
                              {activeDetailPred.result ? `${activeDetailPred.result.homeScore} - ${activeDetailPred.result.awayScore}` : '—'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Rodapé ── */}
                <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-white/8">
                  <button
                    onClick={() => { setActiveDetailPred(null); setCopiedId(null); }}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/50 hover:text-white text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-300"
                  >
                    Fechar
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* MODAL GLOBAL DE LEITURA DE JSON */}
        {showJsonModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-2xl w-full p-6 flex flex-col max-h-[80vh] shadow-2xl">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[color:var(--theme-primary)]" /> Visualizar JSON
                </h3>
                <button onClick={() => setShowJsonModal(null)} className="text-zinc-400 hover:text-white text-lg font-bold">×</button>
              </div>
              <div className="flex-1 overflow-auto bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-xs text-zinc-300">
                <pre>{JSON.stringify(showJsonModal, null, 2)}</pre>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => { copyToClipboard(JSON.stringify(showJsonModal, null, 2)); }} className="flex items-center gap-1.5 px-4 py-2 bg-[rgb(var(--theme-primary-rgb)_/_0.1)] hover:bg-[rgb(var(--theme-primary-rgb)_/_0.2)] border border-[rgb(var(--theme-primary-rgb)_/_0.2)] rounded-lg text-[color:var(--theme-primary)] text-sm font-semibold transition">
                  <Copy className="w-4 h-4" /> Copiar
                </button>
                <button onClick={() => setShowJsonModal(null)} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-zinc-300 text-sm font-semibold transition">
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE EDIÇÃO DE PREVISÃO */}
        {editingPred && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full p-6 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit className="w-4 h-4 text-[color:var(--theme-primary)]" /> Editar Previsão
                </h3>
                <button onClick={() => setEditingPred(null)} className="text-zinc-400 hover:text-white text-lg font-bold">×</button>
              </div>

              <div className="space-y-4 text-sm max-h-[60vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="col-span-2 text-[10px] font-mono tracking-[0.2em] uppercase text-white/30 border-b border-white/5 pb-1">Resultado Real</div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Casa ({editingPred.match.home})</label>
                    <input
                      type="number"
                      value={editingPred.result?.homeScore ?? ''}
                      onChange={e => setEditingPred({
                        ...editingPred,
                        result: { ...(editingPred.result || {}), homeScore: parseInt(e.target.value) || 0, found: true }
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[rgb(var(--theme-primary-rgb)_/_0.4)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Fora ({editingPred.match.away})</label>
                    <input
                      type="number"
                      value={editingPred.result?.awayScore ?? ''}
                      onChange={e => setEditingPred({
                        ...editingPred,
                        result: { ...(editingPred.result || {}), awayScore: parseInt(e.target.value) || 0, found: true }
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[rgb(var(--theme-primary-rgb)_/_0.4)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="col-span-2 text-[10px] font-mono tracking-[0.2em] uppercase text-[color:var(--theme-primary)]/50 border-b border-white/5 pb-1 mt-2">Seu Palpite (Usuário)</div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Casa ({editingPred.match.home})</label>
                    <input
                      type="number"
                      value={editingPred.userScorePrediction?.home ?? ''}
                      onChange={e => setEditingPred({
                        ...editingPred,
                        userScorePrediction: { ...(editingPred.userScorePrediction || {}), home: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[rgb(var(--theme-primary-rgb)_/_0.4)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Fora ({editingPred.match.away})</label>
                    <input
                      type="number"
                      value={editingPred.userScorePrediction?.away ?? ''}
                      onChange={e => setEditingPred({
                        ...editingPred,
                        userScorePrediction: { ...(editingPred.userScorePrediction || {}), away: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[rgb(var(--theme-primary-rgb)_/_0.4)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Classificação Causal</label>
                  <select
                    value={editingPred.exPost?.classification || 'correct_read'}
                    onChange={e => setEditingPred({
                      ...editingPred,
                      exPost: { ...(editingPred.exPost || {}), classification: e.target.value }
                    })}
                    className="w-full bg-zinc-850 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[rgb(var(--theme-primary-rgb)_/_0.4)] cursor-pointer"
                  >
                    {Object.entries(CLASS_META).map(([key, val]: any) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Análise Ex-Post</label>
                  <textarea
                    value={editingPred.exPost?.causalAnalysis || ''}
                    onChange={e => setEditingPred({
                      ...editingPred,
                      exPost: { ...(editingPred.exPost || {}), causalAnalysis: e.target.value }
                    })}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[rgb(var(--theme-primary-rgb)_/_0.4)]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="edit-learned"
                    checked={editingPred.learned || false}
                    onChange={e => setEditingPred({ ...editingPred, learned: e.target.checked })}
                    className="rounded bg-white/5 border-white/10 text-[color:var(--theme-primary)] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="edit-learned" className="text-xs text-zinc-300 cursor-pointer select-none">Marcar como Aprendido (sinal para a IA)</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setEditingPred(null)} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-zinc-300 text-sm font-semibold transition">
                  Cancelar
                </button>
                <button onClick={async () => {
                  await savePred(editingPred);
                  setEditingPred(null);
                }} className="px-4 py-2 bg-[color:var(--theme-primary)] hover:bg-[color:var(--theme-primary)] rounded-lg text-zinc-950 font-bold text-sm transition">
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
