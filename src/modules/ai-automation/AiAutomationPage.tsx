import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Database,
  Eraser,
  Loader2,
  Send,
  Sparkles,
  User,
  Wand2,
} from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { STORAGE_KEYS } from '@/constants/app'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  AI_PROMPT_TEMPLATES,
  createMessage,
  emptyAiContext,
  generateAiReply,
  type AiContextData,
  type AiMessage,
} from '@/services/aiAutomation'
import { readStorage, writeStorage } from '@/utils/storage'
import { cn } from '@/utils/cn'

const WELCOME_EN =
  'Hello — I am your construction AI assistant. Add project data on the right, then ask me to draft reports, safety checklists, schedules, budgets, or client updates.'

const WELCOME_SO =
  'Salaan — waxaan ahay kaaliyahaaga AI ee dhismaha. Geli xogta mashruuca dhanka midig, ka dibna i weydii inaan kuu diyaariyo warbixino, liiska amniga, jadwal, miisaaniyad, ama fariimaha macmiilka.'

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

function renderMarkdownLite(text: string) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('### ')) {
      return (
        <p key={i} className="mt-3 font-display text-sm font-semibold text-foreground first:mt-0">
          {line.replace(/^###\s/, '')}
        </p>
      )
    }
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return (
        <p key={i} className="ms-1 text-sm leading-relaxed text-foreground/90">
          {line}
        </p>
      )
    }
    const withBold = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={j} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return <span key={j}>{part}</span>
    })
    return (
      <p key={i} className={cn('text-sm leading-relaxed', line.trim() === '' && 'h-2')}>
        {withBold}
      </p>
    )
  })
}

