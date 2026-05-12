import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { query } from '@/lib/db';

function toArray(val: any): any[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { const parsed = JSON.parse(val); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  }
  return [];
}

/* ─── POST : créer ou retrouver un profil ──────────────────────────────────── */
export async function POST(req: NextRequest) {
  const supabaseUid = await getUserIdFromRequest(req);
  if (!supabaseUid)
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const data = await req.json();
  const {
    email, firstName, lastName, gender, country, whatsapp, availability,
    // champs multiples avec aliases (AuthModal vs ancien format)
    department,   domains,
    offeredSkills,   skillsOffered,
    requestedSkills, skillsSought,
    languages,
    avatar,      photoUrl,     // alias photo
  } = data;

  if (!email || !firstName || !lastName)
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });

  // Normalisation des aliases
  const avatarFinal    = avatar || photoUrl || '';
  const offeredFinal   = offeredSkills  || skillsOffered  || [];
  const requestedFinal = requestedSkills || skillsSought  || [];
  const deptFinal      = department || (Array.isArray(domains) && domains.length ? domains[0] : 'Management');

  try {
    const existing = await query('SELECT * FROM users WHERE email = $1', [email]);

    // Utilisateur existant → mettre à jour l'uid et la photo si fournie
    if ((existing.rowCount ?? 0) > 0) {
      await query(
        `UPDATE users SET uid = $1 ${avatarFinal ? ', avatar = $3' : ''} WHERE email = $2`,
        avatarFinal ? [supabaseUid, email, avatarFinal] : [supabaseUid, email]
      );
      const updated = await query('SELECT * FROM users WHERE uid = $1', [supabaseUid]);
      return NextResponse.json({ user: formatUser(updated.rows[0]) });
    }

    // Nouveau membre → insérer avec 5 crédits offerts
    const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user';
    const WELCOME_CREDITS = 5;

    await query(
      `INSERT INTO users (
        uid, email, password, first_name, last_name, whatsapp, department, gender, country,
        availability, languages, offered_skills, requested_skills, avatar,
        terms_accepted, role, credits
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
      [
        supabaseUid, email, '', firstName, lastName,
        whatsapp     || '',
        deptFinal,
        gender       || 'Non précisé',
        country      || '',
        availability || '',
        JSON.stringify(Array.isArray(languages)    ? languages    : []),
        JSON.stringify(Array.isArray(offeredFinal)  ? offeredFinal  : []),
        JSON.stringify(Array.isArray(requestedFinal)? requestedFinal: []),
        avatarFinal,
        true, role, WELCOME_CREDITS,
      ]
    );

    const result = await query('SELECT * FROM users WHERE uid = $1', [supabaseUid]);
    return NextResponse.json({ user: formatUser(result.rows[0]) }, { status: 201 });

  } catch (e: any) {
    console.error('Profil POST error:', e);
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}

/* ─── GET : récupérer son profil ───────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const supabaseUid = await getUserIdFromRequest(req);
  if (!supabaseUid)
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const result = await query('SELECT * FROM users WHERE uid = $1', [supabaseUid]);
  if ((result.rowCount ?? 0) === 0)
    return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 });

  return NextResponse.json(formatUser(result.rows[0]));
}

/* ─── PATCH : mettre à jour son profil (y compris la photo) ───────────────── */
export async function PATCH(req: NextRequest) {
  const supabaseUid = await getUserIdFromRequest(req);
  if (!supabaseUid)
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const data = await req.json();
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  const allowed = [
    'first_name', 'last_name', 'bio', 'avatar', 'whatsapp',
    'department', 'gender', 'country', 'availability',
    'offered_skills', 'requested_skills', 'languages',
  ];

  for (const [key, val] of Object.entries(data)) {
    const snake = key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);
    if (allowed.includes(snake)) {
      fields.push(`${snake} = $${idx++}`);
      // Sérialiser les arrays
      values.push(Array.isArray(val) ? JSON.stringify(val) : val);
    }
  }

  // Alias : photoUrl → avatar
  if (data.photoUrl && !data.avatar) {
    fields.push(`avatar = $${idx++}`);
    values.push(data.photoUrl);
  }

  if (fields.length === 0)
    return NextResponse.json({ error: 'Rien à mettre à jour' }, { status: 400 });

  values.push(supabaseUid);
  await query(`UPDATE users SET ${fields.join(', ')} WHERE uid = $${idx}`, values);

  const result = await query('SELECT * FROM users WHERE uid = $1', [supabaseUid]);
  return NextResponse.json(formatUser(result.rows[0]));
}

/* ─── Format ───────────────────────────────────────────────────────────────── */
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
    credits:         user.credits ?? 0,
    avatar:          user.avatar,
    coverPhoto:      user.cover_photo,
    role:            user.role,
    status:          user.status,
    createdAt:       user.created_at,
  };
}
