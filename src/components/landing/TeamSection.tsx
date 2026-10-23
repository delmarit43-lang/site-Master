import { motion } from 'framer-motion'
import {
  HardHat,
  Ruler,
  Calculator,
  ClipboardList,
  Wrench,
  Headphones,
} from 'lucide-react'
import { Section, SectionHeader } from '@/components/landing/Section'

const roles = [
  {
    icon: HardHat,
    title: 'Project Managers',
    description: 'Own timelines, budgets, and site coordination across concurrent builds.',
  },
  {
    icon: Ruler,
    title: 'Engineers & Architects',
    description: 'Align drawings, RFIs, and site changes with live project data.',
  },
  {
    icon: ClipboardList,
    title: 'Site Supervisors',
    description: 'Log daily progress, crew attendance, and material usage from the field.',
  },
  {
    icon: Calculator,
    title: 'Finance Controllers',
    description: 'Track project costs, invoices, and cash flow against approved budgets.',
  },
  {
    icon: Wrench,
    title: 'Fleet & Warehouse Leads',
    description: 'Keep equipment and inventory synced so sites never wait on assets.',
  },
  {
    icon: Headphones,
    title: 'Support & Success',
    description: 'Help teams onboard, configure modules, and get the most from the platform.',
  },
]

export function TeamSection() {
  return (
    <Section id="team" className="bg-slate-50">
      <SectionHeader
        eyebrow="Our Ecosystem"
        title="Roles that power SiteMaster"
        description="Built and supported by construction domain specialists — here’s how core roles collaborate seamlessly across the platform."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role, index) => (
          <motion.div
            key={role.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04, duration: 0.4 }}
            className="card-hover rounded-3xl border border-border bg-white p-6 shadow-card"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
              <role.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-base font-semibold text-slate-900">{role.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{role.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
