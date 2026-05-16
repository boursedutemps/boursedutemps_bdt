// src/middleware.ts
// Détecte les domaines custom des institutions et redirige vers /i/[slug]

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Domaine principal de la plateforme
const MAIN_DOMAINS = [
  'boursedutemps.vercel.app',
  'localhost',
  '127.0.0.1',
]

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || ''
  const pathname = req.nextUrl.pathname

  // Extraire le domaine sans le port
  const domain = hostname.split(':')[0]

  // Si c'est le domaine principal → pas de redirection
  const isMainDomain = MAIN_DOMAINS.some(d => domain === d || domain.endsWith(`.${d}`))
  if (isMainDomain) {
    return NextResponse.next()
  }

  // Si on est déjà sur /i/... → pas de boucle
  if (pathname.startsWith('/i/') || pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next()
  }

  // Chercher l'institution correspondant au domaine custom
  // On utilise l'API interne pour éviter une requête DB directe dans le middleware
  try {
    const res = await fetch(
      `${req.nextUrl.origin}/api/institution/domain?domain=${domain}`,
      { headers: { 'x-middleware-request': '1' } }
    )

    if (res.ok) {
      const data = await res.json()
      if (data.slug) {
        // Réécrire l'URL vers /i/[slug]/...
        const url = req.nextUrl.clone()
        url.pathname = `/i/${data.slug}${pathname === '/' ? '' : pathname}`
        return NextResponse.rewrite(url)
      }
    }
  } catch {
    // En cas d'erreur, laisser passer normalement
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Exclure les fichiers statiques et API internes
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|images).*)',
  ],
}
