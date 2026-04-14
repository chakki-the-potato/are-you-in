import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { EventPageClient } from './EventPageClient'
import type { Event, EventDate, TimeOption, Participant, Vote, TimetableSlot, AltSuggestion } from '@/types'

async function getEventData(slug: string) {
  const { data: event, error } = await getAdminSupabase()
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !event) return null

  const [
    { data: eventDates },
    { data: options },
    { data: participants },
    { data: slots },
    { data: altSuggestions },
  ] = await Promise.all([
    getAdminSupabase().from('event_dates').select('*').eq('event_id', event.id).order('date'),
    getAdminSupabase().from('time_options').select('*').eq('event_id', event.id).order('priority'),
    getAdminSupabase().from('participants').select('*').eq('event_id', event.id),
    getAdminSupabase().from('timetable_slots').select('*').eq('event_id', event.id),
    getAdminSupabase().from('alt_suggestions').select('*').eq('event_id', event.id).order('created_at'),
  ])

  const optionIds = (options ?? []).map((o) => o.id)
  const { data: votes } = optionIds.length
    ? await getAdminSupabase().from('votes').select('*').in('option_id', optionIds)
    : { data: [] }

  return {
    event: event as Event,
    eventDates: (eventDates ?? []) as EventDate[],
    options: (options ?? []) as TimeOption[],
    participants: (participants ?? []) as Participant[],
    votes: (votes ?? []) as Vote[],
    slots: (slots ?? []) as TimetableSlot[],
    altSuggestions: (altSuggestions ?? []) as AltSuggestion[],
  }
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getEventData(slug)

  if (!data) notFound()

  return (
    <main className="min-h-screen">
      <nav className="border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <EventPageClient initialData={data} slug={slug} />
      </div>
    </main>
  )
}
