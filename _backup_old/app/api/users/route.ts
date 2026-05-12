import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

function toArray(val: any): any[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  return [];
}

export async function GET(
  _req: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const result = await query('SELECT * FROM users WHERE uid = $1', [params.uid]);
    if ((result.rowCount ?? 0) === 0)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const u = result.rows[0];
    return NextResponse.json({
      id:              u.uid,
      uid:             u.uid,
      firstName:       u.first_name,
      lastName:        u.last_name,
      email:           u.email,
      department:      u.department,
      whatsapp:        u.whatsapp,
      gender:          u.gender,
      country:         u.country,
      bio:             u.bio,
      offeredSkills:   toArray(u.offered_skills),
      requestedSkills: toArray(u.requested_skills),
      availability:    u.availability,
      languages:       toArray(u.languages),
      credits:         u.credits,
      avatar:          u.avatar,
      coverPhoto:      u.cover_photo,
      role:            u.role,
      status:          u.status,
      createdAt:       u.created_at,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
