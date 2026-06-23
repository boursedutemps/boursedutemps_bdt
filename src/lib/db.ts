// src/lib/db.ts
import postgres from 'postgres'

// ── Connexion ──────────────────────────────────────────────────────────────
const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// ── Compatibilite avec ancien client pg ─────────────────────────────────────
// Utilise par toutes les routes API de Bourse du Temps (users, services,
// requests, blogs, forum, transactions, notifications, etc.)
export async function query(text: string, params: unknown[] = []): Promise<{ rows: any[]; rowCount: number }> {
  const result = await sql.unsafe(text, params as never[])
  return {
    rows: result as unknown as any[],
    rowCount: (result as { count?: number }).count ?? result.length,
  }
}
