import { motion } from 'framer-motion'
import { Building2, Globe2, Layers } from 'lucide-react'
import { Section, SectionHeader } from '@/components/landing/Section'
import { APP_NAME } from '@/constants/app'

const highlights = [
  {
    icon: Building2,
    title: 'Built for construction',
    text: 'Workflows that match how sites actually run — from bid to handover.',
  },
  {
    icon: Layers,
    title: 'Everything connected',
    text: 'Projects, HR, inventory, equipment, finance, and safety in one system.',
  },
  {
    icon: Globe2,
    title: 'Regional & global ready',
    text: 'Designed for Somaliland, East Africa, and international construction teams.',
  },
]

export function AboutSection() {
  return (
    <Section id="about" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-orange-50 to-transparent lg:block" />

      <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionHeader
          eyebrow="About us"
          title={`What is ${APP_NAME}?`}
          description={`${APP_NAME} is a premium construction company management platform. It helps contractors, engineers, architects, and project owners plan work, coordinate teams, and keep financial and site data in one place.`}
          align="left"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-3xl bg-navy p-8 text-white shadow-lift sm:p-10"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />
          <p className="relative font-display text-2xl font-semibold leading-snug sm:text-3xl">
            One system for every site, crew, and cost center.
          </p>
          <p className="relative mt-5 text-sm leading-relaxed text-slate-300 sm:text-base">
            Replace fragmented spreadsheets with live project visibility built for modern
            construction operations.
          </p>
        </motion.div>
      </div>

      <div className="relative mt-20 grid gap-6 sm:grid-cols-3">
        {highlights.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            className="card-hover rounded-3xl border border-border bg-card p-7 shadow-card"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
