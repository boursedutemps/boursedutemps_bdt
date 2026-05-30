"use client";

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import { useUser } from '@/components/UserProvider';
import {
  Send, Bot, User, Loader2, Trash2, Download,
  Globe, Database, Sparkles, ChevronDown, Zap,
  Brain, Search, MessageSquare, Cpu, ArrowLeft,
} from 'lucide-react';

const PROVIDER_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  groq:       { label: 'Groq · LLaMA',  color: 'text-orange-500 bg-orange-50 border-orange-200',   icon: <Zap size={11} /> },
  claude:     { label: 'Claude',         color: 'text-purple-500 bg-purple-50 border-purple-200',   icon: <Brain size={11} /> },
  openai:     { label: 'GPT-4o',         color: 'text-emerald-500 bg-emerald-50 border-emerald-200', icon: <Sparkles size={11} /> },
  gemini:     { label: 'Gemini',         color: 'text-blue-500 bg-blue-50 border-blue-200',         icon: <Globe size={11} /> },
  kimi:       { label: 'Kimi',           color: 'text-pink-500 bg-pink-50 border-pink-200',         icon: <MessageSquare size={11} /> },
  perplexity: { label: 'Perplexity',     color: 'text-cyan-500 bg-cyan-50 border-cyan-200',         icon: <Search size={11} /> },
};

const SUGGESTIONS = [
  { icon: '🌍', text: "Quelles sont les dernières actualités en Haïti ?" },
  { icon: '🤝', text: 'Trouve des membres qui proposent des cours de langues' },
  { icon: '📊', text: 'Analyse les avantages du travail à distance' },
  { icon: '💡', text: 'Rédige une présentation pour mon service de design' },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; url: string; content: string }[];
  provider?: string;
  reason?: string;
  timestamp: Date;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  const [showSources, setShowSources] = useState(false);
  const meta = msg.provider ? PROVIDER_META[msg.provider] : null;

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
        isUser ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={`max-w-[78%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`flex items-center gap-2 text-[11px] text-slate-400 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="font-semibold">{isUser ? 'Vous' : 'ALDÉA'}</span>
          <span>{formatTime(msg.timestamp)}</span>
          {meta && (
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${meta.color}`}>
              {meta.icon} {meta.label}
            </span>
          )}
          {msg.reason && (
            <span className="text-[10px] text-slate-300 italic hidden group-hover:inline">{msg.reason}</span>
          )}
        </div>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-white text-slate-800 rounded-tl-sm shadow-sm border border-slate-100'
        }`}>
          {msg.content}
        </div>
        {msg.sources && msg.sources.length > 0 && (
          <div className="w-full">
            <button onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-1.5 text-[11px] text-blue-500 hover:text-blue-600 font-medium">
              <Globe size={11} />
              {msg.sources.length} source{msg.sources.length > 1 ? 's' : ''} web
              <ChevronDown size={11} className={`transition-transform ${showSources ? 'rotate-180' : ''}`} />
            </button>
            {showSources && (
              <div className="mt-2 space-y-1.5">
                {msg.sources.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl hover:bg-slate-100 transition">
                    <Globe size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-slate-700">{s.title}</p>
                      <p className="text-[10px] text-slate-400 truncate">{s.url}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchContent() {
  const { user }     = useUser();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [searching, setSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);
  const initialized    = useRef(false);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `Bonjour${user ? ` ${user.firstName}` : ''} 👋 Je suis **ALDÉA**, votre assistante IA. Comment puis-je vous aider ?`,
      timestamp: new Date(),
    }]);
  }, [user]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !initialized.current) {
      initialized.current = true;
      setTimeout(() => sendMessage(q), 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setSearching(true);

    try {
      const userContext = user ? {
        name:    `${user.firstName} ${user.lastName}`,
        email:   user.email,
        credits: user.credits,
        role:    user.role,
        country: user.country,
      } : null;

      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/ai/router', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, userContext, mode: 'search' }),
      });

      setSearching(false);
      const data = await res.json();

      setMessages(prev => [...prev, {
        role:      'assistant',
        content:   data.reply || 'Désolé, une erreur est survenue.',
        sources:   data.sources || [],
        provider:  data.meta?.provider,
        reason:    data.meta?.reason,
        timestamp: new Date(),
      }]);
    } catch {
      setSearching(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Désolé, je suis temporairement indisponible.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages, input, loading, user]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => setMessages([{
    role: 'assistant',
    content: 'Conversation effacée. Comment puis-je vous aider ?',
    timestamp: new Date(),
  }]);

  const exportChat = () => {
    const text = messages.map(m => `[${m.role === 'user' ? 'Vous' : 'ALDÉA'}] ${m.content}`).join('\n\n');
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    a.download = `aldea-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400">
            <ArrowLeft size={18} />
          </button>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Cpu size={22} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900 flex items-center gap-2">
              Recherche IA <Sparkles size={18} className="text-yellow-500" />
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>6 modèles · Routage automatique</span>
              <span>·</span>
              <Globe size={11} />
              <span>Web temps réel</span>
              <span>·</span>
              <Database size={11} />
              <span>Base connectée</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportChat}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition" title="Exporter">
            <Download size={16} />
          </button>
          <button onClick={clearChat}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition" title="Effacer">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4">
        {messages.length <= 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s.text)}
                className="flex items-center gap-3 bg-white border border-slate-200 hover:border-blue-300 p-3 rounded-2xl text-left transition group shadow-sm hover:shadow-md">
                <span className="text-xl">{s.icon}</span>
                <span className="text-xs text-slate-600 group-hover:text-blue-600 font-medium leading-tight">{s.text}</span>
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

        {loading && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-blue-600" />
              <span className="text-xs text-slate-500">
                {searching ? 'Sélection du modèle...' : 'ALDÉA réfléchit...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 pt-4 border-t border-slate-100">
        <div className="flex gap-3 items-end bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder="Posez n'importe quelle question... (Entrée pour envoyer)"
            disabled={loading}
            rows={1}
            style={{ resize: 'none', height: '24px' }}
            className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400 disabled:opacity-50 max-h-32 leading-relaxed"
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition flex-shrink-0">
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecherchePage() {
  return (
    <PageLayout>
      <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" /></div>}>
        <SearchContent />
      </Suspense>
    </PageLayout>
  );
}
