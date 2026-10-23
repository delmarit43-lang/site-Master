import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Lock, BarChart3, Smartphone, Sparkles } from 'lucide-react'
import { Section, SectionHeader } from '@/components/landing/Section'

const reasons = [
  {
    icon: Sparkles,
    title: 'Purpose-built for construction',
    text: 'Not a generic ERP with bolted-on modules — workflows mirror real site operations.',
  },
  {
    icon: BarChart3,
    title: 'Live operational visibility',
    text: 'See project health, spend, and resource use without waiting for end-of-month reports.',
  },
  {
    icon: Clock,
    title: 'Faster coordination',
    text: 'Replace scattered spreadsheets and chat threads with one shared source of truth.',
  },
  {
    icon: Lock,
    title: 'Role-based access',
    text: 'Give managers, supervisors, and finance teams the right data — nothing more.',
  },
  {
    icon: Smartphone,
    title: 'Ready for field & office',
    text: 'Responsive UI so supervisors can update status on site while HQ stays in sync.',
  },
  {
    icon: CheckCircle2,
    title: 'Scales with your portfolio',
    text: 'Grow from a single site to a multi-project company without changing tools.',
  },
]

export function WhyChooseUsSection() {
  return (
    <Section id="why-us" className="relative overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_10%,rgba(14,165,233,0.2),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-20" />

      <div className="relative">
        <SectionHeader
          eyebrow="Why Choose SiteMaster"
          title="Built to keep construction moving without friction"
          description="SiteMaster focuses on real-time operational clarity, speed, and governance — so construction teams spend less time chasing status and more time delivering quality builds."
          tone="dark"
          align="left"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:bg-white/10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 text-orange-300">
                <reason.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-white">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{reason.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
