import { useMemo, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader, PageHeaderAction } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type?: string
}

interface CalendarPageProps {
  events?: CalendarEvent[]
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarPage({ events = [] }: CalendarPageProps) {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentMonth])

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return []
    return events.filter((event) => isSameDay(new Date(event.date), selectedDate))
  }, [events, selectedDate])

  const eventsOnDay = (day: Date) =>
    events.filter((event) => isSameDay(new Date(event.date), day))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Project schedules, milestones, and site events. Connect your API to populate events."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports' },
          { label: 'Calendar' },
        ]}
        actions={
          <PageHeaderAction
            label="Add Event"
            onClick={() =>
              toast.message('API ready', {
                description: 'Wire this action to POST /api/v1/calendar/events',
              })
            }
          />
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="font-display text-xl">
              {format(currentMonth, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(startOfMonth(new Date()))}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px rounded-lg border border-border bg-border overflow-hidden">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="bg-muted/60 px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {day}
                </div>
              ))}
              {days.map((day) => {
                const inMonth = isSameMonth(day, currentMonth)
                const selected = selectedDate ? isSameDay(day, selectedDate) : false
                const dayEvents = eventsOnDay(day)
                const isToday = isSameDay(day, new Date())

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'flex min-h-[72px] flex-col items-start gap-1 bg-card p-2 text-left transition-colors hover:bg-accent/50',
                      !inMonth && 'bg-muted/30 text-muted-foreground',
                      selected && 'ring-2 ring-inset ring-primary',
                      isToday && 'font-semibold'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-sm',
                        isToday && 'bg-primary text-primary-foreground'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'Events'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 || selectedEvents.length === 0 ? (
              <EmptyState
                title={events.length === 0 ? 'No events scheduled' : 'No events this day'}
                description={
                  events.length === 0
                    ? 'Calendar events will appear here once loaded from the API.'
                    : 'Select another day or add an event for this date.'
                }
                icon={<CalendarDays className="h-7 w-7" />}
                className="border-0 px-2 py-10 shadow-none"
              />
            ) : (
              <ul className="space-y-3">
                {selectedEvents.map((event) => (
                  <li
                    key={event.id}
                    className="rounded-lg border border-border bg-muted/20 px-3 py-2"
                  >
                    <p className="text-sm font-medium">{event.title}</p>
                    {event.type && (
                      <p className="text-xs text-muted-foreground">{event.type}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
