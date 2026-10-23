import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, DollarSign, ArrowRight, ExternalLink, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { Section, SectionHeader } from '@/components/landing/Section'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

const showcaseProjects = [
  {
    id: 'hargeisa-biz',
    name: 'Hargeisa Business Tower & Commercial Complex',
    category: 'Commercial',
    location: '26 June District, Hargeisa',
    client: 'Somaliland Investment Board',
    status: 'In Construction',
    progress: 74,
    budget: '$4,250,000',
    completionDate: 'Q4 2026',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1200&auto=format&fit=crop',
    specs: ['22 Floors', 'Structural Steel', 'Solar Integrated'],
  },
  {
    id: 'berbera-port',
    name: 'Berbera Deep Sea Port Terminal Expansion',
    category: 'Infrastructure',
    location: 'Berbera Maritime Zone',
    client: 'Berbera Port Authority',
    status: 'Phase 2 Active',
    progress: 58,
    budget: '$12,800,000',
    completionDate: 'Q2 2027',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    specs: ['450m Quay', 'Heavy Concrete', 'Automated Logistics'],
  },
  {
    id: 'burao-estate',
    name: 'Burao Horizon Smart Housing Estate',
    category: 'Residential',
    location: 'Burao North Sector',
    client: 'Horizon Homes Ltd',
    status: 'Mobilizing',
    progress: 32,
    budget: '$2,900,000',
    completionDate: 'Q1 2027',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=1200&auto=format&fit=crop',
    specs: ['120 Units', 'Eco Masonry', 'Paved Networks'],
  },
]

const categories = ['All', 'Commercial', 'Infrastructure', 'Residential']

export function ProjectsSection() {
  const [activeTab, setActiveTab] = useState('All')

  const filtered = activeTab === 'All' 
    ? showcaseProjects 
    : showcaseProjects.filter((p) => p.category === activeTab)

  return (
    <Section id="projects" className="relative overflow-hidden bg-slate-900 text-white">
      {/* Glow Backdrops */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(14,165,233,0.15),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-20" />

      <div className="relative z-10">
        <SectionHeader
          eyebrow="Portfolio Showcase"
          title="Mastering builds across East Africa & beyond"
          description="Explore high-impact civil, infrastructure, and commercial builds actively managed with SiteMaster."
          tone="dark"
        />

        {/* Category Filters */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={cn(
                'rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200',
                activeTab === cat
                  ? 'bg-sky-500 text-white shadow-soft shadow-sky-500/30'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-sky-500/50 hover:shadow-sky-500/10"
            >
              {/* Image & Status Overlay */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-800">
                <img
                  src={project.image}
                  alt={project.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="rounded-full border border-white/20 bg-slate-900/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    {project.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300 backdrop-blur-md">
                  <Activity className="h-3.5 w-3.5 animate-pulse text-sky-400" />
                  {project.status}
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="font-display text-xl font-bold text-white transition-colors group-hover:text-sky-300">
                  {project.name}
                </h3>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                  <span>{project.location}</span>
                </div>

                {/* Specs Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.specs.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-white/5"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">Site Progress</span>
                    <span className="text-sky-400">{project.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${project.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
                    />
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                  <div className="flex items-center gap-1 text-slate-300">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="font-semibold text-white">{project.budget}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-sky-400" />
                    <span>{project.completionDate}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Footer Link */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            asChild
            className="rounded-2xl bg-sky-500 px-8 text-white shadow-lift hover:bg-sky-600"
          >
            <Link to="/auth/register">
              Start Managing Your Build
              <ArrowRight className="h-4 w-4 ms-2" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="rounded-2xl border-white/20 bg-white/10 text-white hover:bg-white/15"
          >
            <Link to="/dashboard/projects">
              Explore Live Workspace
              <ExternalLink className="h-4 w-4 ms-2 text-sky-400" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  )
}
