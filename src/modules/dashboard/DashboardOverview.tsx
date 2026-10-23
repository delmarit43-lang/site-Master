import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Building2,
  FolderKanban,
  RefreshCw,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { STORAGE_KEYS } from '@/constants/app'
import { seedDemoData } from '@/constants/seedData'
import { useLanguage } from '@/contexts/LanguageContext'
import { getModuleRecords, readStorage } from '@/utils/storage'

type DashStats = {
  activeProjects: number
  totalClients: number
  monthlyRevenue: number
  teamMembers: number
}

type ChartPoint = { name: string; value: number }

const defaultStats: DashStats = {
  activeProjects: 0,
  totalClients: 0,
  monthlyRevenue: 0,
  teamMembers: 0,
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function DashboardOverview() {
  const { t } = useLanguage()
  const [tick, setTick] = useState(0)

  const stats = useMemo(() => {
    void tick
    return readStorage<DashStats>(STORAGE_KEYS.dashboardStats, defaultStats)
  }, [tick])

  const revenueData = useMemo(() => {
    void tick
    return readStorage<ChartPoint[]>(STORAGE_KEYS.revenueChart, [])
  }, [tick])

  const progressData = useMemo(() => {
    void tick
    return readStorage<ChartPoint[]>(STORAGE_KEYS.progressChart, [])
  }, [tick])

  const projects = useMemo(() => {
    void tick
    return getModuleRecords('projects').slice(0, 5)
  }, [tick])

  const activity = useMemo(() => {
    void tick
    return getModuleRecords('notifications').slice(0, 6)
  }, [tick])

  const cards = [
    {
      title: t('dashboard.activeProjects'),
      value: String(stats.activeProjects),
      icon: FolderKanban,
      hint: t('dashboard.recentProjectsDesc'),
    },
    {
      title: t('dashboard.clients'),
      value: String(stats.totalClients),
      icon: Users,
      hint: t('dashboard.recentProjectsDesc'),
    },
    {
      title: t('dashboard.revenue'),
      value: formatMoney(stats.monthlyRevenue),
      icon: Wallet,
      hint: t('dashboard.revenueDesc'),
    },
    {
      title: t('dashboard.employees'),
      value: String(stats.teamMembers),
      icon: Building2,
      hint: t('dashboard.recentActivityDesc'),
    },
  ]

  function reloadDemo() {
    seedDemoData({ force: true })
    setTick((n) => n + 1)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('dashboard.title')}
        description={t('dashboard.description')}
        actions={
          <Button type="button" variant="outline" size="sm" onClick={reloadDemo}>
            <RefreshCw className="h-4 w-4" />
            Reload demo data
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="card-hover overflow-hidden border-border/80">
            <div className="h-1 bg-gradient-to-r from-primary via-orange-400 to-amber-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
              <CardDescription className="font-medium text-muted-foreground">
                {card.title}
              </CardDescription>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-primary dark:bg-orange-950/40">
                <card.icon className="h-5 w-5" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl font-bold tracking-tight">{card.value}</div>
              <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-success" />
                {card.hint}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>{t('dashboard.revenueOverview')}</CardTitle>
            <CardDescription>{t('dashboard.revenueDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F97316" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#F97316"
                    fill="url(#revenueFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t('dashboard.projectProgress')}</CardTitle>
            <CardDescription>{t('dashboard.projectProgressDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0F172A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentProjects')}</CardTitle>
            <CardDescription>{t('dashboard.recentProjectsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.map((project) => (
              <Link
                key={String(project.id)}
                to={`/app/projects/${project.id}`}
                className="flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3.5 transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-soft dark:hover:bg-orange-950/20"
              >
                <div>
                  <p className="font-medium">{String(project.name ?? 'Project')}</p>
                  <p className="text-xs text-muted-foreground">
                    {String(project.client ?? '—')} · {String(project.location ?? '—')}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{String(project.status ?? 'Active')}</Badge>
                  <p className="mt-1 text-xs text-muted-foreground">{Number(project.progress ?? 0)}%</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
            <CardDescription>{t('dashboard.recentActivityDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.map((item) => (
              <div
                key={String(item.id)}
                className="rounded-2xl border border-border/70 px-4 py-3.5 transition hover:bg-muted/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{String(item.title ?? 'Update')}</p>
                  <Badge variant="outline">{String(item.type ?? 'info')}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{String(item.message ?? '')}</p>
                <p className="mt-1 text-xs text-muted-foreground">{String(item.time ?? item.date ?? '')}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
