// src/app/api/users/route.ts
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

function toArray(val: any): any[] {
  if (Array.isArray(val)) return val
  if (typeof val === 'string') {
    try { const p = JSON.parse(val); return Array.isArray(p) ? p : [] } catch { return [] }
  }
  return []
}

export async function GET() {
  try {
    const result = await query(
      `SELECT uid, first_name, last_name, avatar, bio, country,
              offered_skills, department, is_verified_email, credits, role
       FROM users
       WHERE status = 'active'
       ORDER BY created_at DESC`
    )
    const users = result.rows.map(u => ({
      uid:            u.uid,
      first_name:     u.first_name,
      last_name:      u.last_name,
      avatar:         u.avatar,
      bio:            u.bio,
      country:        u.country,
      offered_skills: toArray(u.offered_skills).join(', '),
      department:     u.department,
      verified:       u.is_verified_email ?? false,
      credits:        u.credits ?? 0,
      role:           u.role,
    }))
    return NextResponse.json(users)
  } catch (error) {
    console.error('[api/users GET]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
