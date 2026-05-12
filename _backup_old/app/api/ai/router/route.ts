import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { query } from '@/lib/db';

// ── Clients ───────────────────────────────────────────────────────────────────
const anthropic  = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const TAVILY_KEY = process.env.TAVILY_API_KEY!;

// ── Système prompt ALDÉA ──────────────────────────────────────────────────────
const BASE_SYSTEM = `Tu es ALDÉA, l'assistante IA officielle de Bourse du Temps (Université Senghor).
Plateforme d'échange de services : 1h = 1 crédit. Nouveau membre : 10 crédits.
Pages : Accueil, Services, Demandes, Membres, Forum, Blog, Témoignages, Profil.
Stack : Next.js 14, Supabase, PostgreSQL, Cloudinary, LiveKit.
Règles : réponses claires et directes, ne jamais inventer de données, adapter la langue à l'utilisateur.`;

// ── Types ─────────────────────────────────────────────────────────────────────
type AIProvider = 'groq' | 'claude' | 'openai' | 'gemini' | 'kimi' | 'perplexity';

interface RoutingDecision {
  provider: AIProvider;
  model:    string;
  reason:   string;
  needsWeb: boolean;
  needsDb:  boolean;
  isComplex: boolean; // signal pour redirection page recherche
}

// ── Détection automatique ─────────────────────────────────────────────────────
function detectQueryType(message: string, history: any[]): RoutingDecision {
  const msg     = message.toLowerCase().trim();
  const words   = msg.split(/\s+/).length;

  const complexKw    = ['analyse','analyser','expliquer','pourquoi','comment ça fonctionne',
    'optimiser','déboguer','erreur','bug','sql','requête','code','architecture',
    'rapport','comparer','stratégie','recommande','aide-moi à','plan','raisonne',
    'pros et cons','avantages et inconvénients','refactor','éthique','philosophi'];

  const creativeKw   = ['rédige','écris','génère','crée','propose','idée','améliore',
    'reformule','traduis','résume','présentation','pitch','contenu','marketing',
    'description de service','biographie','slogan','poème'];

  const webKw        = ['actualité','news','aujourd\'hui','récent','prix','météo',
    'résultat','qui est','recherche','trouve','information sur','2024','2025','2026',
    'maintenant','internet','dernières'];

  const dbKw         = ['membre','propose','offre','disponible','compétence','cherche un',
    'trouver quelqu\'un','qui peut','service disponible'];

  const imageKw      = ['image','photo','vidéo','regarde','vois','analyse cette','décri'];

  const simpleKw     = ['bonjour','salut','merci','comment','où','quand','c\'est quoi',
    'combien','crédit','inscription','connexion','profil','service','demande',
    'menu','page','cliquer','naviguer','aide'];

  const needsWeb  = webKw.some(k => msg.includes(k));
  const needsDb   = dbKw.some(k => msg.includes(k));
  const longHistory = history.length > 6;
  const isComplex = words > 40 || complexKw.some(k => msg.includes(k)) || longHistory;

  // Perplexity : recherche web temps réel
  if (needsWeb && !needsDb)
    return { provider: 'perplexity', model: 'perplexity/llama-3.1-sonar-small-128k-online', reason: 'Recherche web temps réel', needsWeb, needsDb, isComplex: true };

  // Gemini : multimodal
  if (imageKw.some(k => msg.includes(k)))
    return { provider: 'gemini', model: 'gemini-1.5-flash', reason: 'Requête multimodale', needsWeb, needsDb, isComplex };

  // Claude : analyse complexe
  if (complexKw.some(k => msg.includes(k)) || (words > 40 && !needsWeb))
    return { provider: 'claude', model: 'claude-haiku-4-5-20251001', reason: 'Requête complexe/analyse', needsWeb, needsDb, isComplex: true };

  // OpenAI : créatif
  if (creativeKw.some(k => msg.includes(k)))
    return { provider: 'openai', model: 'gpt-4o-mini', reason: 'Requête créative', needsWeb, needsDb, isComplex };

  // Kimi : longues conversations
  if (longHistory)
    return { provider: 'kimi', model: 'moonshot-v1-8k', reason: 'Contexte long', needsWeb, needsDb, isComplex };

  // Groq : tout le reste (rapide, gratuit)
  return { provider: 'groq', model: words < 20 ? 'llama-3.1-8b-instant' : 'llama-3.3-70b-versatile', reason: 'Requête simple/FAQ', needsWeb, needsDb, isComplex: false };
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

// ── Mémoire ───────────────────────────────────────────────────────────────────
async function saveMemory(userId: string | null, role: string, content: string) {
  if (!userId) return;
  try {
    await query(
      `INSERT INTO ai_memory (user_id, role, content, created_at) VALUES ($1, $2, $3, NOW())`,
      [userId, role, content.slice(0, 2000)]
    );
  } catch {}
}

// ── Appels providers ──────────────────────────────────────────────────────────
async function callGroq(model: string, system: string, messages: any[]) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, ...messages], max_tokens: 1024, temperature: 0.6 }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callClaude(model: string, system: string, messages: any[]) {
  const response = await anthropic.messages.create({
    model, max_tokens: 2048, system,
    messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
  });
  return response.content[0].type === 'text' ? response.content[0].text : '';
}

