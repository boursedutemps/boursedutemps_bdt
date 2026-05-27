import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    // Chercher par id numérique OU par slug
    const result = await query(
      'SELECT * FROM blogs WHERE id = $1 OR slug = $1 LIMIT 1',
      [id]
    )

    if (!result.rowCount || result.rowCount === 0) {
      return NextResponse.json({ error: 'Article introuvable' }, { status: 404 })
    }

    const blog = result.rows[0]
    return NextResponse.json({
      id:           blog.id,
      authorId:     blog.author_id,
      authorName:   blog.author_name,
      author_name:  blog.author_name,
      authorAvatar: blog.author_avatar,
      title:        blog.title,
      content:      blog.content,
      excerpt:      blog.excerpt,
      cover_image:  blog.cover_image,
      category:     blog.category,
      media:        blog.media,
      likes:        blog.likes,
      externalLink: blog.external_link,
      createdAt:    blog.created_at,
      created_at:   blog.created_at,
    })
  } catch (error) {
    console.error('[blogs/[id] GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    await query('DELETE FROM blogs WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[blogs/[id] DELETE]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