export function AiAutomationPage() {
  const { locale, t } = useLanguage()
  const so = locale === 'so'
  const bottomRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState<AiContextData>(() =>
    readStorage(STORAGE_KEYS.aiContext, emptyAiContext())
  )
  const [messages, setMessages] = useState<AiMessage[]>(() => {
    const saved = readStorage<AiMessage[]>(STORAGE_KEYS.aiChat, [])
    if (saved.length) return saved
    return [createMessage('assistant', so ? WELCOME_SO : WELCOME_EN)]
  })

  useEffect(() => {
    writeStorage(STORAGE_KEYS.aiChat, messages)
  }, [messages])

  useEffect(() => {
    writeStorage(STORAGE_KEYS.aiContext, context)
  }, [context])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const contextFilled = useMemo(
    () => Object.values(context).some((v) => v.trim().length > 0),
    [context]
  )

  function updateContext<K extends keyof AiContextData>(key: K, value: AiContextData[K]) {
    setContext((prev) => ({ ...prev, [key]: value }))
  }

  async function sendMessage(raw: string) {
    const text = raw.trim()
    if (!text || loading) return

    const userMsg = createMessage('user', text)
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const reply = await generateAiReply({
        message: text,
        context,
        locale,
      })
      setMessages((prev) => [...prev, createMessage('assistant', reply)])
    } catch {
      toast.error(so ? 'Khalad ayaa dhacay. Isku day mar kale.' : 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function clearChat() {
    setMessages([createMessage('assistant', so ? WELCOME_SO : WELCOME_EN)])
    toast.success(so ? 'Wadahadalka waa la nadiifiyay' : 'Conversation cleared')
  }

  function clearContext() {
    setContext(emptyAiContext())
    toast.success(so ? 'Xogta waa la tirtiray' : 'Context cleared')
  }

  const fields: { key: keyof AiContextData; label: string; placeholder: string; multiline?: boolean }[] =
    [
      {
        key: 'projectName',
        label: so ? 'Magaca mashruuca' : 'Project name',
        placeholder: so ? 'tusaale: Hargeisa Plaza' : 'e.g. Hargeisa Plaza',
      },
      {
        key: 'location',
        label: so ? 'Goobta' : 'Location',
        placeholder: so ? 'Hargeisa, Somaliland' : 'Hargeisa, Somaliland',
      },
      {
        key: 'budget',
        label: so ? 'Miisaaniyadda' : 'Budget',
        placeholder: so ? '$250,000' : '$250,000',
      },
      {
        key: 'status',
        label: so ? 'Xaaladda hadda' : 'Current status',
        placeholder: so ? 'Dhismo / Finishing' : 'Structure / Finishing',
      },
      {
        key: 'teamSize',
        label: so ? 'Tirada shaqaalaha' : 'Team size',
        placeholder: so ? '24 shaqaale' : '24 workers',
      },
      {
        key: 'materials',
        label: so ? 'Agabka' : 'Materials',
        placeholder: so ? 'Bir, sibidh, qoryo...' : 'Steel, cement, timber...',
        multiline: true,
      },
      {
        key: 'risks',
        label: so ? 'Khataraha' : 'Risks',
        placeholder: so ? 'Roob, dib u dhac agab...' : 'Rain delay, material shortage...',
        multiline: true,
      },
      {
        key: 'notes',
        label: so ? 'Xog dheeraad ah / jawaabo' : 'Extra data / answers',
        placeholder: so
          ? 'Ku qor jawaabaha ama xogta aad rabto in AI-gu isticmaalo...'
          : 'Add answers or data you want the AI to use...',
        multiline: true,
      },
    ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav.aiAutomation')}
        description={
          so
            ? 'Siiso AI-ga xogta iyo jawaabahaada — waxay kuu diyaarinaysaa warbixino, jadwal, amnig, iyo fariimo si otomaatig ah.'
            : 'Feed the AI your project data and answers — it drafts reports, schedules, safety lists, and client messages automatically.'
        }
        breadcrumbs={[
          { label: t('nav.dashboard'), href: '/dashboard' },
          { label: t('nav.communication') },
          { label: t('nav.aiAutomation') },
        ]}
        actions={
          <Button type="button" variant="outline" size="sm" onClick={clearChat}>
            <Eraser className="h-4 w-4" />
            {so ? 'Nadiifi chat' : 'Clear chat'}
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="flex min-h-[640px] flex-col overflow-hidden xl:col-span-8">
          <CardHeader className="border-b border-border/80 bg-gradient-to-r from-orange-50/80 to-transparent dark:from-orange-950/20">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-soft">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <CardTitle className="text-lg">
                  {so ? 'Wadahadal AI' : 'AI Conversation'}
                </CardTitle>
                <CardDescription>
                  {so
                    ? 'Weydii su’aal ama doorso template otomaatig ah'
                    : 'Ask a question or pick an automation template'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col gap-4 p-0">
            <div className="flex gap-2 overflow-x-auto border-b border-border/60 px-4 py-3">
              {AI_PROMPT_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => sendMessage(so ? tpl.promptSo : tpl.prompt)}
                  disabled={loading}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-orange-200 hover:bg-orange-50 disabled:opacity-50 dark:hover:bg-orange-950/30"
                >
                  <Wand2 className="h-3.5 w-3.5 text-primary" />
                  {so ? tpl.titleSo : tpl.title}
                </button>
              ))}
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'flex gap-3',
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.role !== 'user' && (
                      <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-navy text-white">
                        <Sparkles className="h-4 w-4" />
                      </span>
                    )}
                    <div
                      className={cn(
                        'max-w-[85%] rounded-3xl px-4 py-3 shadow-soft',
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border bg-card text-foreground'
                      )}
                    >
                      <div className={msg.role === 'user' ? 'whitespace-pre-wrap text-sm' : ''}>
                        {msg.role === 'user' ? msg.content : renderMarkdownLite(msg.content)}
                      </div>
                      <p
                        className={cn(
                          'mt-2 text-[10px]',
                          msg.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                        )}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                    {msg.role === 'user' && (
                      <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-muted text-foreground">
                        <User className="h-4 w-4" />
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  {so ? 'AI-gu wuu fekerayaa...' : 'AI is thinking...'}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form
              className="border-t border-border/80 p-4"
              onSubmit={(e) => {
                e.preventDefault()
                void sendMessage(input)
              }}
            >
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    so
                      ? 'Qor su’aashaada ama xogta aad rabto in AI-gu ka jawaabo...'
                      : 'Type your question or the data you want AI to answer from...'
                  }
                  className="min-h-[56px] flex-1 resize-none"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      void sendMessage(input)
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="self-end"
                  loading={loading}
                  disabled={!input.trim()}
                  aria-label={so ? 'Dir' : 'Send'}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {so
                  ? 'Enter = dir · Shift+Enter = sadar cusub'
                  : 'Enter to send · Shift+Enter for new line'}
              </p>
            </form>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader className="border-b border-border/80">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary dark:bg-orange-950/40">
                  <Database className="h-5 w-5" />
                </span>
                <div>
                  <CardTitle className="text-lg">
                    {so ? 'Xogta & Jawaabaha' : 'Data & Answers'}
                  </CardTitle>
                  <CardDescription>
                    {so
                      ? 'Xogtan AI-gu wuu isticmaalayaa markuu jawaabo'
                      : 'The AI uses this context when generating answers'}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div
              className={cn(
                'rounded-2xl border px-3 py-2 text-xs font-medium',
                contextFilled
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300'
                  : 'border-border bg-muted/40 text-muted-foreground'
              )}
            >
              {contextFilled
                ? so
                  ? 'Xogta waa diyaar — AI-gu wuu isticmaali karaa'
                  : 'Context ready — AI can use your data'
                : so
                  ? 'Weli xog ma gelin — buuxi si jawaabaha u noqdaan sax'
                  : 'No data yet — fill fields for better answers'}
            </div>

            {fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.multiline ? (
                  <Textarea
                    id={field.key}
                    value={context[field.key]}
                    onChange={(e) => updateContext(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="min-h-[88px]"
                  />
                ) : (
                  <Input
                    id={field.key}
                    value={context[field.key]}
                    onChange={(e) => updateContext(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}

            <Button type="button" variant="outline" className="w-full" onClick={clearContext}>
              <Eraser className="h-4 w-4" />
              {so ? 'Tirtir xogta' : 'Clear data'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AiAutomationPage
