// src/app/api/badges/route.ts
// Calcule le score de réputation + badges d'un utilisateur

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const uid = searchParams.get('uid')
  if (!uid) return NextResponse.json({ error: 'uid manquant' }, { status: 400 })

  try {
    // ── Stats utilisateur en parallèle ────────────────────────────────────
    const [
      transactionsRes,
      connectionsRes,
      testimonialsRes,
      userRes,
      allBadgesRes,
      userBadgesRes,
    ] = await Promise.all([
      supabaseAdmin.from('transactions').select('id, from_user_id, to_user_id, type').or(`from_user_id.eq.${uid},to_user_id.eq.${uid}`),
      supabaseAdmin.from('connections').select('id').or(`sender_id.eq.${uid},receiver_id.eq.${uid}`).eq('status', 'accepted'),
      supabaseAdmin.from('testimonials').select('id, rating').eq('to_user_id', uid),
      supabaseAdmin.from('users').select('created_at, avatar, bio, country, onboarding_completed_at').eq('uid', uid).single(),
      supabaseAdmin.from('badges').select('*').eq('is_active', true),
      supabaseAdmin.from('user_badges').select('badge_id, earned_at').eq('user_uid', uid),
    ])

    const transactions    = transactionsRes.data  || []
    const connections     = connectionsRes.data   || []
    const testimonials    = testimonialsRes.data  || []
    const user            = userRes.data
    const allBadges       = allBadgesRes.data     || []
    const earnedBadgeIds  = new Set((userBadgesRes.data || []).map(b => b.badge_id))
    const earnedBadgeMeta = Object.fromEntries((userBadgesRes.data || []).map(b => [b.badge_id, b.earned_at]))

    // ── Calcul des stats ──────────────────────────────────────────────────
    const givenCount    = transactions.filter(t => t.from_user_id === uid).length
    const receivedCount = transactions.filter(t => t.to_user_id   === uid).length
    const exchangesCount = transactions.length

    const goodRatings   = testimonials.filter(t => (t.rating || 0) >= 4).length
    const avgRating     = testimonials.length > 0
      ? testimonials.reduce((acc, t) => acc + (t.rating || 0), 0) / testimonials.length
      : 0

    const profileScore = [
      user?.avatar,
      user?.bio,
      user?.country,
      user?.onboarding_completed_at,
    ].filter(Boolean).length * 25  // 25 pts par champ = 100 max

    const monthsSinceJoin = user?.created_at
      ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30))
      : 0

    // Catégories de services uniques (simplifié — on utilise les transactions)
    const categoriesCount = 1  // sera enrichi si on a la table services jointurée

    const stats: Record<string, number> = {
      exchanges_count:    exchangesCount,
      given_count:        givenCount,
      received_count:     receivedCount,
      connections_count:  connections.length,
      good_ratings_count: goodRatings,
      profile_score:      profileScore,
      months_since_join:  monthsSinceJoin,
      categories_count:   categoriesCount,
      testimonials_count: testimonials.length,
      avg_rating_x10:     Math.round(avgRating * 10),
    }

    // ── Score de réputation ───────────────────────────────────────────────
    const reputationScore =
      exchangesCount       * 10 +
      connections.length   *  5 +
      testimonials.length  * 15 +
      goodRatings          *  5 +
      (profileScore === 100 ? 20 : 0) +
      (user?.onboarding_completed_at ? 10 : 0)

    const reputationLevel =
      reputationScore >= 300 ? 'expert'  :
      reputationScore >= 150 ? 'or'      :
      reputationScore >= 50  ? 'argent'  : 'bronze'

    // ── Attribution des badges mérités ────────────────────────────────────
    const newlyEarned: number[] = []

    for (const badge of allBadges) {
      const statValue = stats[badge.condition_key] ?? 0
      const merited   = statValue >= badge.condition_value

      if (merited && !earnedBadgeIds.has(badge.id)) {
        // Attribuer le badge
        const { error } = await supabaseAdmin!
          .from('user_badges')
          .insert({ user_uid: uid, badge_id: badge.id })
          .select()
          .single()

        if (!error) {
          earnedBadgeIds.add(badge.id)
          newlyEarned.push(badge.id)
        }
      }
    }

    // Mettre à jour le score en base
    await supabaseAdmin
      .from('users')
      .update({ reputation_score: reputationScore, reputation_level: reputationLevel })
      .eq('uid', uid)

    // ── Construction de la réponse ────────────────────────────────────────
    const badges = allBadges.map(badge => ({
      ...badge,
      earned:    earnedBadgeIds.has(badge.id),
      earned_at: earnedBadgeMeta[badge.id] ?? null,
      progress:  Math.min(100, Math.round(((stats[badge.condition_key] ?? 0) / badge.condition_value) * 100)),
      current:   stats[badge.condition_key] ?? 0,
    }))

    return NextResponse.json({
      reputation_score: reputationScore,
      reputation_level: reputationLevel,
      stats,
      badges,
      newly_earned: newlyEarned,
      testimonials_count: testimonials.length,
      avg_rating: Math.round(avgRating * 10) / 10,
    })

  } catch (err: unknown) {
    console.error('[api/badges]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
