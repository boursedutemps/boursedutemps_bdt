import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const result = await query(
        `SELECT p.*, u.first_name, u.last_name, u.avatar
         FROM blog_posts p JOIN users u ON p.user_id = u.uid WHERE p.id = $1`,
        [id]
      )
      if (result.rows.length === 0) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
      const row = result.rows[0]
      return NextResponse.json({ ...row, authorName: `${row.first_name} ${row.last_name}`, authorAvatar: row.avatar })
    }

    const result = await query(
      `SELECT p.*, u.first_name, u.last_name, u.avatar
       FROM blog_posts p JOIN users u ON p.user_id = u.uid
       ORDER BY p.created_at DESC`
    )
    const rows = result.rows.map(r => ({
      ...r,
      authorName: `${r.first_name} ${r.last_name}`,
      authorAvatar: r.avatar,
    }))
    return NextResponse.json(rows)
  } catch (e: any) {
    console.error('GET /api/blogs error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req)
    if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { title, content, cover_url, excerpt, category, media } = await req.json()
    if (!title || !content) return NextResponse.json({ error: 'Titre et contenu requis' }, { status: 400 })

    const result = await query(
      `INSERT INTO blog_posts (user_id, title, content, cover_url, excerpt, category, media, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
      [userId, title, content, cover_url ?? null, excerpt ?? null, category ?? null, JSON.stringify(media ?? [])]
    )
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (e: any) {
    console.error('POST /api/blogs error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req)
    if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { id, title, content, cover_url, excerpt } = await req.json()
    const check = await query('SELECT user_id FROM blog_posts WHERE id = $1', [id])
    if (check.rows.length === 0) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    if (check.rows[0].user_id !== userId) return NextResponse.json({ error: 'Interdit' }, { status: 403 })

    await query(
      `UPDATE blog_posts SET title=$1, content=$2, cover_url=$3, excerpt=$4 WHERE id=$5`,
      [title, content, cover_url ?? null, excerpt ?? null, id]
    )
    const result = await query('SELECT * FROM blog_posts WHERE id = $1', [id])
    return NextResponse.json(result.rows[0])
  } catch (e: any) {
    console.error('PATCH /api/blogs error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req)
    if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { id } = await req.json()
    const check = await query('SELECT user_id FROM blog_posts WHERE id = $1', [id])
    if (check.rows.length === 0) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    if (check.rows[0].user_id !== userId) return NextResponse.json({ error: 'Interdit' }, { status: 403 })

    await query('DELETE FROM blog_posts WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('DELETE /api/blogs error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
