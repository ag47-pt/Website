'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { Utensils } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const MODELS = [
  { label: 'Restag AI Flash', value: 'gemini-2.5-flash' },
  { label: 'Restag AI Pro', value: 'gemini-2.5-pro' },
]

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'assistant',
  content: 'Olá! Sou o seu **Maître Digital** da RESTAG. 🍷 Como posso ajudar o seu restaurante hoje? Ou está à procura de uma mesa incrível para jantar? 🍽️',
  timestamp: new Date(),
}

// Basic markdown renderer
function renderMarkdown(text: string, primaryColor: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:${primaryColor};font-weight:700">$1</strong>`)
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
}

// Suggestion parser (cloned from original)
const SUGGESTION_PREFIX = /^(\*{0,2}\s*(?:\d+[.)]\s*|[-•*]\s+|✅\s*|🚀\s*|⚡\s*|📈\s*|🔥\s*|🎯\s*|💡\s*|👉\s*|➡️\s*|☑️\s*|▶️\s*|🔹\s*|🔸\s*|👇\s*)\*{0,2})/u

function cleanSuggestion(line: string): string {
  return line
    .replace(SUGGESTION_PREFIX, '')
    .replace(/^\*+|\*+$/g, '')
    .replace(/^["']|["']$/g, '')
    .trim()
}

function parseSuggestions(text: string): { body: string; suggestions: string[] } {
  const lines = text.split('\n')
  const suggestions: string[] = []
  let endIdx = lines.length

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim()
    if (line === '') continue
    if (SUGGESTION_PREFIX.test(line) && line.length <= 140) {
      const clean = cleanSuggestion(line)
      if (clean.length > 1) suggestions.unshift(clean)
      endIdx = i
    } else {
      break
    }
  }

  if (suggestions.length < 2 || suggestions.length > 6) {
    return { body: text, suggestions: [] }
  }

  const body = lines.slice(0, endIdx).join('\n').trimEnd()
  return { body, suggestions }
}

export function RestagChatbox() {
  const { theme } = useTheme()
  const primary = theme.colors.primary
  const secondary = theme.colors.secondary
  const hex6 = (c: string) => (c.length === 9 ? c.slice(0, 7) : c)
  
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState(MODELS[0].value)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }
  }, [isOpen, messages])

  const sendMessage = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim()
    if (!text || isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!overrideText) setInput('')
    setIsLoading(true)

    try {
      const history = messages.slice(1).map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/restag/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history, model }),
      })

      const data = await res.json()

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.ok
          ? (data.response || 'Recebi o seu pedido!')
          : (data.error || 'Ocorreu um erro no servidor. Tente novamente.'),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sem ligação ao Nexus Restag. Verifique a sua conexão.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages, model])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-24 right-5 sm:bottom-28 sm:right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: primary,
          boxShadow: `0 0 24px ${hex6(primary)}66`,
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="text-white text-xl font-bold">
              ✕
            </motion.span>
          ) : (
            <Utensils className="text-white w-6 h-6" />
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed z-50 flex flex-col overflow-hidden bottom-0 right-0 rounded-t-2xl sm:bottom-44 sm:right-8 sm:rounded-2xl sm:w-96"
            style={{
              background: theme.colors.glass.bg,
              backdropFilter: theme.colors.glass.blur,
              border: `1px solid ${theme.colors.glass.border}`,
              boxShadow: `0 0 40px ${hex6(secondary)}33`,
              height: 'min(520px, calc(100dvh - 5rem))',
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-3 shrink-0" style={{ background: `linear-gradient(135deg, ${hex6(secondary)}26, ${hex6(primary)}26)`, borderBottom: `1px solid ${theme.colors.glass.border}` }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black text-white shrink-0 border border-white/10">
                <Utensils className="w-4 h-4" style={{ color: primary }} />
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">Restag Maître</p>
                <p className="text-xs text-white/50">Assistente Gastronómico</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime-500 shadow-[0_0_6px_#84cc16]" />
                <button onClick={() => setIsOpen(false)} className="sm:hidden w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white/70 text-sm font-bold">✕</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-none">
              {messages.map((msg) => {
                const { body, suggestions } = msg.role === 'assistant' ? parseSuggestions(msg.content) : { body: msg.content, suggestions: [] }
                return (
                  <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className="max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
                      style={msg.role === 'user' 
                        ? { background: `linear-gradient(135deg, ${secondary}, ${primary})`, color: 'white', borderBottomRightRadius: '4px' } 
                        : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.9)', border: `1px solid ${theme.colors.glass.border}`, borderBottomLeftRadius: '4px' }
                      }
                      dangerouslySetInnerHTML={msg.role === 'assistant' ? { __html: renderMarkdown(body, hex6(primary)) } : undefined}
                    >
                      {msg.role === 'user' ? msg.content : null}
                    </div>

                    {suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 max-w-[90%]">
                        {suggestions.map((s) => (
                          <motion.button
                            key={s}
                            onClick={() => sendMessage(s)}
                            disabled={isLoading}
                            whileHover={{ scale: 1.03 }}
                            className="text-[10px] px-3 py-1.5 rounded-full border transition-colors disabled:opacity-40 font-mono uppercase tracking-widest"
                            style={{ borderColor: `${hex6(primary)}40`, color: hex6(primary), background: `${hex6(primary)}10` }}
                          >
                            {s}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-2.5 flex items-center gap-1.5 bg-white/5 border border-white/10">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: primary }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 shrink-0" style={{ borderTop: `1px solid ${theme.colors.glass.border}` }}>
              <div className="flex items-end gap-2 rounded-xl px-3 py-2 bg-white/5 border border-white/10">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Peça informações ou faça uma reserva..."
                  rows={1}
                  className="flex-1 bg-transparent text-white text-sm placeholder-white/20 resize-none outline-none py-1"
                  style={{ maxHeight: '80px' }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 disabled:opacity-30 transition-all active:scale-90"
                  style={{ background: primary }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
