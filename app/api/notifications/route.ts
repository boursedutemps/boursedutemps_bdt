import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const result = await query(
    'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 30',
    [userId]
  )
  return NextResponse.json(result.rows)
}

export async function PATCH(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await req.json()

  if (id) {
    // Marquer une seule notif comme lue
    await query(
      'UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
  } else {
    // Marquer toutes comme lues
    await query('UPDATE notifications SET read = true WHERE user_id = $1', [userId])
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  await query('DELETE FROM notifications WHERE user_id = $1 AND read = true', [userId])
  return NextResponse.json({ success: true })
}
