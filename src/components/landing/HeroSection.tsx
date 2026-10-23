import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/contexts/LanguageContext'

function AnimatedStat({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const count = useMotionValue(0)
  const spring = useSpring(count, { stiffness: 60, damping: 20 })
  const display = useTransform(spring, (v) => `${Math.round(v)}${suffix}`)

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.4, ease: 'easeOut' })
    return controls.stop
  }, [count, value])

  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 shadow-soft backdrop-blur-xl">
      <motion.p className="font-display text-2xl font-bold text-white">{display}</motion.p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-300">{label}</p>
    </div>
  )
}

function HeroArtwork() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Deep Space Background with Electric Blue Radial Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#060913_0%,#0B0F19_45%,#0F172A_100%)]" />
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute -right-24 top-10 h-[560px] w-[560px] rounded-full bg-sky-500/20 blur-[120px]" />
      <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-cyan-500/15 blur-[100px]" />
      <div className="absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-indigo-500/15 blur-[90px]" />

      <svg
        viewBox="0 0 1440 900"
        className="absolute inset-0 h-full w-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="buildFace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="craneGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
          <linearGradient id="beamGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <g opacity="0.95">
          <path d="M760 900 V260 L970 180 V900 Z" fill="url(#buildFace)" stroke="rgba(14,165,233,0.3)" strokeWidth="1" />
          <path d="M970 900 V220 L1180 290 V900 Z" fill="#0F172A" stroke="rgba(56,189,248,0.2)" strokeWidth="1" />
          <path d="M1180 900 V340 L1360 400 V900 Z" fill="#1E293B" stroke="rgba(56,189,248,0.2)" strokeWidth="1" />

          {/* Windows / Cyber Grid Lines */}
          <g fill="#38BDF8" opacity="0.45">
            <rect x="800" y="320" width="40" height="48" rx="4" />
            <rect x="860" y="320" width="40" height="48" rx="4" />
            <rect x="800" y="400" width="40" height="48" rx="4" />
            <rect x="860" y="400" width="40" height="48" rx="4" />
            <rect x="800" y="480" width="40" height="48" rx="4" />
            <rect x="860" y="480" width="40" height="48" rx="4" />
            <rect x="1030" y="360" width="40" height="48" rx="4" />
            <rect x="1090" y="360" width="40" height="48" rx="4" />
            <rect x="1030" y="450" width="40" height="48" rx="4" />
            <rect x="1090" y="450" width="40" height="48" rx="4" />
          </g>

          {/* Precision Construction Crane */}
          <rect x="600" y="110" width="14" height="580" fill="#0F172A" stroke="#0EA5E9" strokeWidth="1" />
          <rect x="450" y="150" width="420" height="14" rx="3" fill="url(#craneGrad)" />
          <path d="M450 157 L495 110 L495 205 Z" fill="#0284C7" />
          <line
            x1="760"
            y1="164"
            x2="760"
            y2="300"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="8 6"
          />
          <rect x="730" y="300" width="60" height="40" rx="8" fill="#0EA5E9" stroke="#E0F2FE" strokeWidth="1.5" />
          <circle cx="607" cy="104" r="10" fill="#10B981" />
        </g>
      </svg>

      <div className="absolute inset-y-0 left-0 w-full max-w-3xl bg-gradient-to-r from-[#060913] via-[#060913]/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#060913] to-transparent" />
    </div>
  )
}

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden text-white">
      <HeroArtwork />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-24 pt-32 sm:px-6 lg:px-8 lg:pb-20">
        <div className="max-w-2xl">
          {/* Glowing Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-300">
              SiteMaster v3.0 — Construction Intelligence
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Site<span className="text-gradient">Master</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.6 }}
            className="mt-5 max-w-xl font-display text-2xl font-semibold leading-snug tracking-tight text-slate-100 sm:text-3xl lg:text-4xl"
          >
            {t('landing.heroTitle')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.55 }}
            className="mt-5 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg"
          >
            {t('landing.heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.55 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button
              size="lg"
              asChild
              className="h-13 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 px-8 text-base font-semibold shadow-[0_12px_40px_-10px_rgba(14,165,233,0.6)] hover:brightness-110"
            >
              <Link to="/auth/register">
                {t('landing.getStarted')}
                <ArrowRight className="h-4 w-4 ms-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-13 rounded-2xl border-white/20 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-md hover:border-white/40 hover:bg-white/15 hover:text-white"
            >
              <Link to="/dashboard">
                <Play className="h-4 w-4 me-1" />
                {t('landing.viewDemo')}
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-14 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <AnimatedStat value={48} suffix="+" label="Modules" />
          <AnimatedStat value={100} suffix="%" label="Cloud ready" />
          <AnimatedStat value={24} suffix="/7" label="Ops focus" />
          <AnimatedStat value={3} label="Regions" />
        </motion.div>
      </div>
    </section>
  )
}
