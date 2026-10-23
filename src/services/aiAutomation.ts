export type AiMessageRole = 'user' | 'assistant' | 'system'

export interface AiMessage {
  id: string
  role: AiMessageRole
  content: string
  createdAt: string
}

export interface AiContextData {
  projectName: string
  location: string
  budget: string
  status: string
  teamSize: string
  materials: string
  risks: string
  notes: string
}

export const emptyAiContext = (): AiContextData => ({
  projectName: '',
  location: '',
  budget: '',
  status: '',
  teamSize: '',
  materials: '',
  risks: '',
  notes: '',
})

export interface AiPromptTemplate {
  id: string
  title: string
  titleSo: string
  prompt: string
  promptSo: string
}

export const AI_PROMPT_TEMPLATES: AiPromptTemplate[] = [
  {
    id: 'daily-report',
    title: 'Daily site report',
    titleSo: 'Warbixinta maalinlaha ee goobta',
    prompt:
      'Write a professional daily construction site report using the project data I provided. Include progress, workforce, materials used, and next steps.',
    promptSo:
      'Qor warbixin maalinle ah oo xirfad leh oo ku saabsan goobta dhismaha adigoo isticmaalaya xogta mashruuca aan ku siiyay. Ku dar horumarka, shaqaalaha, agabka la isticmaalay, iyo tallaabooyinka xiga.',
  },
  {
    id: 'safety',
    title: 'Safety checklist',
    titleSo: 'Liiska amniga',
    prompt:
      'Create a construction safety checklist tailored to this project, location, and known risks.',
    promptSo:
      'Samee liis amniga dhismaha oo ku habboon mashruucan, goobta, iyo khataraha la og yahay.',
  },
  {
    id: 'budget',
    title: 'Budget summary',
    titleSo: 'Soo koobid miisaaniyadeed',
    prompt:
      'Summarize the project budget, highlight overspend risks, and suggest cost-control actions.',
    promptSo:
      'Soo koob miisaaniyadda mashruuca, muuji khataraha kharashka, una soo jeedi tallaabooyin xakameynta kharashka.',
  },
  {
    id: 'schedule',
    title: 'Schedule plan',
    titleSo: 'Qorshaha jadwalka',
    prompt:
      'Propose a practical 2-week construction schedule based on current status, team size, and materials.',
    promptSo:
      'Soo jeedi jadwal dhismaha oo 2 toddobaad ah oo ku salaysan xaaladda hadda, tiro shaqaale, iyo agabka.',
  },
  {
    id: 'client-update',
    title: 'Client update email',
    titleSo: 'Email cusbooneysiinta macmiilka',
    prompt:
      'Draft a clear client update email about project progress, risks, and upcoming milestones.',
    promptSo:
      'Qor email cusbooneysiinta macmiilka oo ku saabsan horumarka, khataraha, iyo heerar-yimaadka soo socda.',
  },
]

function hasContext(ctx: AiContextData) {
  return Object.values(ctx).some((v) => v.trim().length > 0)
}

function formatContext(ctx: AiContextData, so: boolean) {
  if (!hasContext(ctx)) {
    return so
      ? 'Ma jirto xog mashruuc oo la geliyay weli.'
      : 'No project context provided yet.'
  }

  const rows = [
    [so ? 'Mashruuc' : 'Project', ctx.projectName],
    [so ? 'Goob' : 'Location', ctx.location],
    [so ? 'Miisaaniyad' : 'Budget', ctx.budget],
    [so ? 'Xaalad' : 'Status', ctx.status],
    [so ? 'Kooxda' : 'Team size', ctx.teamSize],
    [so ? 'Agab' : 'Materials', ctx.materials],
    [so ? 'Khataraha' : 'Risks', ctx.risks],
    [so ? 'Qoraal dheeraad' : 'Notes', ctx.notes],
  ].filter(([, v]) => v.trim())

  return rows.map(([k, v]) => `• ${k}: ${v}`).join('\n')
}

function detectIntent(message: string) {
  const m = message.toLowerCase()
  if (/safety|amnig|ppe|incident|khatar/.test(m)) return 'safety'
  if (/budget|miisaaniy|cost|kharash|qiimo/.test(m)) return 'budget'
  if (/schedule|jadwal|timeline|waqti|plan/.test(m)) return 'schedule'
  if (/report|warbixin|daily|maalin/.test(m)) return 'report'
  if (/email|client|macmiil|update|cusboon/.test(m)) return 'client'
  if (/material|agab|inventory|stock/.test(m)) return 'materials'
  return 'general'
}

