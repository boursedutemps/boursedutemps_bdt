// src/app/api/institution/route.ts
// CRUD principal des institutions

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// ── GET — liste ou détail d'une institution ───────────────────────────────────
export async function GET(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const slug   = searchParams.get('slug')
  const status = searchParams.get('status') || 'active'
  const all    = searchParams.get('all') === '1'

  try {
    if (slug) {
      const { data, error } = await supabaseAdmin
        .from('institutions')
        .select(`*, institution_domains(domain, is_primary, verified)`)
        .eq('slug', slug)
        .single()

      if (error || !data) return NextResponse.json({ error: 'Institution introuvable' }, { status: 404 })
      return NextResponse.json(data)
    }

    let query = supabaseAdmin
      .from('institutions')
      .select('id, slug, name, logo_url, primary_color, type, status, members_count, country')
      .order('name')

    if (!all) query = query.eq('status', status)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('[institution/GET]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ── POST — demande de création d'institution ──────────────────────────────────
export async function POST(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  try {
    const body = await req.json()
    const {
      slug, name, description, logo_url, cover_url,
      primary_color, secondary_color, website,
      contact_email, contact_phone, address, country, type,
      admin_uid, custom_domain,
    } = body

    if (!slug || !name || !contact_email || !admin_uid) {
      return NextResponse.json(
        { error: 'slug, name, contact_email et admin_uid requis' },
        { status: 400 }
      )
    }

    // Vérifier que le slug est unique et valide
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets' },
        { status: 400 }
      )
    }

    const { data: existing } = await supabaseAdmin
      .from('institutions')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Ce slug est déjà utilisé' }, { status: 409 })
    }

    // Créer l'institution (statut pending)
    const { data: institution, error } = await supabaseAdmin
      .from('institutions')
      .insert({
        slug, name, description, logo_url, cover_url,
        primary_color: primary_color || '#2563EB',
        secondary_color: secondary_color || '#F59E0B',
        website, contact_email, contact_phone,
        address, country,
        type: type || 'universite',
        admin_uid,
        status: 'pending',
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Ajouter domaine custom si fourni
    if (custom_domain && institution) {
      await supabaseAdmin.from('institution_domains').insert({
        institution_id: institution.id,
        domain: custom_domain.toLowerCase().trim(),
        is_primary: true,
        verified: false,
      })
    }

    // Ajouter l'admin comme membre admin
    await supabaseAdmin.from('institution_members').insert({
      institution_id: institution.id,
      user_uid: admin_uid,
      role: 'admin',
    })

    // Mettre à jour le rôle de l'utilisateur
    await supabaseAdmin
      .from('users')
      .update({ role: 'institution_admin', primary_institution_id: institution.id })
      .eq('uid', admin_uid)

    // Notifier les super admins
    const { data: admins } = await supabaseAdmin
      .from('users').select('uid').eq('role', 'admin')

    if (admins?.length) {
      await supabaseAdmin.from('notifications').insert(
        admins.map(a => ({
          user_id: a.uid,
          type: 'institution_request',
          content: `Nouvelle demande d'institution : "${name}" (${slug}) — en attente de validation.`,
          from_name: 'Système',
          is_read: false,
        }))
      )
    }

    return NextResponse.json({ ok: true, institution }, { status: 201 })
  } catch (err) {
    console.error('[institution/POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ── PATCH — valider/suspendre/modifier une institution (super admin) ──────────
export async function PATCH(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  try {
    const body = await req.json()
    const { id, action, admin_uid, ...updates } = body

    // Vérifier super admin
    const { data: admin } = await supabaseAdmin
      .from('users').select('role').eq('uid', admin_uid).single()

    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    if (action === 'validate') {
      await supabaseAdmin.from('institutions').update({
        status: 'active',
        validated_by: admin_uid,
        validated_at: new Date().toISOString(),
      }).eq('id', id)

      // Notifier l'admin institution
      const { data: inst } = await supabaseAdmin
        .from('institutions').select('admin_uid, name').eq('id', id).single()

      if (inst?.admin_uid) {
        await supabaseAdmin.from('notifications').insert({
          user_id: inst.admin_uid,
          type: 'institution_validated',
          content: `🎉 Votre institution "${inst.name}" a été validée ! Votre espace est maintenant actif.`,
          from_name: 'Équipe Bourse du Temps',
          is_read: false,
        })
      }

      return NextResponse.json({ ok: true, action: 'validated' })
    }

    if (action === 'suspend') {
      await supabaseAdmin.from('institutions').update({ status: 'suspended' }).eq('id', id)
      return NextResponse.json({ ok: true, action: 'suspended' })
    }

    if (action === 'reject') {
      await supabaseAdmin.from('institutions').update({ status: 'rejected' }).eq('id', id)
      return NextResponse.json({ ok: true, action: 'rejected' })
    }

    // Mise à jour générale
    const { error } = await supabaseAdmin
      .from('institutions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[institution/PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
