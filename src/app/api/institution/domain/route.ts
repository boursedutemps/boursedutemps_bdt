// src/app/api/institution/domain/route.ts
// Résout un domaine custom → slug institution (utilisé par le middleware)

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const domain = searchParams.get('domain')
  if (!domain) return NextResponse.json({ error: 'domain requis' }, { status: 400 })

  try {
    const { data } = await supabaseAdmin
      .from('institution_domains')
      .select('institution_id, institutions(slug, status)')
      .eq('domain', domain.toLowerCase())
      .single()

    if (!data) return NextResponse.json({ slug: null }, { status: 404 })

    const inst = Array.isArray(data.institutions) ? data.institutions[0] : data.institutions
    if (!inst || inst.status !== 'active') {
      return NextResponse.json({ slug: null }, { status: 404 })
    }

    return NextResponse.json({ slug: inst.slug })
  } catch {
    return NextResponse.json({ slug: null }, { status: 404 })
  }
}
