// src/app/api/admin/fix-role/route.ts
// Endpoint temporaire pour corriger le rôle dans la base directe
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth'

export async function POST(req: Request) {
  const callerUid = await getUserIdFromRequest(req)
  if (!callerUid) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  // Vérifier que le caller est admin dans la base directe OU via auth/me
  const callerRes = await query('SELECT role FROM users WHERE uid = $1', [callerUid])
  const callerRole = callerRes.rows[0]?.role

  // Autoriser si admin OU si c'est son propre UID (pour se corriger soi-même)
  const { uid, role } = await req.json()
  if (!uid || !role) return NextResponse.json({ error: 'uid et role requis' }, { status: 400 })

  const allowed = ['member', 'moderator', 'admin', 'institution_admin']
  if (!allowed.includes(role)) return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 })

  // Seul l'admin peut changer le rôle d'autrui — peut se corriger lui-même
  if (callerUid !== uid && callerRole !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  try {
    // Supprimer les doublons éventuels (même email, uid différent)
    const userRes = await query('SELECT email FROM users WHERE uid = $1', [uid])
    if (!userRes.rows[0]) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })

    const email = userRes.rows[0].email

    // Supprimer les anciens doublons (uid différent, même email)
    await query('DELETE FROM users WHERE email = $1 AND uid != $2', [email, uid])

    // Mettre à jour le rôle
    await query('UPDATE users SET role = $1 WHERE uid = $2', [role, uid])

    const updated = await query('SELECT uid, email, role, status FROM users WHERE uid = $1', [uid])
    return NextResponse.json({ ok: true, user: updated.rows[0] })
  } catch (err) {
    console.error('[fix-role]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
