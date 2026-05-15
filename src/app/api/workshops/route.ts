// src/app/api/workshops/route.ts

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// ── GET — liste des ateliers ──────────────────────────────────────────────────
export async function GET(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const hostId   = searchParams.get('host_id')
  const status   = searchParams.get('status') || 'open'

  try {
    let query = supabaseAdmin
      .from('workshops')
      .select(`
        *,
        workshop_participants(count)
      `)
      .order('scheduled_at', { ascending: true })

    if (category) query = query.eq('category', category)
    if (hostId)   query = query.eq('host_id', hostId)
    if (status !== 'all') query = query.eq('status', status)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Calculer le nb de participants et si complet
    const workshops = (data || []).map(w => ({
      ...w,
      participants_count: w.workshop_participants?.[0]?.count || 0,
      is_full: (w.workshop_participants?.[0]?.count || 0) >= w.max_participants,
    }))

    return NextResponse.json(workshops)
  } catch (err: unknown) {
    console.error('[workshops/GET]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ── POST — créer un atelier ───────────────────────────────────────────────────
export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const {
      host_id, host_name, host_avatar,
      title, description, category, skill_tags,
      max_participants, credit_cost, scheduled_at,
      duration_min, format, location,
    } = body

    if (!host_id || !title || !description || !category) {
      return NextResponse.json(
        { error: 'host_id, title, description et category sont requis' },
        { status: 400 }
      )
    }
    if (title.trim().length < 5) {
      return NextResponse.json({ error: 'Titre trop court (min 5 caractères)' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('workshops')
      .insert({
        host_id,
        host_name,
        host_avatar:      host_avatar || null,
        title:            title.trim(),
        description:      description.trim(),
        category,
        skill_tags:       skill_tags || [],
        max_participants: max_participants || 10,
        credit_cost:      credit_cost || 1,
        scheduled_at:     scheduled_at || null,
        duration_min:     duration_min || 60,
        format:           format || 'en_ligne',
        location:         location || null,
        status:           'open',
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, workshop: data }, { status: 201 })
  } catch (err: unknown) {
    console.error('[workshops/POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ── PATCH — rejoindre / quitter un atelier ────────────────────────────────────
export async function PATCH(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const { workshop_id, user_id, user_name, action } = body

    if (!workshop_id || !user_id || !action) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    if (action === 'join') {
      // Vérifier si pas déjà complet
      const { data: workshop } = await supabaseAdmin
        .from('workshops')
        .select('max_participants, status')
        .eq('id', workshop_id)
        .single()

      if (!workshop || workshop.status !== 'open') {
        return NextResponse.json({ error: 'Atelier non disponible' }, { status: 400 })
      }

      const { count } = await supabaseAdmin
        .from('workshop_participants')
        .select('*', { count: 'exact', head: true })
        .eq('workshop_id', workshop_id)

      if ((count || 0) >= workshop.max_participants) {
        await supabaseAdmin.from('workshops').update({ status: 'full' }).eq('id', workshop_id)
        return NextResponse.json({ error: 'Atelier complet' }, { status: 400 })
      }

      const { error } = await supabaseAdmin
        .from('workshop_participants')
        .upsert({ workshop_id, user_id, user_name }, { onConflict: 'workshop_id,user_id' })

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // Marquer complet si max atteint
      if ((count || 0) + 1 >= workshop.max_participants) {
        await supabaseAdmin.from('workshops').update({ status: 'full' }).eq('id', workshop_id)
      }

      return NextResponse.json({ ok: true, action: 'joined' })
    }

    if (action === 'leave') {
      await supabaseAdmin
        .from('workshop_participants')
        .update({ status: 'cancelled' })
        .eq('workshop_id', workshop_id)
        .eq('user_id', user_id)

      // Remettre open si était full
      await supabaseAdmin
        .from('workshops')
        .update({ status: 'open' })
        .eq('id', workshop_id)
        .eq('status', 'full')

      return NextResponse.json({ ok: true, action: 'left' })
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
  } catch (err: unknown) {
    console.error('[workshops/PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
