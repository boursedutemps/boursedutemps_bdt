"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2, ExternalLink } from 'lucide-react';
import { useUser } from './UserProvider';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isComplex?: boolean;
}

const SUGGESTIONS = [
  "Comment publier un service ?",
  "Comment fonctionnent les crédits ?",
  "Comment contacter un membre ?",
  "Comment créer un compte ?",
];

// Seuil : si la requête est détectée complexe par le router, on propose la redirection
const COMPLEX_REDIRECT_MSG = `Cette question mérite une analyse approfondie 🔍\n\nJe peux vous répondre ici, mais la **page Recherche IA** vous donnera une réponse plus complète avec accès au web et aux modèles avancés.`;

export default function AIChat() {
  const { user }  = useUser();
  const router    = useRouter();
  const [isOpen, setIsOpen]             = useState(false);
  const [isMinimized, setIsMinimized]   = useState(false);
  const [messages, setMessages]         = useState<Message[]>([]);
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [unread, setUnread]             = useState(0);
  const [pendingComplex, setPendingComplex] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = user
        ? `Bonjour ${user.firstName} 👋 Je suis ALDÉA, votre assistante de Bourse du Temps. Comment puis-je vous aider ?`
        : "Bonjour 👋 Je suis ALDÉA, votre assistante de Bourse du Temps. Comment puis-je vous aider ?";
      setMessages([{ role: 'assistant', content: welcome }]);
    }
  }, [isOpen, user]);

  const redirectToSearch = (query: string) => {
    setIsOpen(false);
    router.push(`/recherche?q=${encodeURIComponent(query)}`);
  };

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setPendingComplex(null);

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
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          userContext,
          mode: 'chat',
        }),
      });

      const data = await res.json();
      const isComplex = data.meta?.isComplex === true;
      const reply     = data.reply || 'Désolé, une erreur est survenue.';

      if (isComplex) {
        // Affiche la réponse + bouton redirection
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: reply,
          isComplex: true,
        }]);
        setPendingComplex(content);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      }

      if (!isOpen) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Désolé, je suis temporairement indisponible. Réessayez dans un moment.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => { setIsOpen(!isOpen); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl shadow-blue-200 flex items-center justify-center transition-all duration-300 hover:scale-110"
        title="ALDÉA"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        {!isOpen && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Fenêtre de chat */}
      {isOpen && !isMinimized && (
        <div
          className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden"
          style={{ height: '520px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-blue-600 text-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <p className="font-bold text-sm">ALDÉA</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-[11px] text-blue-100">En ligne</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Lien vers page recherche */}
              <button
                onClick={() => router.push('/recherche')}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
                title="Ouvrir la page Recherche IA"
              >
                <ExternalLink size={14} />
              </button>
              <button onClick={() => setIsMinimized(true)} className="p-1.5 hover:bg-white/20 rounded-lg transition">
                <Minimize2 size={14} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-blue-600'
                  }`}>
                    {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>

                {/* Bouton redirection si question complexe */}
                {msg.isComplex && pendingComplex && i === messages.length - 1 && (
                  <div className="mt-2 ml-10 flex flex-col gap-1.5">
                    <p className="text-[11px] text-slate-400">Voulez-vous une réponse plus approfondie ?</p>
                    <button
                      onClick={() => redirectToSearch(pendingComplex)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition w-fit"
                    >
                      <ExternalLink size={12} />
                      Ouvrir dans Recherche IA
                    </button>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <Bot size={13} className="text-blue-600" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-blue-600" />
                  <span className="text-xs text-slate-500">En train de répondre...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 flex-shrink-0">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-100 transition font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question..."
              disabled={loading}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 dark:text-slate-200"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-2xl flex items-center justify-center transition flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Version minimisée */}
      {isOpen && isMinimized && (
        <div
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-24 right-6 z-50 bg-blue-600 text-white px-4 py-3 rounded-2xl shadow-xl cursor-pointer hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Bot size={16} />
          <span className="text-sm font-semibold">ALDÉA</span>
          {unread > 0 && (
            <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </div>
      )}
    </>
  );
}
