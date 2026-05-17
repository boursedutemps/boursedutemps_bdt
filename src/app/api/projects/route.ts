// src/app/api/projects/route.ts

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const slug   = searchParams.get('slug')
  const status = searchParams.get('status') || 'open'
  const uid    = searchParams.get('uid')

  try {
    if (slug) {
      const { data, error } = await supabaseAdmin
        .from('projects')
        .select(`*, project_contributions(user_uid, role, hours, users(first_name, name, avatar))`)
        .eq('slug', slug).single()
      if (error) return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 })
      return NextResponse.json(data)
    }

    let query = supabaseAdmin
      .from('projects')
      .select('id, slug, title, description, goal, icon, category, hours_goal, hours_contributed, members_count, members_limit, status, deadline, is_public, created_at')
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (status !== 'all') query = query.eq('status', status)
    if (uid) {
      const { data: myProjects } = await supabaseAdmin
        .from('project_contributions').select('project_id').eq('user_uid', uid)
      const ids = (myProjects || []).map(p => p.project_id)
      if (ids.length > 0) query = query.in('id', ids)
    }

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('[projects/GET]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  try {
    const body = await req.json()
    const { slug, title, description, goal, icon, category, hours_goal, members_limit, deadline, created_by, institution_id } = body

    if (!slug || !title || !description || !goal || !created_by) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({
        slug, title, description, goal,
        icon: icon || '🚀', category,
        hours_goal: hours_goal || 100,
        members_limit: members_limit || 50,
        deadline: deadline || null,
        created_by,
        institution_id: institution_id || null,
        status: 'open',
      })
      .select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Le créateur rejoint automatiquement comme leader
    await supabaseAdmin.from('project_contributions').insert({
      project_id: data.id, user_uid: created_by, role: 'leader', hours: 0,
    })

    return NextResponse.json({ ok: true, project: data }, { status: 201 })
  } catch (err) {
    console.error('[projects/POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  try {
    const body = await req.json()
    const { project_id, user_uid, action, hours, description: desc } = body

    if (action === 'join') {
      const { data: project } = await supabaseAdmin
        .from('projects').select('members_count, members_limit, status').eq('id', project_id).single()

      if (!project || project.status !== 'open') {
        return NextResponse.json({ error: 'Projet non disponible' }, { status: 400 })
      }
      if (project.members_count >= project.members_limit) {
        return NextResponse.json({ error: 'Projet complet' }, { status: 400 })
      }

      await supabaseAdmin.from('project_contributions')
        .upsert({ project_id, user_uid, role: 'contributor', hours: 0 }, { onConflict: 'project_id,user_uid' })

      await supabaseAdmin.from('projects')
        .update({ members_count: project.members_count + 1, status: 'in_progress' })
        .eq('id', project_id)

      return NextResponse.json({ ok: true, action: 'joined' })
    }

    if (action === 'contribute') {
      await supabaseAdmin.from('project_contributions')
        .update({ hours, description: desc })
        .eq('project_id', project_id).eq('user_uid', user_uid)

      // Recalculer les heures totales
      const { data: contribs } = await supabaseAdmin
        .from('project_contributions').select('hours').eq('project_id', project_id)
      const total = (contribs || []).reduce((a, c) => a + (c.hours || 0), 0)

      const { data: proj } = await supabaseAdmin
        .from('projects').select('hours_goal').eq('id', project_id).single()

      await supabaseAdmin.from('projects').update({
        hours_contributed: total,
        status: total >= (proj?.hours_goal || 9999) ? 'completed' : 'in_progress',
        completed_at: total >= (proj?.hours_goal || 9999) ? new Date().toISOString() : null,
      }).eq('id', project_id)

      return NextResponse.json({ ok: true, total_hours: total })
    }

    if (action === 'leave') {
      await supabaseAdmin.from('project_contributions')
        .update({ status: 'left' }).eq('project_id', project_id).eq('user_uid', user_uid)
      await supabaseAdmin.from('projects')
        .update({ members_count: supabaseAdmin.from('project_contributions').select('count') })
        .eq('id', project_id)
      return NextResponse.json({ ok: true, action: 'left' })
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
  } catch (err) {
    console.error('[projects/PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
