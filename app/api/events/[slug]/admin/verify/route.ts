import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { verifyAdminSchema } from '@/lib/validations/schemas'
import { signAdminToken } from '@/lib/admin-token'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await req.json()
    const parsed = verifyAdminSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { data: event, error } = await getAdminSupabase()
      .from('events')
      .select('id, password_hash')
      .eq('slug', slug)
      .single()

    if (error || !event) {
      return NextResponse.json({ error: '약속을 찾을 수 없어요' }, { status: 404 })
    }

    const ok = await bcrypt.compare(parsed.data.password, event.password_hash)
    if (!ok) {
      return NextResponse.json({ error: '비밀번호가 달라요' }, { status: 401 })
    }

    const token = await signAdminToken(event.id)
    return NextResponse.json({ token })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
