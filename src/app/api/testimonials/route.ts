// src/app/api/testimonials/route.ts
// Témoignages liés aux échanges avec notation

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// ── GET — liste des témoignages ────────────────────────────────────────────────
export async function GET(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const toUserId  = searchParams.get('to_user_id')
  const authorId  = searchParams.get('author_id')
  const limit     = parseInt(searchParams.get('limit') || '20', 10)

  try {
    let query = supabaseAdmin
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (toUserId)  query = query.eq('to_user_id', toUserId)
    if (authorId)  query = query.eq('author_id', authorId)

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data || [])
  } catch (err: unknown) {
    console.error('[testimonials/GET]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ── POST — créer un témoignage ────────────────────────────────────────────────
export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const {
      author_id, author_name, author_avatar,
      to_user_id, rating, title, content, transaction_id,
    } = body

    // Validation
    if (!author_id || !to_user_id) {
      return NextResponse.json({ error: 'author_id et to_user_id requis' }, { status: 400 })
    }
    if (!content || content.trim().length < 20) {
      return NextResponse.json({ error: 'Témoignage trop court (min 20 caractères)' }, { status: 400 })
    }
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'Note invalide (1-5)' }, { status: 400 })
    }
    if (author_id === to_user_id) {
      return NextResponse.json({ error: 'Impossible de se noter soi-même' }, { status: 400 })
    }

    // Vérifier si déjà noté pour cette transaction
    if (transaction_id) {
      const { data: existing } = await supabaseAdmin
        .from('testimonials')
        .select('id')
        .eq('author_id', author_id)
        .eq('transaction_id', transaction_id)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: 'Vous avez déjà laissé un témoignage pour cet échange' },
          { status: 409 }
        )
      }
    }

    // Insérer le témoignage
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert({
        author_id,
        author_name,
        author_avatar: author_avatar || null,
        to_user_id,
        rating:        rating || null,
        title:         title?.trim() || null,
        content:       content.trim(),
        transaction_id: transaction_id || null,
        media:         [],
        likes:         [],
      })
      .select()
      .single()

    if (error) {
      console.error('[testimonials/POST]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Mettre à jour last_active_at du destinataire
    await supabaseAdmin
      .from('users')
      .update({ last_active_at: new Date().toISOString() })
      .eq('uid', to_user_id)

    return NextResponse.json({ ok: true, testimonial: data }, { status: 201 })

  } catch (err: unknown) {
    console.error('[testimonials/POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
