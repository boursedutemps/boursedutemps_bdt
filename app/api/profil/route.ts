import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { query } from '@/lib/db';

// Parse un champ qui peut être un array PG, une string JSON, ou null
function toArray(val: any): any[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { const parsed = JSON.parse(val); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  }
  return [];
}

export async function POST(req: NextRequest) {
  const supabaseUid = await getUserIdFromRequest(req);
  if (!supabaseUid)
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const data = await req.json();
  const { email, firstName, lastName, department, gender, country, whatsapp,
    offeredSkills, requestedSkills, availability, languages, avatar } = data;

  if (!email || !firstName || !lastName)
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });

  try {
    const existing = await query('SELECT * FROM users WHERE email = $1', [email]);

    if ((existing.rowCount ?? 0) > 0) {
      await query('UPDATE users SET uid = $1 WHERE email = $2', [supabaseUid, email]);
      const updated = await query('SELECT * FROM users WHERE uid = $1', [supabaseUid]);
      return NextResponse.json({ user: formatUser(updated.rows[0]) });
    }

    const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user';

    await query(
      `INSERT INTO users (
        uid, email, password, first_name, last_name, whatsapp, department, gender, country,
        availability, languages, offered_skills, requested_skills, avatar, terms_accepted, role
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [
        supabaseUid, email, '', firstName, lastName, whatsapp || '', department || 'Management',
        gender || 'Homme', country || '', availability || '',
        JSON.stringify(languages || []),
        JSON.stringify(offeredSkills || []),
        JSON.stringify(requestedSkills || []),
        avatar || '', true, role,
      ]
    );

    const result = await query('SELECT * FROM users WHERE uid = $1', [supabaseUid]);
    return NextResponse.json({ user: formatUser(result.rows[0]) }, { status: 201 });

  } catch (e: any) {
    console.error('Profil POST error:', e);
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const supabaseUid = await getUserIdFromRequest(req);
  if (!supabaseUid)
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const result = await query('SELECT * FROM users WHERE uid = $1', [supabaseUid]);
  if ((result.rowCount ?? 0) === 0)
    return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 });

  return NextResponse.json(formatUser(result.rows[0]));
}

export async function PATCH(req: NextRequest) {
  const supabaseUid = await getUserIdFromRequest(req);
  if (!supabaseUid)
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const data = await req.json();
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  const allowed = ['first_name', 'last_name', 'bio', 'avatar', 'whatsapp',
    'department', 'gender', 'country', 'availability'];

  for (const [key, val] of Object.entries(data)) {
    const snake = key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);
    if (allowed.includes(snake)) {
      fields.push(`${snake} = $${idx++}`);
      values.push(val);
    }
  }

  if (fields.length === 0)
    return NextResponse.json({ error: 'Rien à mettre à jour' }, { status: 400 });

  values.push(supabaseUid);
  await query(`UPDATE users SET ${fields.join(', ')} WHERE uid = $${idx}`, values);

  const result = await query('SELECT * FROM users WHERE uid = $1', [supabaseUid]);
  return NextResponse.json(formatUser(result.rows[0]));
}

function formatUser(user: any) {
  return {
    id:              user.uid,
    uid:             user.uid,
    firstName:       user.first_name,
    lastName:        user.last_name,
    email:           user.email,
    department:      user.department,
    whatsapp:        user.whatsapp,
    gender:          user.gender,
    country:         user.country,
    bio:             user.bio,
    offeredSkills:   toArray(user.offered_skills),
    requestedSkills: toArray(user.requested_skills),
    availability:    user.availability,
    languages:       toArray(user.languages),
    credits:         user.credits,
    avatar:          user.avatar,
    coverPhoto:      user.cover_photo,
    role:            user.role,
    status:          user.status,
    createdAt:       user.created_at,
  };
}
