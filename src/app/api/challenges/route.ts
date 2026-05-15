// src/app/api/challenges/route.ts
// Retourne les défis d'un utilisateur avec leur progression

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const uid = searchParams.get('uid')

  if (!uid) {
    return NextResponse.json({ error: 'uid manquant' }, { status: 400 })
  }

  try {
    // Récupérer tous les défis actifs
    const { data: allChallenges, error: challengesError } = await supabaseAdmin
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .order('id')

    if (challengesError) {
      return NextResponse.json({ error: challengesError.message }, { status: 500 })
    }

    // Récupérer la progression de l'utilisateur
    const { data: userChallenges } = await supabaseAdmin
      .from('user_challenges')
      .select('challenge_id, progress, completed_at')
      .eq('user_uid', uid)

    const progressMap = new Map(
      (userChallenges || []).map(uc => [uc.challenge_id, uc])
    )

    // Calculer la progression réelle depuis les données utilisateur
    // pour les défis non encore trackés
    const userStats = await getUserStats(uid)

    const challenges = (allChallenges || []).map(challenge => {
      const userChallenge = progressMap.get(challenge.id)
      const target = parseInt(challenge.condition_value || '1', 10)

      // Progression depuis user_challenges ou calculée
      let progress = userChallenge?.progress ?? 0

      // Auto-calcul si pas encore en base
      if (!userChallenge && userStats[challenge.condition_key] !== undefined) {
        progress = Math.min(target, userStats[challenge.condition_key])
      }

      return {
        id:             challenge.id,
        title:          challenge.title,
        description:    challenge.description,
        icon:           challenge.icon,
        credits_reward: challenge.credits_reward,
        type:           challenge.type,
        condition_key:  challenge.condition_key,
        target,
        progress,
        completed:      !!userChallenge?.completed_at || progress >= target,
      }
    })

    const completed = challenges.filter(c => c.completed).length

    return NextResponse.json({ challenges, completed, total: challenges.length })

  } catch (err: unknown) {
    console.error('[api/challenges]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ── Stats utilisateur pour auto-calcul de progression ────────────────────────

async function getUserStats(uid: string): Promise<Record<string, number>> {
  if (!supabaseAdmin) return {}

  try {
    const [servicesRes, connectionsRes, transactionsRes] = await Promise.allSettled([
      supabaseAdmin.from('services').select('id', { count: 'exact', head: true }).eq('user_id', uid),
      supabaseAdmin.from('connections').select('id', { count: 'exact', head: true })
        .or(`sender_id.eq.${uid},receiver_id.eq.${uid}`).eq('status', 'accepted'),
      supabaseAdmin.from('transactions').select('id', { count: 'exact', head: true })
        .or(`from_id.eq.${uid},to_id.eq.${uid}`),
    ])

    return {
      services_count:     servicesRes.status     === 'fulfilled' ? (servicesRes.value.count     ?? 0) : 0,
      connections_count:  connectionsRes.status  === 'fulfilled' ? (connectionsRes.value.count  ?? 0) : 0,
      exchanges_count:    transactionsRes.status === 'fulfilled' ? (transactionsRes.value.count ?? 0) : 0,
    }
  } catch {
    return {}
  }
}
