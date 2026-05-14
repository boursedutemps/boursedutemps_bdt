// src/app/api/onboarding/route.ts
// Gère les 3 étapes de l'onboarding : profil, compétence, finalisation

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function PATCH(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
    }

    const body = await req.json()
    const { uid, step } = body

    if (!uid) {
      return NextResponse.json({ error: 'uid manquant' }, { status: 400 })
    }

    // ── Étape 1 — Mise à jour du profil ────────────────────────────────────
    if (step === 1) {
      const { first_name, bio, country, avatar } = body

      if (!first_name || first_name.trim().length < 2) {
        return NextResponse.json(
          { error: 'Le prénom est obligatoire (min 2 caractères)' },
          { status: 400 }
        )
      }

      const updates: Record<string, unknown> = {
        first_name:      first_name.trim(),
        bio:             bio?.trim() || null,
        country:         country?.trim() || null,
        onboarding_step: 1,
        last_active_at:  new Date().toISOString(),
      }

      // N'écrase pas l'avatar existant si rien de nouveau n'est envoyé
      if (avatar) updates.avatar = avatar

      const { error } = await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('uid', uid)

      if (error) {
        console.error('[onboarding/step1]', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ ok: true, step: 1 })
    }

    // ── Étape 2 — Création du service / skip ───────────────────────────────
    if (step === 2) {
      const { skipped_skill, skill_title, skill_description, skill_category, skill_credit_cost } = body

      if (!skipped_skill) {
        // Validation
        if (!skill_title || skill_title.trim().length < 3) {
          return NextResponse.json(
            { error: 'Le titre doit faire au moins 3 caractères' },
            { status: 400 }
          )
        }
        if (!skill_description || skill_description.trim().length < 10) {
          return NextResponse.json(
            { error: 'La description doit faire au moins 10 caractères' },
            { status: 400 }
          )
        }
        if (!skill_category) {
          return NextResponse.json(
            { error: 'La catégorie est obligatoire' },
            { status: 400 }
          )
        }

        // Récupérer le nom de l'utilisateur pour services.user_name
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('first_name, name')
          .eq('uid', uid)
          .single()

        const userName = userData?.first_name || userData?.name || 'Membre'

        // Créer le service
        const { error: serviceError } = await supabaseAdmin
          .from('services')
          .insert({
            user_id:     uid,
            user_name:   userName,
            title:       skill_title.trim(),
            description: skill_description.trim(),
            category:    skill_category,
            credit_cost: skill_credit_cost || 1,
          })

        if (serviceError) {
          console.error('[onboarding/step2/service]', serviceError)
          return NextResponse.json({ error: serviceError.message }, { status: 500 })
        }

        // Attribuer le défi "Premier service" s'il existe
        const { data: challenge } = await supabaseAdmin
          .from('challenges')
          .select('id')
          .eq('condition_key', 'services_count')
          .eq('condition_value', '1')
          .single()

        if (challenge) {
          await supabaseAdmin
            .from('user_challenges')
            .upsert(
              {
                user_uid:     uid,
                challenge_id: challenge.id,
                progress:     1,
                completed_at: new Date().toISOString(),
              },
              { onConflict: 'user_uid,challenge_id', ignoreDuplicates: true }
            )
        }
      }

      // Mettre à jour le step
      const { error: stepError } = await supabaseAdmin
        .from('users')
        .update({
          onboarding_step: 2,
          last_active_at:  new Date().toISOString(),
        })
        .eq('uid', uid)

      if (stepError) {
        console.error('[onboarding/step2/update]', stepError)
        return NextResponse.json({ error: stepError.message }, { status: 500 })
      }

      return NextResponse.json({ ok: true, step: 2 })
    }

    // ── Étape 3 — Finalisation ─────────────────────────────────────────────
    if (step === 3 && body.completed) {
      const { error } = await supabaseAdmin
        .from('users')
        .update({
          onboarding_step:         3,
          onboarding_completed_at: new Date().toISOString(),
          last_active_at:          new Date().toISOString(),
        })
        .eq('uid', uid)

      if (error) {
        console.error('[onboarding/step3]', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Défi "Profil complet" : vérifier si avatar + bio + country sont renseignés
      const { data: profile } = await supabaseAdmin
        .from('users')
        .select('avatar, bio, country')
        .eq('uid', uid)
        .single()

      if (profile?.avatar && profile?.bio && profile?.country) {
        const { data: profileChallenge } = await supabaseAdmin
          .from('challenges')
          .select('id')
          .eq('condition_key', 'profile_complete')
          .single()

        if (profileChallenge) {
          await supabaseAdmin
            .from('user_challenges')
            .upsert(
              {
                user_uid:     uid,
                challenge_id: profileChallenge.id,
                progress:     1,
                completed_at: new Date().toISOString(),
              },
              { onConflict: 'user_uid,challenge_id', ignoreDuplicates: true }
            )
        }
      }

      return NextResponse.json({ ok: true, step: 3, completed: true })
    }

    return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })

  } catch (err: unknown) {
    console.error('[onboarding] Erreur inattendue:', err)
    return NextResponse.json(
      { error: 'Erreur serveur inattendue' },
      { status: 500 }
    )
  }
}

// ── GET — vérifier le statut d'onboarding ─────────────────────────────────────
export async function GET(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const uid = searchParams.get('uid')

  if (!uid) {
    return NextResponse.json({ error: 'uid manquant' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('onboarding_step, onboarding_completed_at')
    .eq('uid', uid)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    onboarding_step:         data?.onboarding_step ?? 0,
    onboarding_completed:    !!data?.onboarding_completed_at,
    onboarding_completed_at: data?.onboarding_completed_at ?? null,
  })
}
