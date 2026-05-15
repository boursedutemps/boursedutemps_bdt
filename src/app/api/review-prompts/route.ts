// src/app/api/review-prompts/route.ts
// Gère les invitations d'avis mutuels post-échange

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

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
      .select(`
        id,
        transaction_id,
        reviewee_id,
        completed
      `)
      .eq('reviewer_id', uid)
      .eq('completed', false)
      .order('created_at', { ascending: true })
      .limit(5)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Enrichir avec le nom de la personne à évaluer
    const enriched = await Promise.all(
      (data || []).map(async prompt => {
        const { data: reviewee } = await supabaseAdmin!
          .from('users')
          .select('uid, first_name, name, avatar')
          .eq('uid', prompt.reviewee_id)
          .single()

        return {
          ...prompt,
          reviewee_name:   reviewee?.first_name || reviewee?.name || 'Membre',
          reviewee_avatar: reviewee?.avatar || null,
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
export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  try {
    const { transaction_id, from_user_id, to_user_id } = await req.json()

    if (!transaction_id || !from_user_id || !to_user_id) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    // Créer 2 prompts (mutuel)
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
