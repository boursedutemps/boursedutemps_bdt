import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY!;

const SYSTEM_PROMPT = `Tu es l'assistant IA officiel de Bourse du Temps, une plateforme d'échange de services et de compétences de l'Université Senghor.

CONTEXTE DU SITE :
- Les membres échangent leurs talents contre des crédits-temps
- Chaque heure de service = 1 crédit
- Pages disponibles : Accueil, Services, Demandes, Membres, Forum, Blog, Témoignages, Profil
- Stack : Next.js 14, Supabase, PostgreSQL, Cloudinary, LiveKit

TON RÔLE :
1. Support utilisateur 24/7 — expliquer le fonctionnement du site
2. Guide de navigation — dire où cliquer, comment faire
3. Aide aux formulaires — suggérer, compléter, vérifier
4. Matching intelligent — recommander des services/membres compatibles
5. Traduction — français, créole haïtien, anglais, arabe (détection automatique)
6. Analyse admin — insights sur les données (pour Jean Bernard/Baz)
7. Assistant développeur — bugs, optimisations Next.js/Supabase (pour Jean Bernard/Baz)

RÈGLES :
- Réponses claires, courtes, directes — sans blabla
- Ne jamais inventer de données
- Ne jamais exposer de données sensibles
- Toujours rester professionnel et bienveillant
- Adapter la langue à celle de l'utilisateur
- Pour les questions admin/dev, demander confirmation si action destructive

FONCTIONNEMENT DES CRÉDITS :
- Nouveau membre : 10 crédits offerts
- Offrir un service : +1 crédit par heure
- Recevoir un service : -1 crédit par heure
- Minimum requis : 0 crédit pour publier, 1 crédit pour recevoir

COMMENT PUBLIER UN SERVICE :
1. Se connecter
2. Aller sur "Services"
3. Cliquer "Nouveau service"
4. Remplir titre, description, catégorie, coût en crédits
5. Soumettre

COMMENT CONTACTER UN MEMBRE :
1. Aller sur "Membres"
2. Cliquer sur le profil
3. Envoyer une demande de connexion
4. Une fois connecté, envoyer un message

Si tu ne sais pas quelque chose, dis-le honnêtement et oriente vers le bon endroit.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, userContext } = await req.json();

    if (!messages || !Array.isArray(messages))
      return NextResponse.json({ error: 'Messages requis' }, { status: 400 });

    // Limiter l'historique à 10 messages pour économiser les tokens
    const recentMessages = messages.slice(-10);

    const systemWithContext = userContext
      ? `${SYSTEM_PROMPT}\n\nCONTEXTE UTILISATEUR ACTUEL:\n${JSON.stringify(userContext)}`
      : SYSTEM_PROMPT;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemWithContext },
          ...recentMessages,
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Groq error:', err);
      return NextResponse.json({ error: 'Erreur IA' }, { status: 500 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
