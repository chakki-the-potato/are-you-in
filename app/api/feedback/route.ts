import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { feedbackSchema } from '@/lib/validations/schemas'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = feedbackSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { name, category, message } = parsed.data

    const { error } = await getAdminSupabase()
      .from('feedback')
      .insert({ name: name ?? null, category, message })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
