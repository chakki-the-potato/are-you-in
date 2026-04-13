import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const { data: event, error: eventError } = await getAdminSupabase()
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (eventError || !event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

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
    getAdminSupabase().from('alt_suggestions').select('*').eq('event_id', event.id),
  ])

  const optionIds = (options ?? []).map((o) => o.id)
  const { data: votes } = optionIds.length
    ? await getAdminSupabase().from('votes').select('*').in('option_id', optionIds)
    : { data: [] }

  return NextResponse.json({
    event,
    eventDates: eventDates ?? [],
    options: options ?? [],
    participants: participants ?? [],
    votes: votes ?? [],
    slots: slots ?? [],
    altSuggestions: altSuggestions ?? [],
  })
}
