// src/app/api/modules/route.ts

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const slug        = searchParams.get('slug')
  const category    = searchParams.get('category')
  const featured    = searchParams.get('featured') === '1'
  const institution = searchParams.get('institution_id')

  try {
    if (slug) {
      const { data, error } = await supabaseAdmin
        .from('modules')
        .select(`*, module_services(service_id, services(*))`)
        .eq('slug', slug)
        .eq('status', 'active')
        .single()
      if (error) return NextResponse.json({ error: 'Module introuvable' }, { status: 404 })
      return NextResponse.json(data)
    }

    let query = supabaseAdmin
      .from('modules')
      .select('id, slug, title, description, icon, cover_url, category, tags, services_count, members_count, is_featured')
      .eq('status', 'active')
      .eq('is_public', true)
      .order('is_featured', { ascending: false })
      .order('services_count', { ascending: false })

    if (category)    query = query.eq('category', category)
    if (featured)    query = query.eq('is_featured', true)
    if (institution) query = query.eq('institution_id', parseInt(institution))

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('[modules/GET]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  try {
    const body = await req.json()
    const { slug, title, description, icon, category, tags, institution_id, created_by, cover_url } = body

    if (!slug || !title || !description || !category || !created_by) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('modules')
      .insert({ slug, title, description, icon: icon || '📚', category, tags: tags || [], institution_id: institution_id || null, created_by, cover_url: cover_url || null })
      .select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, module: data }, { status: 201 })
  } catch (err) {
    console.error('[modules/POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// Ajouter/retirer un service d'un module
export async function PATCH(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  try {
    const { module_id, service_id, action, added_by } = await req.json()

    if (action === 'add_service') {
      await supabaseAdmin.from('module_services').upsert({ module_id, service_id, added_by }, { onConflict: 'module_id,service_id' })
      await supabaseAdmin.rpc('increment', { table: 'modules', column: 'services_count', row_id: module_id }).catch(() => {})
    }

    if (action === 'remove_service') {
      await supabaseAdmin.from('module_services').delete().eq('module_id', module_id).eq('service_id', service_id)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[modules/PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
