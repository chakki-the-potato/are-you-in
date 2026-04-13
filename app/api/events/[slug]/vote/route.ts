import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { voteSchema } from '@/lib/validations/schemas'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const body = await req.json()
  const parsed = voteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { option_id, participant_id, response } = parsed.data

  // Validate participant belongs to this event
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

  const { data: vote, error } = await getAdminSupabase()
    .from('votes')
    .upsert({ option_id, participant_id, response }, { onConflict: 'option_id,participant_id' })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ vote })
}
