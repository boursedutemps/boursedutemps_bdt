// src/app/api/review-prompts/route.ts
// Gère les invitations d'avis mutuels post-échange

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { query } from '@/lib/db'  // ← users sont en PostgreSQL direct, pas Supabase

// ── GET — avis en attente pour un utilisateur ─────────────────────────────────
export async function GET(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const uid = searchParams.get('uid')
  if (!uid) return NextResponse.json({ error: 'uid manquant' }, { status: 400 })

  try {
    const { data, error } = await supabaseAdmin
      .from('review_prompts')
      .select('id, transaction_id, reviewee_id, completed')
      .eq('reviewer_id', uid)
      .eq('completed', false)
      .order('created_at', { ascending: true })
      .limit(5)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Enrichir avec le nom/avatar depuis PostgreSQL direct (les users ne sont PAS dans Supabase)
    const enriched = await Promise.all(
      (data || []).map(async prompt => {
        const revieweeRes = await query(
          'SELECT uid, first_name, last_name, avatar FROM users WHERE uid = $1',
          [prompt.reviewee_id]
        )
        const reviewee = revieweeRes.rows[0] ?? null
        return {
          ...prompt,
          reviewee_name:   reviewee
            ? `${reviewee.first_name ?? ''} ${reviewee.last_name ?? ''}`.trim() || 'Membre'
            : 'Membre',
          reviewee_avatar: reviewee?.avatar ?? null,
        }
      })
    )

    return NextResponse.json(enriched)
  } catch (err: unknown) {
    console.error('[review-prompts/GET]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ── POST — créer des review prompts après un échange ─────────────────────────
// (appelé depuis transactions/route.ts en interne — conservé pour usage direct)
export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  try {
    const { transaction_id, from_user_id, to_user_id } = await req.json()

    if (!transaction_id || !from_user_id || !to_user_id) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('review_prompts')
      .upsert([
        { transaction_id, reviewer_id: from_user_id, reviewee_id: to_user_id },
        { transaction_id, reviewer_id: to_user_id,   reviewee_id: from_user_id },
      ], { onConflict: 'transaction_id,reviewer_id', ignoreDuplicates: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error('[review-prompts/POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ── PATCH — marquer un avis comme complété ────────────────────────────────────
export async function PATCH(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  try {
    const { id, completed } = await req.json()
    if (!id) return NextResponse.json({ error: 'id manquant' }, { status: 400 })

    const { error } = await supabaseAdmin
      .from('review_prompts')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, completed })
  } catch (err: unknown) {
    console.error('[review-prompts/PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
