import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { query } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';

function toArray(val: any): any[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  return [];
}

export async function GET(req: NextRequest) {
  const supabaseUid = await getUserIdFromRequest(req);
  if (!supabaseUid)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 1. Chercher par uid direct
  let result = await query('SELECT * FROM users WHERE uid = $1', [supabaseUid]);

  // 2. Fallback : ancien compte → chercher par email puis migrer
  if ((result.rowCount ?? 0) === 0) {
    const token = (req.headers.get('authorization') || '').replace('Bearer ', '').trim();
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await supabaseAdmin.auth.getUser(token);
    const email = data?.user?.email;

    if (email) {
      result = await query('SELECT * FROM users WHERE email = $1', [email]);
      if ((result.rowCount ?? 0) > 0) {
        await query('UPDATE users SET uid = $1 WHERE email = $2', [supabaseUid, email]);
        result = await query('SELECT * FROM users WHERE uid = $1', [supabaseUid]);
      }
    }
  }

  if ((result.rowCount ?? 0) === 0)
    return NextResponse.json({ error: 'User not found' }, { status: 404 });

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
    role:              u.role,
    status:            u.status,
    createdAt:         u.created_at,
    // Vérification progressive
    phone:             u.phone,
    isVerifiedEmail:   u.is_verified_email  ?? false,
    isVerifiedSms:     u.is_verified_sms    ?? false,
    isVerifiedId:      u.is_verified_id     ?? false,
    verificationLevel: u.verification_level ?? 0,
  });
}
