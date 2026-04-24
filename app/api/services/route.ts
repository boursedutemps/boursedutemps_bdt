import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const userId = searchParams.get('userId')

  let sql = 'SELECT s.*, u.name as author_name, u.avatar_url FROM services s JOIN users u ON s.user_id = u.id WHERE 1=1'
  const params: unknown[] = []
  let idx = 1

  if (category) { sql += ` AND s.category = $${idx++}`; params.push(category) }
  if (userId) { sql += ` AND s.user_id = $${idx++}`; params.push(userId) }

  sql += ' ORDER BY s.created_at DESC'

  const result = await query(sql, params)
  return NextResponse.json(result.rows)
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { title, description, category, duration, image_url } = await req.json()
  if (!title || !description || !category || !duration) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const result = await query(
    `INSERT INTO services (user_id, title, description, category, duration, image_url, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
    [userId, title, description, category, duration, image_url ?? null]
  )
  return NextResponse.json(result.rows[0], { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await req.json()
  const check = await query('SELECT user_id FROM services WHERE id = $1', [id])
  if (check.rows.length === 0) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  if (check.rows[0].user_id !== userId) return NextResponse.json({ error: 'Interdit' }, { status: 403 })

  await query('DELETE FROM services WHERE id = $1', [id])
  return NextResponse.json({ success: true })
}
