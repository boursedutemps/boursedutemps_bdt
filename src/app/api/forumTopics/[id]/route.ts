// src/app/api/forumTopics/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query('SELECT * FROM forum_topics WHERE id = $1', [params.id])
    if (!result.rowCount) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    const t = result.rows[0]
    return NextResponse.json({
      id: t.id, authorId: t.author_id, authorName: t.author_name,
      authorAvatar: t.author_avatar, title: t.title, message: t.content,
      category: t.category, media: t.media, likes: t.likes ?? [],
      shares: t.shares ?? 0, comments: t.comments ?? [],
      externalLink: t.external_link, createdAt: t.created_at,
    })
  } catch (e) {
    console.error('[forumTopics/[id] GET]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const fields: string[] = []
    const values: unknown[] = []
    let idx = 1

    const map: Record<string, string> = {
      title: 'title', message: 'content', content: 'content',
      likes: 'likes', shares: 'shares', comments: 'comments',
      externalLink: 'external_link', media: 'media',
    }

    for (const [key, col] of Object.entries(map)) {
      if (body[key] !== undefined) {
        fields.push(`${col} = $${idx++}`)
        const val = body[key]
        values.push(typeof val === 'object' ? JSON.stringify(val) : val)
      }
    }

    if (fields.length === 0)
      return NextResponse.json({ error: 'Rien à mettre à jour' }, { status: 400 })

    values.push(params.id)
    await query(`UPDATE forum_topics SET ${fields.join(', ')} WHERE id = $${idx}`, values)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[forumTopics/[id] PATCH]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM forum_topics WHERE id = $1', [params.id])
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[forumTopics/[id] DELETE]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
