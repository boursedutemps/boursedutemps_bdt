import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';
import { sendPushNotification } from '@/lib/push-server';

export async function GET(req: Request) {
  // ── FIX : await manquant ───────────────────────────────────────────────────
  const uid = await getUserIdFromRequest(req);
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const result = await query(
      'SELECT * FROM messages WHERE sender_id = $1 OR receiver_id = $1 ORDER BY created_at ASC',
      [uid]
    );
    const messages = result.rows.map(m => ({
      id:         m.id,
      senderId:   m.sender_id,
      receiverId: m.receiver_id,
      content:    m.content,
      timestamp:  m.created_at,
      isRead:     m.is_read || false,
    }));
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // ── Auth obligatoire sur POST aussi ────────────────────────────────────────
  const uid = await getUserIdFromRequest(req);
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    if (!data.receiverId || !data.content?.trim())
      return NextResponse.json({ error: 'receiverId et content requis' }, { status: 400 });

    const result = await query(
      `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3) RETURNING id, created_at`,
      [uid, data.receiverId, data.content]
    );

    const senderResult = await query(
      'SELECT first_name, last_name FROM users WHERE uid = $1', [uid]
    );
    const senderName = (senderResult.rowCount ?? 0) > 0
      ? `${senderResult.rows[0].first_name} ${senderResult.rows[0].last_name}`
      : 'Quelqu\'un';

    await sendPushNotification(data.receiverId, {
      title: `Nouveau message de ${senderName}`,
      body:  data.content.length > 50 ? data.content.substring(0, 47) + '...' : data.content,
      url:   '/profile?chat=' + uid,
    });

    return NextResponse.json({
      id:         result.rows[0].id,
      senderId:   uid,
      receiverId: data.receiverId,
      content:    data.content,
      timestamp:  result.rows[0].created_at,
      isRead:     false,
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
