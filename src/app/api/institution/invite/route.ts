// src/app/api/institution/invite/route.ts
// Gestion des tokens d'invitation + inscription membres

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import crypto from 'crypto'

// ── GET — valider un token d'invitation ───────────────────────────────────────
export async function GET(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'token requis' }, { status: 400 })

  try {
    const { data } = await supabaseAdmin
      .from('institution_invite_tokens')
      .select(`*, institutions(id, slug, name, logo_url, primary_color, description)`)
      .eq('token', token)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (!data) return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 404 })
    if (data.uses_count >= data.max_uses) {
      return NextResponse.json({ error: 'Ce lien d\'invitation a atteint sa limite d\'utilisations' }, { status: 410 })
    }

    const inst = Array.isArray(data.institutions) ? data.institutions[0] : data.institutions
    return NextResponse.json({ valid: true, institution: inst })
  } catch {
    return NextResponse.json({ error: 'Token invalide' }, { status: 404 })
  }
}

// ── POST — créer un token ou rejoindre via token ──────────────────────────────
export async function POST(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  try {
    const body = await req.json()
    const { action } = body

    // Créer un token d'invitation
    if (action === 'create_token') {
      const { institution_id, created_by, max_uses, days_valid } = body

      // Vérifier que l'appelant est admin de l'institution
      const { data: member } = await supabaseAdmin
        .from('institution_members')
        .select('role')
        .eq('institution_id', institution_id)
        .eq('user_uid', created_by)
        .single()

      if (!member || !['admin', 'moderator'].includes(member.role)) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }

      const token   = crypto.randomBytes(16).toString('hex')
      const expires = new Date()
      expires.setDate(expires.getDate() + (days_valid || 30))

      const { data, error } = await supabaseAdmin
        .from('institution_invite_tokens')
        .insert({
          institution_id,
          token,
          created_by,
          max_uses:   max_uses || 100,
          expires_at: expires.toISOString(),
        })
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, token: data.token })
    }

    // Rejoindre via token
    if (action === 'join') {
      const { token, user_uid, department, student_id } = body

      const { data: invite } = await supabaseAdmin
        .from('institution_invite_tokens')
        .select('*, institutions(id, slug, name, status)')
        .eq('token', token)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (!invite) return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 404 })
      if (invite.uses_count >= invite.max_uses) {
        return NextResponse.json({ error: 'Lien expiré (limite atteinte)' }, { status: 410 })
      }

      const inst = Array.isArray(invite.institutions) ? invite.institutions[0] : invite.institutions
      if (!inst || inst.status !== 'active') {
        return NextResponse.json({ error: 'Institution non disponible' }, { status: 400 })
      }

      // Vérifier si déjà membre
      const { data: existing } = await supabaseAdmin
        .from('institution_members')
        .select('id')
        .eq('institution_id', inst.id)
        .eq('user_uid', user_uid)
        .single()

      if (existing) {
        return NextResponse.json({ ok: true, already_member: true, slug: inst.slug })
      }

      // Ajouter comme membre
      const { error: memberError } = await supabaseAdmin
        .from('institution_members')
        .insert({
          institution_id: inst.id,
          user_uid,
          role:           'member',
          department:     department || null,
          student_id:     student_id || null,
          invite_token:   token,
        })

      if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 })

      // Incrémenter uses_count
      await supabaseAdmin
        .from('institution_invite_tokens')
        .update({ uses_count: invite.uses_count + 1 })
        .eq('token', token)

      // Mettre à jour institution principale si pas définie
      await supabaseAdmin
        .from('users')
        .update({ primary_institution_id: inst.id })
        .eq('uid', user_uid)
        .is('primary_institution_id', null)

      return NextResponse.json({ ok: true, slug: inst.slug })
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
  } catch (err) {
    console.error('[institution/invite]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
