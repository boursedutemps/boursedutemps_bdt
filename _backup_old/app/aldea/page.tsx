"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import PageLayout from '@/components/PageLayout';
import { useUser } from '@/components/UserProvider';
import {
  Send, Bot, User, Loader2, Trash2, Download,
  Globe, Database, Sparkles, ChevronDown
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; url: string; content: string }[];
  timestamp: Date;
}

const SUGGESTIONS = [
  { icon: '🌍', text: 'Quelles sont les dernières actualités en Haïti ?' },
  { icon: '🔧', text: 'Comment optimiser une requête PostgreSQL ?' },
  { icon: '🤝', text: 'Trouve-moi des membres qui proposent des cours de langues' },
  { icon: '📊', text: 'Explique-moi comment fonctionne Bourse du Temps' },
  { icon: '💡', text: 'Traduis "Bonjour, comment allez-vous ?" en créole haïtien' },
  { icon: '🔍', text: 'Quels services sont disponibles en ce moment ?' },
];

function formatTime(date: Date) {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  const [showSources, setShowSources] = useState(false);

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      {/* Avatar */}
      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
        isUser ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div className={`max-w-[75%] space-y-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Nom + heure */}
        <div className={`flex items-center gap-2 text-[11px] text-slate-400 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="font-semibold">{isUser ? 'Vous' : 'ALDÉA'}</span>
          <span>{formatTime(msg.timestamp)}</span>
        </div>

        {/* Bulle */}
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-700'
        }`}>
          {msg.content}
        </div>

        {/* Sources web */}
        {msg.sources && msg.sources.length > 0 && (
          <div className="w-full">
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-1.5 text-[11px] text-blue-500 hover:text-blue-600 font-medium"
            >
              <Globe size={11} />
              {msg.sources.length} source{msg.sources.length > 1 ? 's' : ''} web
              <ChevronDown size={11} className={`transition-transform ${showSources ? 'rotate-180' : ''}`} />
            </button>
            {showSources && (
              <div className="mt-2 space-y-1.5">
                {msg.sources.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-2 bg-slate-50 dark:bg-slate-700 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition"
                  >
                    <Globe size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">{s.title}</p>
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

export default function AldeaPage() {
  const { user } = useUser();
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [searching, setSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Message de bienvenue
    setMessages([{
      role: 'assistant',
      content: `Bonjour${user ? ` ${user.firstName}` : ''} 👋 Je suis **ALDÉA**, votre assistante IA de Bourse du Temps.\n\nJe peux :\n• Répondre à vos questions générales\n• Rechercher des infos sur le web en temps réel\n• Trouver des membres et services sur la plateforme\n• Vous aider en français, créole, anglais ou arabe\n\nComment puis-je vous aider aujourd'hui ?`,
      timestamp: new Date(),
    }]);
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: 'user', content, timestamp: new Date() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
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

      const res = await fetch('/api/ai/router', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'aldea',
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          userContext,
        }),
      });

      setSearching(false);
      const data = await res.json();

      setMessages(prev => [...prev, {
        role:      'assistant',
        content:   data.reply || 'Désolé, une erreur est survenue.',
        sources:   data.sources || [],
        timestamp: new Date(),
      }]);
    } catch {
      setSearching(false);
      setMessages(prev => [...prev, {
        role:      'assistant',
        content:   'Désolé, je suis temporairement indisponible. Réessayez dans un moment.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages, input, loading, user]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role:      'assistant',
      content:   'Conversation effacée. Comment puis-je vous aider ?',
      timestamp: new Date(),
    }]);
  };

  const exportChat = () => {
    const text = messages.map(m => `[${m.role === 'user' ? 'Vous' : 'ALDÉA'}] ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `aldea-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Bot size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                ALDÉA <Sparkles size={18} className="text-yellow-500" />
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>En ligne</span>
                <span>·</span>
                <Globe size={11} />
                <span>Recherche web active</span>
                <span>·</span>
                <Database size={11} />
                <span>Base de données connectée</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportChat} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl transition" title="Exporter la conversation">
              <Download size={16} />
            </button>
            <button onClick={clearChat} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-xl transition" title="Effacer la conversation">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Zone messages */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 scrollbar-hide">

          {/* Suggestions (au début) */}
          {messages.length <= 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s.text)}
                  className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 p-3 rounded-2xl text-left transition group shadow-sm hover:shadow-md"
                >
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-xs text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium leading-tight">{s.text}</span>
                </button>
              ))}
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-blue-600" />
                <span className="text-xs text-slate-500">
                  {searching ? 'Recherche en cours...' : 'ALDÉA réfléchit...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="flex-shrink-0 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex gap-3 items-end bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez n'importe quelle question... (Entrée pour envoyer)"
              disabled={loading}
              rows={1}
              style={{ resize: 'none' }}
              className="flex-1 bg-transparent outline-none text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 disabled:opacity-50 min-h-[24px] max-h-32 leading-relaxed"
              onInput={e => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 128) + 'px';
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            ALDÉA peut faire des erreurs. Vérifiez les informations importantes. · Propulsé par LLaMA 3.3 + Tavily
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
