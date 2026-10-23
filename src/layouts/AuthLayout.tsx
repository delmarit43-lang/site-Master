import { Link, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  HardHat,
  Shield,
} from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { APP_NAME } from '@/constants/app'

const benefits = [
  {
    icon: HardHat,
    title: 'Project oversight',
    description: 'Track sites, tasks, and progress in one place.',
  },
  {
    icon: Building2,
    title: 'Company operations',
    description: 'Manage teams, materials, and equipment together.',
  },
  {
    icon: Shield,
    title: 'Secure access',
    description: 'Role-based controls for every stakeholder.',
  },
]

export function AuthLayout() {
  return (
    <div className="scheme-light grid min-h-screen bg-background text-foreground lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-secondary p-10 text-secondary-foreground lg:flex xl:p-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(14,165,233,0.35), transparent 45%), radial-gradient(circle at 80% 80%, rgba(6,182,212,0.15), transparent 40%), linear-gradient(160deg, #060913 0%, #0F172A 55%, #0B0F19 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent, transparent 48px, #fff 48px, #fff 49px), repeating-linear-gradient(0deg, transparent, transparent 48px, #fff 48px, #fff 49px)',
          }}
        />

        <div className="relative z-10">
          <Logo inverted size="lg" to="/" />
        </div>

        <div className="relative z-10 space-y-8 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl xl:text-4xl font-semibold leading-tight tracking-tight">
              Build smarter.
              <span className="block text-primary">Manage every site.</span>
            </h1>
            <p className="mt-4 text-slate-300 text-base leading-relaxed">
              The enterprise construction platform for contractors, engineers,
              architects, and project owners across Somaliland and East Africa.
            </p>
          </motion.div>

          <ul className="space-y-4">
            {benefits.map((item, index) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
              >
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                  <item.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium text-sm text-white">{item.title}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{item.description}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-slate-400">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Trusted by construction teams across East Africa
        </div>
      </aside>

      <main className="relative flex flex-col min-h-screen">
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="lg:hidden">
            <Logo size="sm" to="/" />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md"
          >
            <Outlet />
          </motion.div>
        </div>

        <p className="px-6 pb-6 text-center text-xs text-muted-foreground sm:px-10 lg:hidden">
          {APP_NAME} — Construction CMS
        </p>
      </main>
    </div>
  )
}

export default AuthLayout
