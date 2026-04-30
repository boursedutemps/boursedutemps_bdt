import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { query } from '@/lib/db';

// ── Clients ───────────────────────────────────────────────────────────────────
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const GROQ_URL  = 'https://api.groq.com/openai/v1/chat/completions';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const TAVILY_KEY = process.env.TAVILY_API_KEY!;

// ── Système prompt ALDÉA ─────────────────────────────────────────────────────
const BASE_SYSTEM = `Tu es ALDÉA, l'assistante IA officielle de Bourse du Temps (Université Senghor).
Plateforme d'échange de services : 1h = 1 crédit. Nouveau membre : 10 crédits.
Pages : Accueil, Services, Demandes, Membres, Forum, Blog, Témoignages, Profil.
Stack : Next.js 14, Supabase, PostgreSQL, Cloudinary, LiveKit.
Règles : réponses claires et directes, ne jamais inventer de données, adapter la langue à l'utilisateur.`;

// ── Types de requêtes ─────────────────────────────────────────────────────────
type AIProvider = 'groq' | 'claude' | 'openai';

interface RoutingDecision {
  provider: AIProvider;
  model:    string;
  reason:   string;
  needsWeb: boolean;
  needsDb:  boolean;
}

// ── Détection automatique du type de requête ──────────────────────────────────
function detectQueryType(message: string, history: any[]): RoutingDecision {
  const msg     = message.toLowerCase().trim();
  const words   = msg.split(/\s+/).length;
  const isShort = words < 20;

  // Mots-clés par catégorie
  const complexKw  = ['analyse','analyser','expliquer','pourquoi','comment ça fonctionne',
    'optimiser','déboguer','erreur','bug','sql','requête','code','architecture',
    'rapport','comparer','stratégie','recommande','aide-moi à','plan'];

  const creativeKw = ['rédige','écris','génère','crée','propose','idée','améliore',
    'reformule','traduis','résume','présentation','pitch','contenu','marketing',
    'description de service','biographie'];

  const simpleKw   = ['bonjour','salut','merci','comment','où','quand','c\'est quoi',
    'combien','crédit','inscription','connexion','profil','service','demande',
    'menu','page','cliquer','naviguer','aide'];

  const webKw      = ['actualité','news','aujourd\'hui','récent','prix','météo',
    'résultat','qui est','recherche','trouve','information sur'];

  const dbKw       = ['membre','propose','offre','disponible','compétence','cherche un',
    'trouver quelqu\'un','qui peut','service disponible'];

  const needsWeb = webKw.some(k => msg.includes(k));
  const needsDb  = dbKw.some(k => msg.includes(k));

  // Historique long → contexte complexe
  const longHistory = history.length > 6;

  if (complexKw.some(k => msg.includes(k)) || longHistory) {
    return { provider: 'claude', model: 'claude-haiku-4-5-20251001', reason: 'Requête complexe/analyse', needsWeb, needsDb };
  }

  if (creativeKw.some(k => msg.includes(k))) {
    return { provider: 'openai', model: 'gpt-4o-mini', reason: 'Requête créative', needsWeb, needsDb };
  }

  if (isShort && simpleKw.some(k => msg.includes(k))) {
    return { provider: 'groq', model: 'llama-3.1-8b-instant', reason: 'Requête simple/FAQ', needsWeb, needsDb };
  }

  // Par défaut : Groq pour les requêtes courtes, Claude pour les longues
  if (words < 40) {
    return { provider: 'groq', model: 'llama-3.3-70b-versatile', reason: 'Requête modérée', needsWeb, needsDb };
  }
  return { provider: 'claude', model: 'claude-haiku-4-5-20251001', reason: 'Requête longue', needsWeb, needsDb };
}

// ── Recherche web Tavily ──────────────────────────────────────────────────────
async function searchWeb(q: string) {
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: TAVILY_KEY, query: q, search_depth: 'basic', max_results: 4, include_answer: true }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { answer: data.answer, results: data.results?.map((r: any) => ({ title: r.title, url: r.url, content: r.content?.slice(0, 350) })) };
  } catch { return null; }
}

// ── Recherche base de données ─────────────────────────────────────────────────
async function searchDatabase(q: string) {
  try {
    const term = `%${q.toLowerCase()}%`;
    const [services, members, requests] = await Promise.all([
      query(`SELECT title, user_name, category, credit_cost, status FROM services WHERE LOWER(title) LIKE $1 OR LOWER(description) LIKE $1 LIMIT 4`, [term]),
      query(`SELECT first_name, last_name, offered_skills, department, country FROM users WHERE LOWER(first_name||' '||last_name) LIKE $1 OR LOWER(offered_skills::text) LIKE $1 LIMIT 4`, [term]),
      query(`SELECT title, user_name, category, credit_offer FROM requests WHERE LOWER(title) LIKE $1 LIMIT 4`, [term]),
    ]);
    return { services: services.rows, members: members.rows, requests: requests.rows };
  } catch { return null; }
}

