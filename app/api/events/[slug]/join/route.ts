import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { joinEventSchema } from '@/lib/validations/schemas'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const body = await req.json()
  const parsed = joinEventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { data: event } = await getAdminSupabase()
    .from('events')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  // Upsert participant (allow re-join with same nickname)
  const { data: participant, error } = await getAdminSupabase()
    .from('participants')
    .upsert(
      { event_id: event.id, nickname: parsed.data.nickname },
      { onConflict: 'event_id,nickname' }
    )
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ participant_id: participant.id })
}
