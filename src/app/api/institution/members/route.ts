// src/app/api/institution/members/route.ts
// Membres d'une institution avec leurs infos profil

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const slug         = searchParams.get('slug')
  const institutionId = searchParams.get('institution_id')

  if (!slug && !institutionId) {
    return NextResponse.json({ error: 'slug ou institution_id requis' }, { status: 400 })
  }

  try {
    let instId = institutionId ? parseInt(institutionId) : null

    if (!instId && slug) {
      const { data } = await supabaseAdmin
        .from('institutions').select('id').eq('slug', slug).single()
      instId = data?.id ?? null
    }

    if (!instId) return NextResponse.json({ error: 'Institution introuvable' }, { status: 404 })

    const { data, error } = await supabaseAdmin
      .from('institution_members')
      .select(`
        user_uid, role, department, joined_at, status,
        users(first_name, name, avatar, bio, country, offered_skills, verification_level, reputation_score)
      `)
      .eq('institution_id', instId)
      .eq('status', 'active')
      .order('joined_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('[institution/members]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ── PATCH — modifier le rôle d'un membre ─────────────────────────────────────
export async function PATCH(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  try {
    const { institution_id, user_uid, role, action, admin_uid } = await req.json()

    // Vérifier que l'appelant est admin de l'institution
    const { data: caller } = await supabaseAdmin
      .from('institution_members')
      .select('role')
      .eq('institution_id', institution_id)
      .eq('user_uid', admin_uid)
      .single()

    if (!caller || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    if (action === 'update_role') {
      await supabaseAdmin
        .from('institution_members')
        .update({ role })
        .eq('institution_id', institution_id)
        .eq('user_uid', user_uid)
    }

    if (action === 'remove') {
      await supabaseAdmin
        .from('institution_members')
        .update({ status: 'left' })
        .eq('institution_id', institution_id)
        .eq('user_uid', user_uid)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[institution/members PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
