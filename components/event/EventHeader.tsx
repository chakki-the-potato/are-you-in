import { Calendar, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Event, EventDate } from '@/types'

function formatKoreanDate(dateStr: string): string {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const d = new Date(`${dateStr}T00:00:00`)
  return `${d.getMonth() + 1}/${d.getDate()} (${days[d.getDay()]})`
}

interface EventHeaderProps {
  event: Event
  eventDates: EventDate[]
  participantCount: number
}

export function EventHeader({ event, eventDates, participantCount }: EventHeaderProps) {
  return (
    <div>
      <h1 className="text-[clamp(24px,3.5vw,30px)] font-extrabold tracking-tight mb-2 text-balance">
        {event.title}
      </h1>
      {event.description && (
        <p className="text-muted-foreground text-[14.5px] leading-[1.55] mb-3">{event.description}</p>
      )}
      <div className="flex flex-wrap gap-1.5 items-center">
        {eventDates.map((d) => (
          <Badge key={d.id} variant="muted" className="gap-1 h-6 px-2.5">
            <Calendar className="size-3" />
            {formatKoreanDate(d.date)}
          </Badge>
        ))}
        <Badge variant="muted" className="gap-1 h-6 px-2.5">
          <Users className="size-3" />
          {participantCount}명
        </Badge>
        <Badge variant="muted" className="h-6 px-2.5">주최: {event.creator_nickname}</Badge>
      </div>
    </div>
  )
}
