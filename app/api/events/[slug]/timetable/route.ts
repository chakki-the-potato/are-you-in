import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { timetableSchema } from '@/lib/validations/schemas'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const body = await req.json()
  const parsed = timetableSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { participant_id, slots } = parsed.data

  const { data: event } = await getAdminSupabase()
    .from('events')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  const { data: participant } = await getAdminSupabase()
    .from('participants')
    .select('id')
    .eq('id', participant_id)
    .eq('event_id', event.id)
    .single()

  if (!participant) {
    return NextResponse.json({ error: 'Participant not found' }, { status: 403 })
  }

  // Re-save pattern: delete existing slots then bulk insert
  await getAdminSupabase()
    .from('timetable_slots')
    .delete()
    .eq('participant_id', participant_id)
    .eq('event_id', event.id)

  if (slots.length > 0) {
    const { error } = await getAdminSupabase().from('timetable_slots').insert(
      slots.map((slot) => ({
        event_id: event.id,
        participant_id,
        slot_start: slot.slot_start,
        slot_end: slot.slot_end,
      }))
    )
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