// ── Sauvegarde mémoire Supabase ────────────────────────────────────────────────
async function saveMemory(userId: string | null, role: string, content: string) {
  if (!userId) return;
  try {
    await query(
      `INSERT INTO ai_memory (user_id, role, content, created_at) VALUES ($1, $2, $3, NOW())`,
      [userId, role, content.slice(0, 2000)]
    );
  } catch { /* table peut ne pas exister encore */ }
}

// ── Appel Groq ────────────────────────────────────────────────────────────────
async function callGroq(model: string, system: string, messages: any[]) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, ...messages], max_tokens: 1024, temperature: 0.6 }),
  });
  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// ── Appel Claude ──────────────────────────────────────────────────────────────
async function callClaude(model: string, system: string, messages: any[]) {
  const response = await anthropic.messages.create({
    model,
    max_tokens: 2048,
    system,
    messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
  });
  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// ── Appel OpenAI ──────────────────────────────────────────────────────────────
async function callOpenAI(model: string, system: string, messages: any[]) {
  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, ...messages], max_tokens: 1024, temperature: 0.8 }),
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// ── Fallback en cascade ───────────────────────────────────────────────────────
async function callWithFallback(decision: RoutingDecision, system: string, messages: any[]): Promise<{ reply: string; usedProvider: AIProvider }> {
  const order: AIProvider[] = decision.provider === 'groq'
    ? ['groq', 'claude', 'openai']
    : decision.provider === 'claude'
    ? ['claude', 'groq', 'openai']
    : ['openai', 'claude', 'groq'];

  for (const provider of order) {
    try {
      let reply = '';
      if (provider === 'groq')
        reply = await callGroq(decision.provider === 'groq' ? decision.model : 'llama-3.3-70b-versatile', system, messages);
      else if (provider === 'claude')
        reply = await callClaude(decision.provider === 'claude' ? decision.model : 'claude-haiku-4-5-20251001', system, messages);
      else
        reply = await callOpenAI(decision.provider === 'openai' ? decision.model : 'gpt-4o-mini', system, messages);

      if (reply) return { reply, usedProvider: provider };
    } catch (e) {
      console.warn(`${provider} failed, trying next...`, e);
    }
  }
  return { reply: 'Désolé, tous les services IA sont temporairement indisponibles.', usedProvider: 'groq' };
}

// ── Route principale ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { messages, userContext, mode } = await req.json();
    if (!messages?.length)
      return NextResponse.json({ error: 'Messages requis' }, { status: 400 });

    const lastMessage    = messages[messages.length - 1]?.content || '';
    const recentMessages = messages.slice(-12);

    // 1. Détection automatique
    const decision = detectQueryType(lastMessage, messages);

    // 2. Recherches parallèles si nécessaire (page aldea seulement)
    let webResults = null;
    let dbResults  = null;
    let contextBlocks = '';

    if (mode === 'aldea') {
      [webResults, dbResults] = await Promise.all([
        decision.needsWeb ? searchWeb(lastMessage) : Promise.resolve(null),
        decision.needsDb  ? searchDatabase(lastMessage) : Promise.resolve(null),
      ]);

      if (webResults) {
        contextBlocks += `\n[WEB] ${webResults.answer || ''}\n`;
        webResults.results?.forEach((r: any) => {
          contextBlocks += `- ${r.title}: ${r.content} (${r.url})\n`;
        });
      }
      if (dbResults) {
        if (dbResults.services?.length) contextBlocks += `\n[SERVICES BDT] ${JSON.stringify(dbResults.services)}\n`;
        if (dbResults.members?.length)  contextBlocks += `\n[MEMBRES BDT] ${JSON.stringify(dbResults.members)}\n`;
        if (dbResults.requests?.length) contextBlocks += `\n[DEMANDES BDT] ${JSON.stringify(dbResults.requests)}\n`;
      }
    }

    // 3. Système prompt enrichi
    const userInfo = userContext ? `\nUtilisateur: ${JSON.stringify(userContext)}` : '';
    const system   = contextBlocks
      ? `${BASE_SYSTEM}${userInfo}\n\n${contextBlocks}\nUtilise ces données dans ta réponse.`
      : `${BASE_SYSTEM}${userInfo}`;

    // 4. Appel IA avec fallback
    const { reply, usedProvider } = await callWithFallback(decision, system, recentMessages);

    // 5. Sauvegarde mémoire
    if (userContext?.uid) {
      await saveMemory(userContext.uid, 'user',      lastMessage);
      await saveMemory(userContext.uid, 'assistant', reply);
    }

    return NextResponse.json({
      reply,
      meta: {
        provider:    usedProvider,
        model:       decision.model,
        reason:      decision.reason,
        searchedWeb: !!webResults,
        searchedDb:  !!dbResults,
      },
      sources:   webResults?.results || [],
      dbResults: dbResults || null,
    });

  } catch (error: any) {
    console.error('ALDÉA router error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
