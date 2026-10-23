import { motion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  FolderKanban,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { cn } from '@/utils/cn'

const PLACEHOLDER = '—'

const kpis = [
  { label: 'Total Revenue', value: PLACEHOLDER, icon: ArrowUpRight, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
  { label: 'Total Expenses', value: PLACEHOLDER, icon: ArrowDownRight, color: 'text-red-600 bg-red-50 dark:bg-red-950/40' },
  { label: 'Active Projects', value: PLACEHOLDER, icon: Briefcase, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40' },
  { label: 'Completed Projects', value: PLACEHOLDER, icon: CheckCircle2, color: 'text-primary bg-orange-50 dark:bg-orange-950/40' },
  { label: 'Workforce', value: PLACEHOLDER, icon: Users, color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40' },
  { label: 'Budget Utilization', value: PLACEHOLDER, icon: Wallet, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40' },
]

const emptyTrend = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
  { name: 'Jun', value: 0 },
]

const emptyComparison = [
  { name: 'Jan', revenue: 0, expenses: 0 },
  { name: 'Feb', revenue: 0, expenses: 0 },
  { name: 'Mar', revenue: 0, expenses: 0 },
  { name: 'Apr', revenue: 0, expenses: 0 },
  { name: 'May', revenue: 0, expenses: 0 },
  { name: 'Jun', revenue: 0, expenses: 0 },
]

const emptyStatus = [
  { name: 'Planning', value: 0 },
  { name: 'Active', value: 0 },
  { name: 'On Hold', value: 0 },
  { name: 'Completed', value: 0 },
]

const PIE_COLORS = ['#F97316', '#0F172A', '#94A3B8', '#10B981']

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Construction performance metrics. Connect your API to populate live analytics."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports' },
          { label: 'Analytics' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.25 }}
          >
            <Card className="transition-shadow hover:shadow-soft">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', kpi.color)}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="font-display text-2xl font-bold tracking-tight">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue — awaiting API data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={emptyTrend}>
                  <defs>
                    <linearGradient id="analyticsRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F97316" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#F97316"
                    fill="url(#analyticsRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses Trend</CardTitle>
            <CardDescription>Monthly expenses — awaiting API data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emptyTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Side-by-side comparison — awaiting API data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emptyComparison}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#F97316" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#0F172A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Distribution by status — awaiting API data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emptyStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                  >
                    {emptyStatus.map((_, index) => (
                      <Cell key={emptyStatus[index].name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <EmptyState
              title="No analytics data"
              description="Charts will populate once reporting endpoints are connected."
              icon={<TrendingUp className="h-7 w-7" />}
              className="border-0 py-6 shadow-none"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Performance</CardTitle>
          <CardDescription>Per-project metrics will appear when API data is available</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No project metrics"
            description="Performance breakdowns by project will appear here."
            icon={<FolderKanban className="h-7 w-7" />}
            className="border-0 py-10 shadow-none"
          />
        </CardContent>
      </Card>
    </div>
  )
}
