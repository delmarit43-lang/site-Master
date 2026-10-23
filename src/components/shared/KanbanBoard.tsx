import { CircleDashed, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'

export interface KanbanCard {
  id: string
  title: string
  description?: string
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
}

interface KanbanBoardProps {
  columns?: KanbanColumn[]
  className?: string
  onCardClick?: (card: KanbanCard) => void
  /** Move a card into another column (column id = target status) */
  onMoveCard?: (cardId: string, toColumnId: string) => void
}

const defaultColumns: KanbanColumn[] = [
  { id: 'Planning', title: 'Planning', cards: [] },
  { id: 'Active', title: 'Active', cards: [] },
  { id: 'On Hold', title: 'On Hold', cards: [] },
  { id: 'Completed', title: 'Completed', cards: [] },
]

export function KanbanBoard({
  columns = defaultColumns,
  className,
  onCardClick,
  onMoveCard,
}: KanbanBoardProps) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 xl:grid-cols-4', className)}>
      {columns.map((column) => (
        <Card key={column.id} className="flex min-h-[280px] flex-col bg-muted/30">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
            <Badge variant="secondary">{column.cards.length}</Badge>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3 pt-0">
            {column.cards.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/40 px-3 py-8 text-center">
                <CircleDashed className="mb-2 h-5 w-5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">No projects</p>
              </div>
            ) : (
              column.cards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-2xl border border-border bg-card p-3 shadow-sm transition hover:shadow-soft"
                >
                  <button
                    type="button"
                    onClick={() => onCardClick?.(card)}
                    className="w-full text-left"
                  >
                    <p className="text-sm font-medium text-foreground hover:text-primary">
                      {card.title}
                    </p>
                    {card.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {card.description}
                      </p>
                    )}
                  </button>

                  {onMoveCard && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {columns
                        .filter((col) => col.id !== column.id)
                        .map((col) => (
                          <Button
                            key={col.id}
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-[11px]"
                            onClick={() => onMoveCard(card.id, col.id)}
                          >
                            <ArrowRight className="h-3 w-3" />
                            {col.title}
                          </Button>
                        ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
