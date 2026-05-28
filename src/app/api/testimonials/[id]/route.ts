// src/app/api/testimonials/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!supabaseAdmin)
    return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  try {
    const body = await req.json()
    const update: Record<string, unknown> = {}

    if (body.likes !== undefined)  update.likes  = body.likes
    if (body.shares !== undefined) update.shares = body.shares

    if (Object.keys(update).length === 0)
      return NextResponse.json({ error: 'Rien à mettre à jour' }, { status: 400 })

    const { error } = await supabaseAdmin
      .from('testimonials')
      .update(update)
      .eq('id', parseInt(params.id, 10))

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[testimonials/[id] PATCH]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
