import { Badge } from '@/components/ui/badge'
import type { Event, EventDate } from '@/types'

const STATUS_CONFIG = {
  open: { label: '투표 진행 중', variant: 'secondary' as const },
  confirmed: { label: '확정됨', variant: 'default' as const },
  closed: { label: '종료', variant: 'outline' as const },
}

function formatKoreanDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-')
  return `${Number(m)}월 ${Number(d)}일`
}

interface EventHeaderProps {
  event: Event
  eventDates: EventDate[]
  participantCount: number
}

export function EventHeader({ event, eventDates, participantCount }: EventHeaderProps) {
  const status = STATUS_CONFIG[event.status]
  const isConfirmable = participantCount >= event.min_participants && event.status === 'open'

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-2xl font-bold leading-tight">{event.title}</h1>
        <Badge variant={status.variant} className="flex-shrink-0 mt-1">
          {status.label}
        </Badge>
      </div>

      {event.description && (
        <p className="text-sm text-muted-foreground">{event.description}</p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {eventDates.length > 0 && (
          <span>
            📅{' '}
            {eventDates.length === 1
              ? `${formatKoreanDate(eventDates[0].date)} (${eventDates[0].range_start.slice(0, 5)}~${eventDates[0].range_end.slice(0, 5)})`
              : `${eventDates.length}개 날짜`}
          </span>
        )}
        <span>
          👥 {participantCount}명 참여
          {event.status === 'open' && (
            <span className="ml-1 text-xs">(최소 {event.min_participants}명)</span>
          )}
        </span>
        <span>주최: {event.creator_nickname}</span>
      </div>

      {/* Show all dates if multiple */}
      {eventDates.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {eventDates.map((ed) => (
            <span
              key={ed.id}
              className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded px-2 py-0.5"
            >
              {formatKoreanDate(ed.date)} {ed.range_start.slice(0, 5)}~{ed.range_end.slice(0, 5)}
            </span>
          ))}
        </div>
      )}

      {isConfirmable && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-sm text-indigo-700">
          최소 인원을 달성했습니다! 생성자가 확정할 수 있어요.
        </div>
      )}
    </div>
  )
}
