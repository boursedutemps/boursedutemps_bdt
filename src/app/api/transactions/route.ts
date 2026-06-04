// src/app/api/transactions/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: Request) {
  const uid = getUserIdFromRequest(req);

  // Sans auth → stats publiques pour la page d'accueil
  if (!uid) {
    try {
      const result = await query('SELECT COUNT(*) as total FROM transactions');
      return NextResponse.json({ total: parseInt(result.rows[0]?.total || '0') });
    } catch {
      return NextResponse.json([]);
    }
  }

  // Avec auth → transactions personnelles
  try {
    const result = await query(
      'SELECT * FROM transactions WHERE from_id = $1 OR to_id = $1 ORDER BY created_at DESC',
      [uid]
    );
    return NextResponse.json(result.rows.map(t => ({
      id:           t.id,
      fromId:       t.from_id,
      toId:         t.to_id,
      amount:       t.amount,
      serviceTitle: t.service_title,
      type:         t.type,
      date:         t.created_at,
    })));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // ── 1. Auth obligatoire ───────────────────────────────────────────────────
  const uid = getUserIdFromRequest(req);
  if (!uid) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const { toId, serviceTitle, amount } = await req.json();

    // ── 2. Validation des paramètres ─────────────────────────────────────────
    if (!toId || !serviceTitle || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Paramètres manquants ou invalides' }, { status: 400 });
    }
    if (uid === toId) {
      return NextResponse.json({ error: 'Impossible d\'échanger avec soi-même' }, { status: 400 });
    }

    // ── 3. Vérifier que l'acheteur a assez de crédits ────────────────────────
    const userRes = await query('SELECT credits FROM users WHERE uid = $1', [uid]);
    const credits = parseInt(userRes.rows[0]?.credits ?? '0');
    if (credits < amount) {
      return NextResponse.json(
        { error: 'Crédits insuffisants', credits, required: amount },
        { status: 402 }
      );
    }

    // ── 4. Créer la transaction ───────────────────────────────────────────────
    const txRes = await query(
      `INSERT INTO transactions (from_id, to_id, amount, service_title, type)
       VALUES ($1, $2, $3, $4, 'exchange') RETURNING id`,
      [uid, toId, amount, serviceTitle]
    );
    const transactionId = txRes.rows[0].id;

    // ── 5. Transférer les crédits ─────────────────────────────────────────────
    await query('UPDATE users SET credits = credits - $1 WHERE uid = $2', [amount, uid]);
    await query('UPDATE users SET credits = credits + $1 WHERE uid = $2', [amount, toId]);

    // ── 6. Créer les review_prompts mutuels (Supabase) ────────────────────────
    if (supabaseAdmin) {
      await supabaseAdmin
        .from('review_prompts')
        .upsert([
          { transaction_id: transactionId, reviewer_id: uid,  reviewee_id: toId },
          { transaction_id: transactionId, reviewer_id: toId, reviewee_id: uid  },
        ], { onConflict: 'transaction_id,reviewer_id', ignoreDuplicates: true });
    }

    return NextResponse.json({ id: transactionId, ok: true });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
