import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { altSuggestionSchema } from '@/lib/validations/schemas'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const body = await req.json()
  const parsed = altSuggestionSchema.safeParse(body)
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

  const { data: suggestion, error } = await getAdminSupabase()
    .from('alt_suggestions')
    .insert({
      event_id: event.id,
      participant_id: parsed.data.participant_id,
      suggested_start: parsed.data.suggested_start,
      suggested_end: parsed.data.suggested_end,
      note: parsed.data.note,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ suggestion })
}
