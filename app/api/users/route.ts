import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Parse un champ qui peut être un array PG, une string JSON, ou null
function toArray(val: any): any[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { const parsed = JSON.parse(val); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  }
  return [];
}

export async function GET() {
  try {
    const result = await query(
      "SELECT * FROM users WHERE status != $1 ORDER BY created_at DESC",
      ['deleted']
    );
    const users = result.rows.map(u => ({
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
    }));
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
