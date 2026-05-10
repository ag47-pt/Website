'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const MODELS = [
  { label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
  { label: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
  { label: 'Gemini 3 Flash', value: 'gemini-3-flash' },
  { label: 'Gemini 3.1 Pro', value: 'gemini-3.1-pro-preview' },
]

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'assistant',
  content: '👋 Tudo bem! Não quero ocupar seu tempo.  💆🏻‍♂️ Então, em que posso ser útil ?!',
  timestamp: new Date(),
}

// Converte markdown básico para HTML (seguro: escapa HTML antes de aplicar regras)
function renderMarkdown(text: string, primaryColor: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:${primaryColor};font-weight:700">$1</strong>`)
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
}

// Detecta linhas de opção no final da mensagem e separa-as como sugestões clicáveis
const SUGGESTION_PREFIX = /^(\*{0,2}\s*(?:\d+[.)]\s*|[-•*]\s+|✅\s*|🚀\s*|⚡\s*|📈\s*|🔥\s*|🎯\s*|💡\s*|👉\s*|➡️\s*|☑️\s*|▶️\s*|🔹\s*|🔸\s*|👇\s*)\*{0,2})/u

function cleanSuggestion(line: string): string {
  return line
    .replace(SUGGESTION_PREFIX, '')
    .replace(/^\*+|\*+$/g, '')  // remove bold markers residuais
    .replace(/^["']|["']$/g, '') // remove aspas
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

export function SupportChatbox() {
  const { theme } = useTheme()
  const primary = theme.colors.primary
  const secondary = theme.colors.secondary
  // strip alpha channel from 8-char hex (#rrggbbaa → #rrggbb)
  const hex6 = (c: string) => (c.length === 9 ? c.slice(0, 7) : c)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState(MODELS[0].value)
  const [showModelPicker, setShowModelPicker] = useState(false)
  const [isBlackHoleSucked, setIsBlackHoleSucked] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const handleSuck = () => setIsBlackHoleSucked(true)
    window.addEventListener('ag47-black-hole-suck', handleSuck)
    return () => window.removeEventListener('ag47-black-hole-suck', handleSuck)
  }, [])

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
      // Histórico = todas as mensagens excepto a inicial (fake) e a que acabámos de enviar
      const history = messages.slice(1).map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history, model }),
      })

      const data = await res.json()

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.ok
          ? (data.response || 'Recebi a tua mensagem!')
          : (data.error || 'Ocorreu um erro. Tenta novamente.'),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sem ligação. Verifica a tua conexão e tenta novamente.',
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
      {/* Botão flutuante */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: primary,
          boxShadow: `0 0 24px ${hex6(primary)}66`,
        }}
        animate={isBlackHoleSucked ? { 
          scale: 0, 
          opacity: 0, 
          x: 400, // Move towards the center from the left
          y: -400, // Move upwards towards the center
          filter: 'blur(20px)',
          rotate: 45
        } : { y: [0, -6, 0] }}
        transition={isBlackHoleSucked ? { duration: 2.5, ease: "easeInOut" } : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={isBlackHoleSucked ? {} : { scale: 1.12 }}
        whileTap={isBlackHoleSucked ? {} : { scale: 0.95 }}
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat de suporte'}
        disabled={isBlackHoleSucked}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-white text-xl font-bold leading-none"
            >
              ✕
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-white text-2xl leading-none"
            >
              💬
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Janela do chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={isBlackHoleSucked ? {
              scale: 0,
              opacity: 0,
              filter: 'blur(40px)',
              x: 300,
              y: -500,
              rotate: -20
            } : { opacity: 1, y: 0, scale: 1 }}
            exit={isBlackHoleSucked ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: isBlackHoleSucked ? 3 : theme.animations.duration * 0.25, ease: 'easeOut' }}
            className="fixed z-50 flex flex-col overflow-hidden
              bottom-0 left-0 right-0 rounded-t-2xl rounded-b-none
              sm:bottom-24 sm:left-6 sm:right-auto sm:rounded-2xl sm:w-96"
            style={{
              background: theme.colors.glass.bg,
              backdropFilter: theme.colors.glass.blur,
              border: `1px solid ${theme.colors.glass.border}`,
              boxShadow: `0 0 40px ${hex6(secondary)}33`,
              height: 'min(520px, calc(100dvh - 5rem))',
              maxHeight: 'calc(100dvh - 5rem)',
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center gap-3 shrink-0"
              style={{
                background: `linear-gradient(135deg, ${hex6(secondary)}26, ${hex6(primary)}26)`,
                borderBottom: `1px solid ${theme.colors.glass.border}`,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: `linear-gradient(135deg, ${secondary}, ${primary})` }}
              >
                47
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">Agente 47</p>
                <p className="text-xs text-white/50">Assistente I.A</p>
              </div>
              <div className="ml-auto flex items-center gap-2 relative">
                {/* Botão de fechar — visível apenas em mobile */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="sm:hidden w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Fechar chat"
                >
                  <span className="text-white/70 text-sm leading-none font-bold">✕</span>
                </button>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }}
                />
                <button
                  onClick={() => setShowModelPicker((v) => !v)}
                  className="text-xs px-2 py-0.5 rounded-md flex items-center gap-1 bg-white/5 border border-white/10 text-white/60 hover:text-white/90 hover:bg-white/10 transition-colors"
                  title="Mudar modelo"
                >
                  {MODELS.find((m) => m.value === model)?.label.replace('Gemini ', '')}
                  <span style={{ fontSize: '8px' }}>▼</span>
                </button>
                <AnimatePresence>
                  {showModelPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full right-0 mt-1 rounded-xl overflow-hidden z-10 min-w-max"
                      style={{
                        background: 'rgba(0,0,0,0.92)',
                        backdropFilter: theme.colors.glass.blur,
                        border: `1px solid ${theme.colors.glass.border}`,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                      }}
                    >
                      {MODELS.map((m) => (
                        <button
                          key={m.value}
                          onClick={() => { setModel(m.value); setShowModelPicker(false) }}
                          className="block w-full text-left px-4 py-2 text-xs transition-colors"
                          style={{
                            color: m.value === model ? primary : 'rgba(255,255,255,0.7)',
                            background: m.value === model ? `${hex6(primary)}1A` : 'transparent',
                          }}
                        >
                          {m.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              {messages.map((msg) => {
                const { body, suggestions } = msg.role === 'assistant'
                  ? parseSuggestions(msg.content)
                  : { body: msg.content, suggestions: [] }
                return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className="max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
                    style={
                      msg.role === 'user'
                        ? {
                            background: `linear-gradient(135deg, ${secondary}, ${primary})`,
                            color: 'white',
                            borderBottomRightRadius: '4px',
                            whiteSpace: 'pre-wrap',
                          }
                        : {
                            background: 'rgba(255,255,255,0.06)',
                            color: 'rgba(255,255,255,0.9)',
                            border: `1px solid ${theme.colors.glass.border}`,
                            borderBottomLeftRadius: '4px',
                          }
                    }
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={
                      msg.role === 'assistant'
                        ? { __html: renderMarkdown(body, hex6(primary)) }
                        : undefined
                    }
                  >
                    {msg.role === 'user' ? msg.content : null}
                  </div>

                  {/* Botões de sugestão */}
                  {suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 max-w-[90%]">
                      {suggestions.map((s) => (
                        <motion.button
                          key={s}
                          onClick={() => sendMessage(s)}
                          disabled={isLoading}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="text-xs px-3 py-1.5 rounded-full border transition-colors disabled:opacity-40"
                          style={{
                            borderColor: `${hex6(primary)}66`,
                            color: hex6(primary),
                            background: `${hex6(primary)}12`,
                          }}
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
                  <div
                    className="rounded-2xl px-4 py-2.5 flex items-center gap-1.5"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: `1px solid ${theme.colors.glass.border}`,
                      borderBottomLeftRadius: '4px',
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: primary }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="px-3 py-3 shrink-0"
              style={{ borderTop: `1px solid ${theme.colors.glass.border}` }}
            >
              <div className="flex items-end gap-2 rounded-xl px-3 py-2 bg-white/5 border border-white/10">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escreve a tua mensagem..."
                  rows={1}
                  maxLength={2000}
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-white text-sm placeholder-white/30 resize-none outline-none leading-relaxed"
                  style={{ maxHeight: '80px' }}
                />
                <motion.button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 disabled:opacity-30 transition-opacity"
                  style={{ background: primary }}
                  aria-label="Enviar mensagem"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </motion.button>
              </div>
              <p className="text-center text-xs mt-1.5 text-white/25">
                Enter para enviar · Shift+Enter para nova linha
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
