import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET() {
  const result = await query(
    `SELECT t.*, u.name as author_name, u.avatar_url
     FROM temoignages t JOIN users u ON t.user_id = u.id
     ORDER BY t.created_at DESC`
  )
  return NextResponse.json(result.rows)
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { content, rating } = await req.json()
  if (!content) return NextResponse.json({ error: 'Contenu requis' }, { status: 400 })

  const result = await query(
    `INSERT INTO temoignages (user_id, content, rating, created_at)
     VALUES ($1, $2, $3, NOW()) RETURNING *`,
    [userId, content, rating ?? 5]
  )
  return NextResponse.json(result.rows[0], { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await req.json()
  const check = await query('SELECT user_id FROM temoignages WHERE id = $1', [id])
  if (check.rows.length === 0) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  if (check.rows[0].user_id !== userId) return NextResponse.json({ error: 'Interdit' }, { status: 403 })

  await query('DELETE FROM temoignages WHERE id = $1', [id])
  return NextResponse.json({ success: true })
}
