import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') // 'sent' | 'received' | null (all public)
  const userId = await getUserIdFromRequest(req)

  if (type === 'sent') {
    if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const result = await query(
      `SELECT r.*, s.title as service_title, u.name as provider_name
       FROM requests r
       JOIN services s ON r.service_id = s.id
       JOIN users u ON r.provider_id = u.id
       WHERE r.requester_id = $1 ORDER BY r.created_at DESC`,
      [userId]
    )
    return NextResponse.json(result.rows)
  }

  if (type === 'received') {
    if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const result = await query(
      `SELECT r.*, s.title as service_title, u.name as requester_name
       FROM requests r
       JOIN services s ON r.service_id = s.id
       JOIN users u ON r.requester_id = u.id
       WHERE r.provider_id = $1 ORDER BY r.created_at DESC`,
      [userId]
    )
    return NextResponse.json(result.rows)
  }

  // Public : toutes les demandes ouvertes
  const result = await query(
    `SELECT r.*, s.title as service_title FROM requests r
     JOIN services s ON r.service_id = s.id
     WHERE r.status = 'pending' ORDER BY r.created_at DESC`
  )
  return NextResponse.json(result.rows)
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { service_id, message } = await req.json()
  if (!service_id) return NextResponse.json({ error: 'service_id requis' }, { status: 400 })

  const svc = await query('SELECT user_id FROM services WHERE id = $1', [service_id])
  if (svc.rows.length === 0) return NextResponse.json({ error: 'Service introuvable' }, { status: 404 })

  const providerId = svc.rows[0].user_id
  if (providerId === userId) return NextResponse.json({ error: 'Vous ne pouvez pas vous contacter vous-même' }, { status: 400 })

  const result = await query(
    `INSERT INTO requests (service_id, requester_id, provider_id, message, status, created_at)
     VALUES ($1, $2, $3, $4, 'pending', NOW()) RETURNING *`,
    [service_id, userId, providerId, message ?? '']
  )
  return NextResponse.json(result.rows[0], { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id, status } = await req.json()
  if (!id || !status) return NextResponse.json({ error: 'id et status requis' }, { status: 400 })

  const check = await query('SELECT provider_id FROM requests WHERE id = $1', [id])
  if (check.rows.length === 0) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  if (check.rows[0].provider_id !== userId) return NextResponse.json({ error: 'Interdit' }, { status: 403 })

  await query('UPDATE requests SET status = $1 WHERE id = $2', [status, id])
  return NextResponse.json({ success: true })
}
