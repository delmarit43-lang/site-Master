import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { Section, SectionHeader } from '@/components/landing/Section'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

const tiers = [
  {
    name: 'Starter',
    price: 'Free to start',
    description: 'For small teams managing a handful of sites.',
    features: [
      'Up to 3 active projects',
      'Core project & task boards',
      'Basic inventory tracking',
      'Email support',
    ],
    cta: 'Get Started',
    href: '/auth/register',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: 'Growing teams',
    description: 'Full operations stack for mid-size contractors.',
    features: [
      'Unlimited projects',
      'HR, equipment & finance modules',
      'Safety checklists & incident logs',
      'Role-based permissions',
      'Priority support',
    ],
    cta: 'Start Professional',
    href: '/auth/register',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact sales',
    description: 'Custom rollout for large portfolios and multi-branch firms.',
    features: [
      'Everything in Professional',
      'SSO & advanced governance',
      'Dedicated onboarding',
      'Custom integrations',
      'SLA-backed support',
    ],
    cta: 'Contact Sales',
    href: '#contact',
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <Section id="pricing" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(249,115,22,0.07),transparent_60%)]" />

      <div className="relative">
        <SectionHeader
          eyebrow="Pricing"
          title="Plans that grow with your sites"
          description="Choose a starting point today. Upgrade modules as your portfolio expands — Enterprise includes a tailored rollout."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className={cn(
                'relative flex flex-col rounded-3xl border p-8 transition-shadow sm:p-9',
                tier.highlighted
                  ? 'border-primary/40 bg-navy text-white shadow-lift ring-1 ring-primary/30'
                  : 'border-border bg-card shadow-card hover:shadow-lift'
              )}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3.5 py-1 text-xs font-semibold text-white shadow-soft">
                  Most popular
                </span>
              )}
              <h3
                className={cn(
                  'font-display text-xl font-semibold',
                  tier.highlighted ? 'text-white' : 'text-slate-900'
                )}
              >
                {tier.name}
              </h3>
              <p
                className={cn(
                  'mt-3 font-display text-2xl font-bold',
                  tier.highlighted ? 'text-orange-300' : 'text-slate-900'
                )}
              >
                {tier.price}
              </p>
              <p
                className={cn(
                  'mt-2 text-sm',
                  tier.highlighted ? 'text-slate-300' : 'text-slate-500'
                )}
              >
                {tier.description}
              </p>

              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className={cn(
                      'flex items-start gap-2.5 text-sm',
                      tier.highlighted ? 'text-slate-200' : 'text-slate-700'
                    )}
                  >
                    <Check
                      className={cn(
                        'mt-0.5 h-4 w-4 shrink-0',
                        tier.highlighted ? 'text-orange-300' : 'text-success'
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  className="w-full"
                  variant={tier.highlighted ? 'default' : 'outline'}
                  asChild
                >
                  {tier.href.startsWith('#') ? (
                    <a href={tier.href}>{tier.cta}</a>
                  ) : (
                    <Link to={tier.href}>{tier.cta}</Link>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
