import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (id) {
    const result = await query(
      `SELECT p.*, u.name as author_name, u.avatar_url
       FROM forum_posts p JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [id]
    )
    if (result.rows.length === 0) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    return NextResponse.json(result.rows[0])
  }

  const result = await query(
    `SELECT p.*, u.name as author_name, u.avatar_url,
       (SELECT COUNT(*) FROM forum_replies r WHERE r.post_id = p.id) as reply_count
     FROM forum_posts p JOIN users u ON p.user_id = u.id
     ORDER BY p.created_at DESC`
  )
  return NextResponse.json(result.rows)
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { title, content, live_session } = await req.json()
  if (!title || !content) return NextResponse.json({ error: 'Titre et contenu requis' }, { status: 400 })

  const result = await query(
    `INSERT INTO forum_posts (user_id, title, content, live_session, created_at)
     VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
    [userId, title, content, live_session ?? null]
  )
  return NextResponse.json(result.rows[0], { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await req.json()
  const check = await query('SELECT user_id FROM forum_posts WHERE id = $1', [id])
  if (check.rows.length === 0) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  if (check.rows[0].user_id !== userId) return NextResponse.json({ error: 'Interdit' }, { status: 403 })

  await query('DELETE FROM forum_posts WHERE id = $1', [id])
  return NextResponse.json({ success: true })
}
