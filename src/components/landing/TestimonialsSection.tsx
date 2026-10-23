import { Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { Section, SectionHeader } from '@/components/landing/Section'

const testimonials = [
  {
    role: 'Project Manager',
    outcome:
      'Expect clearer milestone tracking and fewer status meetings — everyone sees the same live project board.',
  },
  {
    role: 'Site Supervisor',
    outcome:
      'Daily logs, crew attendance, and material requests stay connected so office teams stop chasing updates.',
  },
  {
    role: 'Finance Lead',
    outcome:
      'Budget vs. actuals per project become visible early, reducing surprise overruns at close-out.',
  },
]

export function TestimonialsSection() {
  return (
    <Section id="testimonials" className="bg-white">
      <SectionHeader
        eyebrow="Proven Impact"
        title="What construction leaders achieve"
        description="Role-based insights on how SiteMaster transforms day-to-day site and office operations."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.div
            key={item.role}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="card-hover relative rounded-3xl border border-border bg-card p-7 shadow-card"
          >
            <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/20" aria-hidden />
            <p className="text-sm leading-relaxed text-slate-700">{item.outcome}</p>
            <div className="mt-6 border-t border-border pt-4">
              <p className="text-sm font-semibold text-slate-900">{item.role}</p>
              <p className="text-xs text-slate-500">Expected outcome with SiteMaster</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
