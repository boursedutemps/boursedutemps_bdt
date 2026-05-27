// src/app/api/blogs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  // Rejeter les valeurs non-numériques
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
  }

  try {
    const result = await query(
      'SELECT * FROM blogs WHERE id = $1 LIMIT 1',
      [parseInt(id, 10)]
    )

    if (!result.rowCount || result.rowCount === 0) {
      return NextResponse.json({ error: 'Article introuvable' }, { status: 404 })
    }

    const b = result.rows[0]
    return NextResponse.json({
      id:           b.id,
      authorId:     b.author_id,
      authorName:   b.author_name,
      author_name:  b.author_name,
      authorAvatar: b.author_avatar,
      title:        b.title,
      content:      b.content,
      category:     b.category,
      media:        b.media      ?? [],
      likes:        b.likes      ?? [],
      dislikes:     b.dislikes   ?? [],
      shares:       b.shares     ?? 0,
      reposts:      b.reposts    ?? 0,
      comments:     b.comments   ?? [],
      externalLink: b.external_link,
      createdAt:    b.created_at,
      created_at:   b.created_at,
    })
  } catch (error) {
    console.error('[api/blogs/[id]]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
  }
  try {
    await query('DELETE FROM blogs WHERE id = $1', [parseInt(id, 10)])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[api/blogs/[id] DELETE]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
