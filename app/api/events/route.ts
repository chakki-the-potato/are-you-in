import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { generateSlug } from '@/lib/utils/slug'
import { createEventSchema } from '@/lib/validations/schemas'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createEventSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { title, description, creator_nickname, dates, time_options } = parsed.data

    const slug = generateSlug(title)

    // Insert event
    const { data: event, error: eventError } = await getAdminSupabase()
      .from('events')
      .insert({ title, description, creator_nickname, slug })
      .select()
      .single()

    if (eventError) {
      return NextResponse.json({ error: eventError.message }, { status: 500 })
    }

    // Insert event dates (날짜별 시간대)
    const { error: datesError } = await getAdminSupabase()
      .from('event_dates')
      .insert(dates.map((d) => ({ event_id: event.id, ...d })))

    if (datesError) {
      return NextResponse.json({ error: datesError.message }, { status: 500 })
    }

    // Insert time options if provided
    if (time_options && time_options.length > 0) {
      const { error: optionsError } = await getAdminSupabase()
        .from('time_options')
        .insert(time_options.map((o) => ({ event_id: event.id, ...o })))

      if (optionsError) {
        return NextResponse.json({ error: optionsError.message }, { status: 500 })
      }
    }

    // Insert creator as participant
    const { data: creator, error: participantError } = await getAdminSupabase()
      .from('participants')
      .insert({ event_id: event.id, nickname: creator_nickname, is_creator: true })
      .select()
      .single()

    if (participantError) {
      return NextResponse.json({ error: participantError.message }, { status: 500 })
    }

    return NextResponse.json(
      { slug, event_id: event.id, participant_id: creator.id },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
