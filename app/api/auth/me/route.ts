import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { query } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const supabaseUid = await getUserIdFromRequest(req);
  if (!supabaseUid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. Chercher par uid direct (nouveau compte ou déjà migré)
  let result = await query('SELECT * FROM users WHERE uid = $1', [supabaseUid]);

  // 2. Si pas trouvé → ancien compte avec uid différent → chercher par email
  if ((result.rowCount ?? 0) === 0) {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await supabaseAdmin.auth.getUser(token);
    const email = data?.user?.email;

    if (email) {
      result = await query('SELECT * FROM users WHERE email = $1', [email]);

      // Migrer l'uid automatiquement pour les prochaines connexions
      if ((result.rowCount ?? 0) > 0) {
        await query('UPDATE users SET uid = $1 WHERE email = $2', [supabaseUid, email]);
        result = await query('SELECT * FROM users WHERE uid = $1', [supabaseUid]);
      }
    }
  }

  if ((result.rowCount ?? 0) === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const user = result.rows[0];
  return NextResponse.json({
    id: user.uid,
    uid: user.uid,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    department: user.department,
    whatsapp: user.whatsapp,
    gender: user.gender,
    country: user.country,
    bio: user.bio,
    offeredSkills: user.offered_skills || [],
    requestedSkills: user.requested_skills || [],
    availability: user.availability,
    languages: user.languages || [],
    credits: user.credits,
    avatar: user.avatar,
    coverPhoto: user.cover_photo,
    role: user.role,
    status: user.status,
    createdAt: user.created_at,
  });
}
