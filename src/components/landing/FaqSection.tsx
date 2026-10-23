import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Section, SectionHeader } from '@/components/landing/Section'
import { cn } from '@/utils/cn'
import { APP_NAME } from '@/constants/app'

const faqs = [
  {
    question: `What is ${APP_NAME}?`,
    answer:
      'SiteMaster is a state-of-the-art construction company management platform covering projects, HR, inventory, equipment, finance, safety, and AI site intelligence — built for teams across Somaliland, East Africa, and global markets.',
  },
  {
    question: 'Who is it for?',
    answer:
      'Contractors, engineers, architects, project owners, site supervisors, and finance teams who need a shared system instead of scattered spreadsheets.',
  },
  {
    question: 'Can I start with only project management?',
    answer:
      'Yes. Start with core project tools and enable HR, inventory, equipment, finance, and safety modules when you need them.',
  },
  {
    question: 'Is there a demo?',
    answer:
      'Use View Demo to explore the dashboard experience, or create an account to set up your own workspace.',
  },
  {
    question: 'How does Enterprise onboarding work?',
    answer:
      'Enterprise includes a tailored rollout, governance controls, and dedicated support. Reach out via the contact form and we’ll schedule a discovery call.',
  },
  {
    question: 'Does it work on mobile?',
    answer:
      'The interface is fully responsive so field supervisors can update progress and logs from phones and tablets.',
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <Section id="faq" className="bg-slate-50">
      <SectionHeader
        eyebrow="FAQ"
        title="Common questions"
        description="Quick answers about the platform, modules, and getting started."
      />

      <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-border bg-white shadow-card">
        {faqs.map((faq, index) => {
          const open = openIndex === index
          return (
            <div key={faq.question} className={cn(index > 0 && 'border-t border-border')}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-orange-50/60 sm:px-7 sm:py-6"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
              >
                <span className="font-display text-sm font-semibold text-slate-900 sm:text-base">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200',
                    open && 'rotate-180 text-primary'
                  )}
                />
              </button>
              <div
                className={cn(
                  'grid transition-[grid-template-rows] duration-200',
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-6 text-sm leading-relaxed text-slate-500 sm:px-7">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
