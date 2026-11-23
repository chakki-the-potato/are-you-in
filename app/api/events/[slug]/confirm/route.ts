import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { confirmEventSchema } from '@/lib/validations/schemas'
import { verifyAdminToken } from '@/lib/admin-token'

function readBearer(req: NextRequest): string | null {
  const h = req.headers.get('authorization')
  if (!h?.startsWith('Bearer ')) return null
  return h.slice('Bearer '.length).trim() || null
}

async function loadEvent(slug: string) {
  return await getAdminSupabase()
    .from('events')
    .select('id')
    .eq('slug', slug)
    .single()
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const token = readBearer(req)
    if (!token) {
      return NextResponse.json({ error: '관리자 인증 필요' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = confirmEventSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { data: event, error } = await loadEvent(slug)
    if (error || !event) {
      return NextResponse.json({ error: '약속을 찾을 수 없어요' }, { status: 404 })
    }

    const ok = await verifyAdminToken(token, event.id)
    if (!ok) {
      return NextResponse.json({ error: '관리자 세션이 만료됐어요' }, { status: 401 })
    }

    // Validate option belongs to this event
    const { data: option } = await getAdminSupabase()
      .from('time_options')
      .select('id')
      .eq('id', parsed.data.option_id)
      .eq('event_id', event.id)
      .single()

    if (!option) {
      return NextResponse.json({ error: '잘못된 옵션입니다' }, { status: 400 })
    }

    const { error: updateError } = await getAdminSupabase()
      .from('events')
      .update({
        status: 'confirmed',
        confirmed_option_id: option.id,
      })
      .eq('id', event.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const token = readBearer(req)
    if (!token) {
      return NextResponse.json({ error: '관리자 인증 필요' }, { status: 401 })
    }

    const { data: event, error } = await loadEvent(slug)
    if (error || !event) {
      return NextResponse.json({ error: '약속을 찾을 수 없어요' }, { status: 404 })
    }

    const ok = await verifyAdminToken(token, event.id)
    if (!ok) {
      return NextResponse.json({ error: '관리자 세션이 만료됐어요' }, { status: 401 })
    }

    const { error: updateError } = await getAdminSupabase()
      .from('events')
      .update({
        status: 'open',
        confirmed_option_id: null,
      })
      .eq('id', event.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
