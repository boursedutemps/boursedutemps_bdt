// src/app/api/admin/pending-verifications/route.ts
// Liste tous les utilisateurs ayant soumis un document d'identité (en attente ou approuvé)

import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth'

export async function GET(req: Request) {
  const uid = getUserIdFromRequest(req)
  if (!uid) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  // Vérifier que l'appelant est admin ou modérateur
  const meRes = await query('SELECT role FROM users WHERE uid = $1', [uid])
  const role  = meRes.rows[0]?.role
  if (role !== 'admin' && role !== 'moderator') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  try {
    const result = await query(
      `SELECT uid, first_name, last_name, email, avatar,
              identity_document_url, is_verified_id,
              is_verified_email, is_verified_sms,
              created_at
       FROM users
       WHERE identity_document_url IS NOT NULL
       ORDER BY is_verified_id ASC, created_at DESC`,
      []
    )

    return NextResponse.json(
      result.rows.map(u => ({
        uid:            u.uid,
        name:           `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim(),
        email:          u.email,
        avatar:         u.avatar,
        documentUrl:    u.identity_document_url,
        isVerifiedId:   u.is_verified_id   ?? false,
        isVerifiedEmail: u.is_verified_email ?? false,
        isVerifiedSms:  u.is_verified_sms  ?? false,
        createdAt:      u.created_at,
      }))
    )
  } catch (error) {
    console.error('[admin/pending-verifications GET]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
