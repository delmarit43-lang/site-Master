import { motion } from 'framer-motion'
import {
  FolderKanban,
  Users,
  Package,
  Truck,
  Wallet,
  ShieldCheck,
} from 'lucide-react'
import { Section, SectionHeader } from '@/components/landing/Section'

const services = [
  {
    icon: FolderKanban,
    title: 'Project Management',
    description:
      'Plan timelines, track milestones, assign tasks, and monitor progress across every active site.',
  },
  {
    icon: Users,
    title: 'HR & Workforce',
    description:
      'Manage crews, attendance, roles, and payroll-ready records for office and field staff.',
  },
  {
    icon: Package,
    title: 'Inventory',
    description:
      'Track materials from warehouse to site with stock levels, transfers, and usage logs.',
  },
  {
    icon: Truck,
    title: 'Equipment',
    description:
      'Schedule machinery, log maintenance, and see which assets are available or in use.',
  },
  {
    icon: Wallet,
    title: 'Finance',
    description:
      'Monitor budgets, expenses, invoices, and project-level costs without leaving the platform.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety & Compliance',
    description:
      'Record incidents, checklists, and safety protocols to keep sites audit-ready.',
  },
]

export function ServicesSection() {
  return (
    <Section id="services" className="relative overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_0%,rgba(249,115,22,0.08),transparent_55%)]" />

      <div className="relative">
        <SectionHeader
          eyebrow="Services"
          title="Everything your construction business needs"
          description="Modular tools that work together — start with projects and expand into HR, inventory, equipment, finance, and safety."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="group card-hover rounded-3xl border border-border bg-white p-7 shadow-card sm:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-orange-400 transition-transform duration-300 group-hover:scale-105">
                <service.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
