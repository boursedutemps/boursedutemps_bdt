// src/app/api/sponsorships/route.ts

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const uid      = searchParams.get('uid')
  const category = searchParams.get('category')

  try {
    let query = supabaseAdmin
      .from('sponsorships')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Si uid fourni, marquer ceux déjà utilisés
    if (uid && data) {
      const ids = data.map(s => s.id)
      const { data: uses } = await supabaseAdmin
        .from('sponsorship_uses').select('sponsorship_id').eq('user_uid', uid).in('sponsorship_id', ids)
      const usedIds = new Set((uses || []).map(u => u.sponsorship_id))
      return NextResponse.json(data.map(s => ({ ...s, already_used: usedIds.has(s.id) })))
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('[sponsorships/GET]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  try {
    const body = await req.json()
    const { action } = body

    // Créer un mécénat
    if (action === 'create') {
      const { sponsor_name, sponsor_logo, sponsor_website, title, description, category, hours_offered, credit_value, beneficiary_type, institution_id, starts_at, ends_at, sponsor_uid } = body
      if (!sponsor_name || !title || !hours_offered) {
        return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
      }
      const { data, error } = await supabaseAdmin.from('sponsorships').insert({
        sponsor_name, sponsor_logo, sponsor_website, title, description, category,
        hours_offered, credit_value: credit_value || 10,
        beneficiary_type: beneficiary_type || 'all',
        institution_id: institution_id || null,
        starts_at, ends_at, sponsor_uid: sponsor_uid || null,
        status: 'active',
      }).select().single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, sponsorship: data }, { status: 201 })
    }

    // Utiliser un mécénat (bénéficiaire)
    if (action === 'use') {
      const { sponsorship_id, user_uid, hours } = body
      const { data: sponsorship } = await supabaseAdmin
        .from('sponsorships').select('hours_offered, hours_used, credit_value, status').eq('id', sponsorship_id).single()

      if (!sponsorship || sponsorship.status !== 'active') {
        return NextResponse.json({ error: 'Mécénat non disponible' }, { status: 400 })
      }
      if (sponsorship.hours_used >= sponsorship.hours_offered) {
        return NextResponse.json({ error: 'Heures épuisées' }, { status: 400 })
      }

      const { error: useError } = await supabaseAdmin.from('sponsorship_uses')
        .upsert({ sponsorship_id, user_uid, hours_used: hours || 1 }, { onConflict: 'sponsorship_id,user_uid' })

      if (useError) return NextResponse.json({ error: useError.message }, { status: 500 })

      // Incrémenter hours_used
      const newHours = sponsorship.hours_used + (hours || 1)
      await supabaseAdmin.from('sponsorships').update({
        hours_used: newHours,
        status: newHours >= sponsorship.hours_offered ? 'completed' : 'active',
      }).eq('id', sponsorship_id)

      // Créditer l'utilisateur
      const { data: user } = await supabaseAdmin.from('users').select('credits').eq('uid', user_uid).single()
      if (user) {
        await supabaseAdmin.from('users')
          .update({ credits: (user.credits || 0) + sponsorship.credit_value })
          .eq('uid', user_uid)
      }

      return NextResponse.json({ ok: true, credits_added: sponsorship.credit_value })
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
  } catch (err) {
    console.error('[sponsorships/POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
