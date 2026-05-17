// src/app/api/sel/route.ts
// Interopérabilité avec les SEL physiques (Systèmes d'Échange Local)

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const uid     = searchParams.get('uid')
  const country = searchParams.get('country')

  try {
    // Lister les réseaux SEL disponibles
    let query = supabaseAdmin
      .from('sel_networks')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (country) query = query.eq('country', country)

    const { data: networks, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Si uid fourni, inclure les connexions de l'utilisateur
    if (uid) {
      const { data: connections } = await supabaseAdmin
        .from('sel_connections').select('*').eq('user_uid', uid)
      const connMap = Object.fromEntries((connections || []).map(c => [c.sel_id, c]))
      return NextResponse.json({
        networks: (networks || []).map(n => ({ ...n, connection: connMap[n.id] || null }))
      })
    }

    return NextResponse.json({ networks: networks || [] })
  } catch (err) {
    console.error('[sel/GET]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  try {
    const body = await req.json()
    const { action } = body

    // Lier un compte SEL à son profil BdT
    if (action === 'link') {
      const { user_uid, sel_id, sel_user_id, sel_balance } = body
      if (!user_uid || !sel_id) {
        return NextResponse.json({ error: 'user_uid et sel_id requis' }, { status: 400 })
      }

      const { data, error } = await supabaseAdmin.from('sel_connections')
        .upsert({ user_uid, sel_id, sel_user_id, sel_balance: sel_balance || 0 }, { onConflict: 'sel_id,user_uid' })
        .select().single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, connection: data })
    }

    // Convertir des crédits BdT ↔ SEL
    if (action === 'convert') {
      const { user_uid, sel_id, bdt_credits, direction } = body
      // direction: 'bdt_to_sel' ou 'sel_to_bdt'

      const { data: network } = await supabaseAdmin
        .from('sel_networks').select('exchange_rate, currency_name').eq('id', sel_id).single()
      if (!network) return NextResponse.json({ error: 'Réseau SEL introuvable' }, { status: 404 })

      const { data: user } = await supabaseAdmin
        .from('users').select('credits').eq('uid', user_uid).single()
      if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })

      if (direction === 'bdt_to_sel') {
        if ((user.credits || 0) < bdt_credits) {
          return NextResponse.json({ error: 'Crédits BdT insuffisants' }, { status: 400 })
        }
        const selAmount = bdt_credits * network.exchange_rate

        await supabaseAdmin.from('users')
          .update({ credits: (user.credits || 0) - bdt_credits }).eq('uid', user_uid)
        const { data: conn } = await supabaseAdmin.from('sel_connections')
          .select('sel_balance').eq('user_uid', user_uid).eq('sel_id', sel_id).single()
        await supabaseAdmin.from('sel_connections')
          .update({ sel_balance: (conn?.sel_balance || 0) + selAmount })
          .eq('user_uid', user_uid).eq('sel_id', sel_id)

        return NextResponse.json({
          ok: true,
          bdt_debited: bdt_credits,
          sel_credited: selAmount,
          currency: network.currency_name,
        })
      }

      return NextResponse.json({ error: 'Direction invalide' }, { status: 400 })
    }

    // Créer un nouveau réseau SEL (admin)
    if (action === 'create_network') {
      const { name, description, website, contact_email, country, city, currency_name, exchange_rate } = body
      const { data, error } = await supabaseAdmin.from('sel_networks').insert({
        name, description, website, contact_email, country, city,
        currency_name: currency_name || 'grain',
        exchange_rate: exchange_rate || 1.0,
      }).select().single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, network: data }, { status: 201 })
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
  } catch (err) {
    console.error('[sel/POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