export async function generateAiReply(params: {
  message: string
  context: AiContextData
  locale?: string
}): Promise<string> {
  const { message, context, locale = 'en' } = params
  const so = locale === 'so'
  const intent = detectIntent(message)
  const contextBlock = formatContext(context, so)

  // Simulate thinking latency for a premium feel
  await new Promise((r) => setTimeout(r, 550 + Math.random() * 450))

  const intro = so
    ? 'Waa kan soo jeedinta AI Automation ee ku salaysan xogta aad siisay:'
    : 'Here is an AI Automation draft based on the data you provided:'

  const contextSection = so
    ? `### Xogta la isticmaalay\n${contextBlock}`
    : `### Context used\n${contextBlock}`

  const bodies: Record<string, string> = {
    report: so
      ? `### Warbixin maalinle
1. **Horumarka:** ${context.status || 'Shaqadu waa socota'} — diiradda saar qaybaha muhiimka ah ee goobta.
2. **Shaqaalaha:** ${context.teamSize || 'Kooxda goobta'} ayaa joogay; qaybi howlaha qoritaanka iyo kormeerka.
3. **Agabka:** ${context.materials || 'Agabka la isticmaalay maanta'} — hubi kaydka ka hor maalinta berri.
4. **Khataraha:** ${context.risks || 'Ma jiraan dhacdooyin cusub'} — la soco amniga.
5. **Berri:** Qorshee howlaha xiga oo la wadaag maareeyaha goobta.

Haddii aad rabto, waxaan kuu qori karaa nooc PDF/email ah.`
      : `### Daily site report
1. **Progress:** ${context.status || 'Work ongoing'} — focus on critical path activities.
2. **Workforce:** ${context.teamSize || 'Site crew'} on site; assign clear ownership for each task.
3. **Materials:** ${context.materials || 'Materials used today'} — verify stock before tomorrow.
4. **Risks:** ${context.risks || 'No new incidents recorded'} — keep PPE and toolbox talks active.
5. **Tomorrow:** Plan next activities and brief the site manager.

I can also turn this into an email or checklist format.`,

    safety: so
      ? `### Liiska amniga goobta
- Hubi PPE dhammaan shaqaalaha
- Kormeer scaffolding / ladders / qalabka culus
- Calaamadee aagagga khatarta leh
- Diyaari jidka baxsadka iyo gargaarka degdegga
- Diiwaangeli dhacdo kasta iyo near-miss
- Khataraha la sheegay: ${context.risks || 'lama soo sheegin'}

Goob: ${context.location || 'lama cayimin'}.`
      : `### Site safety checklist
- Verify PPE for all workers
- Inspect scaffolding, ladders, and heavy equipment
- Mark hazardous zones clearly
- Confirm emergency exits and first-aid readiness
- Log every incident and near-miss
- Reported risks: ${context.risks || 'none provided'}

Site: ${context.location || 'not specified'}.`,

    budget: so
      ? `### Falanqaynta miisaaniyadda
- Miisaaniyad: ${context.budget || 'lama gelin'}
- Xaalad: ${context.status || 'lama sheegin'}
- Talobixin: kala saar kharashka agabka, shaqaalaha, iyo qandaraasyada
- Xakamee orders-ka degdegga ah
- Isbarbardhig kharashka toddobaadlaha iyo qorshaha

Haddii aad ii sheegto tirooyinka dhabta ah, waxaan kuu sameynayaa forecast.`
      : `### Budget analysis
- Budget: ${context.budget || 'not provided'}
- Status: ${context.status || 'not provided'}
- Recommendation: separate material, labor, and subcontract spend
- Control rush orders and track weekly burn vs plan
- Flag variance early before cash-flow pressure

Share actual numbers and I can produce a forecast.`,

    schedule: so
      ? `### Jadwal 2 toddobaad
**Toddobaad 1**
- Maalin 1–2: diyaarinta goobta & agabka (${context.materials || 'agabka muhiimka ah'})
- Maalin 3–5: howlaha ugu muhiimsan ee xaaladda (${context.status || 'howsha hadda'})
- Maalin 6–7: kormeer tayada & amniga

**Toddobaad 2**
- Dhammaystir qaybaha dib u dhacay
- Cusboonaysii macmiilka
- Diyaari agabka toddobaadka xiga

Kooxda: ${context.teamSize || 'lama sheegin'}.`
      : `### 2-week schedule
**Week 1**
- Days 1–2: site prep & materials (${context.materials || 'key materials'})
- Days 3–5: critical path work (${context.status || 'current status'})
- Days 6–7: quality + safety inspection

**Week 2**
- Close delayed items
- Client progress update
- Stage materials for the following week

Team: ${context.teamSize || 'not specified'}.`,

    client: so
      ? `### Qoraal email macmiil
Mawduuc: Cusbooneysiinta mashruuca ${context.projectName || ''}

Asalaamu calaykum,

Waxaan kuu soo gudbinaynaa horumarka mashruuca ee ${context.location || 'goobta'}.
Xaaladda hadda: ${context.status || 'shaqadu waa socota'}.
Khataraha la socda: ${context.risks || 'ma jiraan kuwo cusub'}.
Tallaabooyinka xiga waxaan kuu soo diri doonaa toddobaadkan.

Mahadsanid,
Kooxda SiteMaster`
      : `### Client update draft
Subject: Project update — ${context.projectName || 'your project'}

Hello,

Here is the latest update for ${context.location || 'the site'}.
Current status: ${context.status || 'work is progressing'}.
Active risks: ${context.risks || 'none new reported'}.
Next milestones will be shared this week.

Best regards,
SiteMaster team`,

    materials: so
      ? `### Talobixin agabka
Agabka la sheegay: ${context.materials || 'lama gelin'}
- Samee liis kayd (min/max)
- Hubi suppliers-ka ka hor in ay dhamaadaan
- Isku xidh purchase orders iyo jadwalka goobta`
      : `### Materials guidance
Listed materials: ${context.materials || 'not provided'}
- Maintain min/max stock levels
- Confirm supplier lead times before shortages
- Align purchase orders with the site schedule`,

    general: so
      ? `Waan ku caawin karaa automation-ka dhismaha: warbixino, amniga, miisaaniyad, jadwal, iyo fariimaha macmiilka.

Si ugu wanaagsan ugu jawaabo:
1. Buuxi xogta mashruuca dhanka midig
2. Doorso template ama qor su'aashaada
3. Aniga ayaan kuu sameynayaa jawaab diyaarsan

Su'aashaada: “${message.trim()}”`
      : `I can help automate construction workflows: reports, safety, budgets, schedules, and client messages.

For the best answer:
1. Fill project data in the side panel
2. Pick a template or ask your question
3. I will generate a ready-to-use response

Your request: “${message.trim()}”`,
  }

  return `${intro}\n\n${contextSection}\n\n${bodies[intent] ?? bodies.general}`
}

export function createMessage(role: AiMessageRole, content: string): AiMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
  }
}