async function callOpenAI(model: string, system: string, messages: any[]) {
  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, ...messages], max_tokens: 1024, temperature: 0.8 }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callGemini(system: string, messages: any[]) {
  const lastUser = [...messages].reverse().find((m: any) => m.role === 'user')?.content || '';
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `${system}\n\n${lastUser}` }] }] }),
    }
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callKimi(system: string, messages: any[]) {
  const res = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.KIMI_API_KEY}` },
    body: JSON.stringify({ model: 'moonshot-v1-8k', messages: [{ role: 'system', content: system }, ...messages], max_tokens: 1024, temperature: 0.6 }),
  });
  if (!res.ok) throw new Error(`Kimi ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callPerplexity(system: string, messages: any[]) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://boursedutemps.vercel.app',
    },
    body: JSON.stringify({
      model: 'perplexity/llama-3.1-sonar-small-128k-online',
      messages: [{ role: 'system', content: system }, ...messages],
      max_tokens: 1024,
    }),
  });
  if (!res.ok) throw new Error(`Perplexity ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// ── Fallback en cascade ───────────────────────────────────────────────────────
async function callWithFallback(decision: RoutingDecision, system: string, messages: any[]): Promise<{ reply: string; usedProvider: AIProvider }> {
  const chain: AIProvider[] = [
    decision.provider,
    'groq', 'claude', 'openai',
  ].filter((v, i, a) => a.indexOf(v) === i) as AIProvider[];

  for (const provider of chain) {
    try {
      let reply = '';
      if (provider === 'groq')       reply = await callGroq(decision.provider === 'groq' ? decision.model : 'llama-3.3-70b-versatile', system, messages);
      if (provider === 'claude')     reply = await callClaude(decision.provider === 'claude' ? decision.model : 'claude-haiku-4-5-20251001', system, messages);
      if (provider === 'openai')     reply = await callOpenAI(decision.provider === 'openai' ? decision.model : 'gpt-4o-mini', system, messages);
      if (provider === 'gemini')     reply = await callGemini(system, messages);
      if (provider === 'kimi')       reply = await callKimi(system, messages);
      if (provider === 'perplexity') reply = await callPerplexity(system, messages);
      if (reply) return { reply, usedProvider: provider };
    } catch (e) {
      console.warn(`[router] ${provider} failed:`, e);
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
    const decision       = detectQueryType(lastMessage, messages);

    // Recherches parallèles
    let webResults: any = null;
    let dbResults:  any = null;
    let contextBlocks   = '';

    if (mode === 'aldea' || mode === 'search') {
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

    const userInfo = userContext ? `\nUtilisateur: ${JSON.stringify(userContext)}` : '';
    const system   = contextBlocks
      ? `${BASE_SYSTEM}${userInfo}\n\n${contextBlocks}\nUtilise ces données dans ta réponse.`
      : `${BASE_SYSTEM}${userInfo}`;

    const { reply, usedProvider } = await callWithFallback(decision, system, recentMessages);

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
        isComplex:   decision.isComplex,
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
