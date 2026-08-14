"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { X, Send, Sparkles, RotateCcw, ClipboardCheck } from "lucide-react"
import type { UIMessage } from "ai"
import AssistantEligibilityWizard from "@/components/assistant-eligibility-wizard"

const SUGGESTIONS = [
  "What does it cost?",
  "What evidence do I need?",
  "How do I get my ECS Gold Card?",
]

// Phrases that indicate the visitor is asking about eligibility, so we can offer
// the interactive eligibility check alongside the assistant's text answer.
const ELIGIBILITY_INTENT =
  /\b(eligib|qualif(y|ies|ied|ication)|am i (able|suitable|eligible)|do i qualify|can i (do|apply|join)|right route|suitable for)\b/i

// Keys used to persist the conversation across page navigations. sessionStorage
// keeps the chat alive while the visitor browses the site in the same tab, but
// clears automatically when they close the tab so old conversations don't linger.
const MESSAGES_KEY = "ewa-assistant-messages"
const OPEN_KEY = "ewa-assistant-open"
const NUDGE_KEY = "ewa-assistant-nudge"

function loadPersistedMessages(): UIMessage[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.sessionStorage.getItem(MESSAGES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : []
  } catch {
    return []
  }
}

function loadPersistedOpen(): boolean {
  if (typeof window === "undefined") return false
  return window.sessionStorage.getItem(OPEN_KEY) === "true"
}

