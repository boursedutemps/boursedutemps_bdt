import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Extrait et vérifie le token Bearer depuis la requête.
 * Retourne l'userId (UUID Supabase) ou null si invalide/absent.
 */
export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.replace('Bearer ', '').trim()
  if (!token) return null

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) return null

  return data.user.id
}
