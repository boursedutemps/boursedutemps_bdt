import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';
import { sendPushNotification } from '@/lib/push-server';

// Whitelist anti-injection SQL
const ALLOWED_TABLES: Record<string, string> = {
  forumTopics:  'forum_topics',
  blogs:        'blogs',
  testimonials: 'testimonials',
  services:     'services',
  requests:     'requests',
  connections:  'connections',
  users:        'users',
  liveSessions: 'live_sessions',
  notifications:'notifications',
  transactions: 'transactions',
  messages:     'messages',
};

const camelToSnake = (str: string) =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const snakeToCamel = (str: string) =>
  str.replace(/_([a-z])/g, (_, g) => g.toUpperCase());

function resolveTable(collection: string): string | null {
  return ALLOWED_TABLES[collection] ?? null;
}

// ─── GET /api/[collection]/[id] ───────────────────────────────────────────────
export async function GET(
  req: Request,
  { params }: { params: { collection: string; id: string } }
) {
  const { collection, id } = params;

  const tableName = resolveTable(collection);
  if (!tableName) return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });

  const idColumn = tableName === 'users' ? 'uid' : 'id';

  try {
    const result = await query(`SELECT * FROM ${tableName} WHERE ${idColumn} = $1`, [id]);
    if ((result.rowCount ?? 0) === 0)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const row = result.rows[0];
    const camelRow: Record<string, unknown> = {};
    for (const key in row) {
      camelRow[snakeToCamel(key)] = row[key];
    }
    if (camelRow.uid) camelRow.id = camelRow.uid;

    return NextResponse.json(camelRow);
  } catch (error) {
    console.error(`GET ${collection}/${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ─── PATCH /api/[collection]/[id] ────────────────────────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: { collection: string; id: string } }
) {
  // Auth obligatoire
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { collection, id } = params;

  const tableName = resolveTable(collection);
  if (!tableName) return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });

  const idColumn = tableName === 'users' ? 'uid' : 'id';

  try {
    const data = await req.json();
    const keys = Object.keys(data);
    if (keys.length === 0)
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });

    const setClause = keys
      .map((key, i) => `${camelToSnake(key)} = $${i + 1}`)
      .join(', ');
    const values = Object.values(data);

    await query(
      `UPDATE ${tableName} SET ${setClause} WHERE ${idColumn} = $${keys.length + 1}`,
      [...values, id]
    );

    // ── Push notifications selon le contexte ──────────────────────────────
    if (collection === 'services' && data.status === 'accepted') {
      const r = await query('SELECT user_id, title FROM services WHERE id = $1', [id]);
      if ((r.rowCount ?? 0) > 0) {
        const s = r.rows[0];
        await sendPushNotification(s.user_id, {
          title: 'Service accepté',
          body: `Votre service "${s.title}" a été accepté !`,
          url: '/services',
        });
      }
    } else if (collection === 'requests' && data.status === 'accepted') {
      const r = await query('SELECT user_id, title FROM requests WHERE id = $1', [id]);
      if ((r.rowCount ?? 0) > 0) {
        const req2 = r.rows[0];
        await sendPushNotification(req2.user_id, {
          title: 'Demande acceptée',
          body: `Votre demande "${req2.title}" a été acceptée !`,
          url: '/requests',
        });
      }
    } else if (collection === 'connections' && data.status === 'accepted') {
      const r = await query('SELECT sender_id FROM connections WHERE id = $1', [id]);
      if ((r.rowCount ?? 0) > 0) {
        await sendPushNotification(r.rows[0].sender_id, {
          title: 'Demande de connexion acceptée',
          body: 'Votre demande de connexion a été acceptée.',
          url: '/profile',
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`PATCH ${collection}/${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ─── DELETE /api/[collection]/[id] ───────────────────────────────────────────
export async function DELETE(
  req: Request,
  { params }: { params: { collection: string; id: string } }
) {
  // Auth obligatoire
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { collection, id } = params;

  const tableName = resolveTable(collection);
  if (!tableName) return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });

  const idColumn = tableName === 'users' ? 'uid' : 'id';

  try {
    await query(`DELETE FROM ${tableName} WHERE ${idColumn} = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE ${collection}/${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