// Render a plain-text assistant string, turning [label](url) markdown links into
// real links. Kept dependency-free and safe: only internal paths and http(s).
function renderWithLinks(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    const [, label, href] = match
    const safe = href.startsWith("/") || href.startsWith("http://") || href.startsWith("https://")
    if (safe) {
      nodes.push(
        <a
          key={`lnk-${key++}`}
          href={href}
          className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900"
        >
          {label}
        </a>,
      )
    } else {
      nodes.push(label)
    }
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

function messageText(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("")
}

export default function SiteAssistant() {
  const pathname = usePathname()
  const [open, setOpen] = useState(loadPersistedOpen)
  const [input, setInput] = useState("")
  const [wizardActive, setWizardActive] = useState(false)
  const [offerCheck, setOfferCheck] = useState(false)
  const [showNudge, setShowNudge] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, setMessages, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/assistant" }),
    messages: loadPersistedMessages(),
  })

  const busy = status === "submitted" || status === "streaming"

  // Persist the conversation so it survives navigating between pages.
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      window.sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
    } catch {
      /* storage full or unavailable — non-critical */
    }
  }, [messages])

  // Remember whether the panel was open so it stays open across navigation.
  useEffect(() => {
    if (typeof window === "undefined") return
    window.sessionStorage.setItem(OPEN_KEY, String(open))
  }, [open])

  // Auto-scroll to the newest message.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open, busy])

  // Show a friendly one-time nudge shortly after load to draw attention to the
  // assistant — but only if it hasn't been opened yet and wasn't dismissed this
  // session (sessionStorage keeps it from re-nagging on every page).
  useEffect(() => {
    if (typeof window === "undefined") return
    if (open || window.sessionStorage.getItem(NUDGE_KEY) === "dismissed") return
    const t = window.setTimeout(() => setShowNudge(true), 2500)
    return () => window.clearTimeout(t)
  }, [open])

  const dismissNudge = () => {
    setShowNudge(false)
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(NUDGE_KEY, "dismissed")
    }
  }

  // Clear the conversation and its persisted copy.
  const clearConversation = () => {
    setMessages([])
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(MESSAGES_KEY)
    }
  }

  // Never show the assistant inside the admin area.
  if (pathname?.startsWith("/admin")) return null

  const submit = (text: string) => {
    const value = text.trim()
    if (!value || busy) return
    // If the visitor is asking about eligibility, offer the interactive check
    // alongside the assistant's normal text answer.
    if (ELIGIBILITY_INTENT.test(value)) setOfferCheck(true)
    sendMessage({ text: value })
    setInput("")
  }

  const startWizard = () => {
    setOfferCheck(false)
    setWizardActive(true)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit(input)
  }

  return (
    <>
      {/* Launcher */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {/* Attention nudge tooltip */}
        {!open && showNudge && (
          <div className="animate-in fade-in slide-in-from-bottom-2 relative max-w-[16rem] rounded-2xl rounded-br-sm border border-blue-100 bg-white px-4 py-3 shadow-xl">
            <button
              type="button"
              onClick={dismissNudge}
              aria-label="Dismiss"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-600 shadow transition-colors hover:bg-gray-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <p className="text-sm font-semibold text-gray-900">Not sure if you qualify?</p>
            <p className="mt-0.5 text-xs leading-relaxed text-gray-600">
              Ask our AI assistant or run a free 2-minute eligibility check.
            </p>
            <button
              type="button"
              onClick={() => {
                dismissNudge()
                setOpen(true)
              }}
              className="mt-2 text-xs font-semibold text-blue-700 hover:text-blue-900"
            >
              Start now →
            </button>
          </div>
        )}

        {open ? (
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close assistant"
            aria-expanded={open}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg shadow-blue-900/25 transition-transform hover:scale-105 hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
          >
            <X className="h-6 w-6" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              dismissNudge()
              setOpen(true)
            }}
            aria-label="Open EWA assistant"
            aria-expanded={open}
            className="group relative flex items-center gap-2.5 rounded-full bg-blue-700 py-3 pl-4 pr-5 text-white shadow-xl shadow-blue-900/30 transition-all hover:scale-105 hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
          >
            {/* Pulsing attention ring */}
            <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-20" />
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-4 w-4" />
              {/* Live status dot */}
              <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-blue-700" />
              </span>
            </span>
            <span className="relative text-sm font-semibold">Ask AI</span>
          </button>
        )}
      </div>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="EWA Assistant"
          className="fixed bottom-24 right-5 z-50 flex h-[min(70vh,560px)] w-[min(92vw,384px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-blue-700 px-4 py-3 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">EWA Assistant</p>
              <p className="truncate text-xs text-blue-100">Eligibility, evidence, pricing & more</p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearConversation}
                aria-label="Start a new conversation"
                title="Start a new conversation"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-blue-100 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>

          {wizardActive ? (
            <AssistantEligibilityWizard onExit={() => setWizardActive(false)} />
          ) : (
          <>
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-gray-600">
                  Hi! I can help with EWA eligibility, the skills scan, evidence and course
                  requirements, your roadmap to the ECS Gold Card, and pricing. What would you like to
                  know?
                </p>
                <button
                  type="button"
                  onClick={startWizard}
                  className="flex w-full items-center gap-2 rounded-xl border border-blue-600 bg-blue-700 px-3.5 py-2.5 text-left text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                >
                  <ClipboardCheck className="h-4 w-4 shrink-0" />
                  Check my eligibility (2 minutes)
                </button>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const isUser = m.role === "user"
              return (
                <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      isUser
                        ? "rounded-br-sm bg-blue-700 text-white"
                        : "rounded-bl-sm border border-gray-200 bg-white text-gray-800"
                    }`}
                  >
                    {isUser ? messageText(m.parts) : renderWithLinks(messageText(m.parts))}
                  </div>
                </div>
              )
            })}

            {offerCheck && !busy && (
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={startWizard}
                  className="flex items-center gap-2 rounded-xl border border-blue-600 bg-blue-50 px-3.5 py-2.5 text-left text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-100"
                >
                  <ClipboardCheck className="h-4 w-4 shrink-0" />
                  Run the 2-minute eligibility check
                </button>
              </div>
            )}

            {status === "submitted" && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-3.5 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                </div>
              </div>
            )}

            {error && (
              <p className="text-center text-xs text-red-600">
                Something went wrong. Please try again or{" "}
                <a href="/book-a-call" className="underline">
                  book a call
                </a>
                .
              </p>
            )}
          </div>

          {/* Input */}
          <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-gray-200 bg-white p-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                  e.preventDefault()
                  submit(input)
                }
              }}
              rows={1}
              placeholder="Ask about the EWA route…"
              aria-label="Message"
              className="max-h-28 flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <p className="bg-white px-3 pb-2 text-center text-[10px] leading-tight text-gray-400">
            Guidance only — eligibility & pricing are confirmed on a free consultation call.
          </p>
          </>
          )}
        </div>
      )}
    </>
  )
}
