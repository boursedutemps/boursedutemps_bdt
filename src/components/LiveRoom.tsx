"use client";

import React, { useState, useEffect, useRef, memo } from 'react';
import { LiveKitRoom, VideoConference, ControlBar, RoomAudioRenderer } from '@livekit/components-react';
import { supabase } from '@/lib/supabase/client';
import { PhoneOff, X, PenTool, Maximize2, Minimize2, Share2, Check, Hand, Settings, MessageSquare, Users, Volume2, VolumeX } from 'lucide-react';

interface LiveSession {
  id: number;
  roomName: string;
  roomUrl: string;
  title: string;
  type: string;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  participantCount: number;
  startedAt: string;
}

interface LiveRoomProps {
  session: LiveSession;
  localUserName: string;
  localUserEmail?: string;
  localUserAvatar?: string;
  isHost: boolean;
  onLeave: () => void;
  onEnd: () => void;
}

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL!;

function LiveRoomComponent({
  session, localUserName, isHost, onLeave, onEnd
}: LiveRoomProps) {
  const [token, setToken]           = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [isFullscreen, setIsFullscreen]     = useState(false);
  const [handRaised, setHandRaised]         = useState(false);
  const [copied, setCopied]                 = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings]     = useState(false);
  const [isMuted, setIsMuted]               = useState(false);
  const roomContainerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      roomContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleShare = async () => {
    const url  = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Rejoignez le live "${session.title}" sur Bourse du Temps : ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: session.title, text, url });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  const handleRaiseHand = () => {
    setHandRaised(v => !v);
    // Envoyer un message dans le chat LiveKit si disponible
    if (!handRaised) {
      const event = new CustomEvent('livekit-raise-hand', { detail: { userName: localUserName } });
      window.dispatchEvent(event);
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Injecter le CSS LiveKit dynamiquement — évite les problèmes webpack/PostCSS
  useEffect(() => {
    const id = 'livekit-styles';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id   = id;
    link.rel  = 'stylesheet';
    link.href = '/livekit.css';
    document.head.appendChild(link);
  }, []);

  const onLeaveRef = useRef(onLeave);
  const onEndRef   = useRef(onEnd);
  useEffect(() => { onLeaveRef.current = onLeave; }, [onLeave]);
  useEffect(() => { onEndRef.current   = onEnd;   }, [onEnd]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = supabase
          ? ((await supabase.auth.getSession()).data.session?.access_token ?? '')
          : '';
        const res = await fetch('/api/livekitToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ roomName: session.roomName, userName: localUserName, isModerator: isHost }),
        });
        if (!res.ok) throw new Error(`Token error ${res.status}`);
        const data = await res.json();
        setToken(data.token);
      } catch (err: any) {
        setTokenError(err.message || 'Impossible de récupérer le token LiveKit');
      }
    };
    fetchToken();
  }, [session.roomName, localUserName, isHost]);

  if (tokenError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-950 rounded-[2rem] p-12 text-center">
        <span className="text-4xl mb-4">⚠️</span>
        <p className="text-white font-bold text-lg mb-2">Impossible de rejoindre la session</p>
        <p className="text-slate-400 text-sm mb-6">{tokenError}</p>
        <button onClick={() => onLeaveRef.current()} className="bg-slate-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-600 transition">Retour</button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-950 rounded-[2rem]">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Connexion en cours...</p>
      </div>
    );
  }

  return (
    <div ref={roomContainerRef} className="flex flex-col h-full bg-slate-950 rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex-shrink-0 flex-wrap gap-2">
        {/* Titre */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
          <span className="text-white text-sm font-bold tracking-wide">{session.title}</span>
          <span className="text-slate-400 text-[10px] uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded-md font-semibold">{session.type}</span>
        </div>

        {/* Outils */}
        <div className="flex items-center gap-1.5 flex-wrap">

          {/* Lever la main */}
          <button
            onClick={handleRaiseHand}
            title={handRaised ? 'Baisser la main' : 'Lever la main'}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition ${
              handRaised ? 'bg-yellow-500 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Hand size={12} /> {handRaised ? '✋ Main levée' : 'Lever la main'}
          </button>

          {/* Tableau blanc */}
          <button
            onClick={() => setShowWhiteboard(!showWhiteboard)}
            title="Tableau blanc collaboratif"
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition ${
              showWhiteboard ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <PenTool size={12} /> Tableau
          </button>

          {/* Participants */}
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            title="Participants"
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition ${
              showParticipants ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Users size={12} /> Participants
          </button>

          {/* Partager */}
          <button
            onClick={handleShare}
            title="Partager le lien"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl transition"
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Share2 size={12} />}
            {copied ? 'Copié !' : 'Partager'}
          </button>

          {/* Plein écran */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl transition"
          >
            {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            {isFullscreen ? 'Réduire' : 'Plein écran'}
          </button>

          {/* Paramètres */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Paramètres"
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition ${
              showSettings ? 'bg-slate-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Settings size={12} />
          </button>

          {/* Terminer / Quitter */}
          {isHost ? (
            <button onClick={() => onEndRef.current()} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-xl font-semibold transition">
              <PhoneOff size={12} /> Terminer
            </button>
          ) : (
            <button onClick={() => onLeaveRef.current()} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-xl font-semibold transition">
              <PhoneOff size={12} /> Quitter
            </button>
          )}
        </div>
      </div>

      {/* Panneau paramètres */}
      {showSettings && (
        <div className="flex-shrink-0 bg-slate-900 border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white text-sm font-bold flex items-center gap-2"><Settings size={14} /> Paramètres audio/vidéo</span>
            <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="bg-slate-800 rounded-xl p-3">
              <p className="font-semibold mb-1 text-white">Serveur LiveKit</p>
              <p className="text-slate-400 truncate">{process.env.NEXT_PUBLIC_LIVEKIT_URL || 'configuré'}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-3">
              <p className="font-semibold mb-1 text-white">Salle</p>
              <p className="text-slate-400 truncate">{session.roomName}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-3">
              <p className="font-semibold mb-1 text-white">Identité</p>
              <p className="text-slate-400">{localUserName}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-3">
              <p className="font-semibold mb-1 text-white">Rôle</p>
              <p className="text-slate-400">{isHost ? '🎙 Hôte' : '👤 Participant'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Zone vidéo */}
      <div className="flex-1 relative overflow-hidden">
        {showWhiteboard && (
          <div className="absolute inset-4 z-30 bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-blue-500 flex flex-col">
            <div className="flex items-center justify-between p-2 bg-slate-100 border-b">
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-2"><PenTool size={16} /> Tableau blanc collaboratif</span>
              <button onClick={() => setShowWhiteboard(false)} className="p-1 hover:bg-slate-300 rounded-lg"><X size={18} className="text-slate-600" /></button>
            </div>
            <iframe src="https://excalidraw.com" className="w-full flex-1 bg-white" />
          </div>
        )}
        <div data-lk-theme="default" style={{ height: '100%', width: '100%' }}>
          <LiveKitRoom
            token={token}
            serverUrl={LIVEKIT_URL}
            connect={true}
            video={true}
            audio={true}
            onDisconnected={() => onLeaveRef.current()}
            style={{ height: '100%' }}
          >
            <VideoConference />
            <RoomAudioRenderer />
          </LiveKitRoom>
        </div>
      </div>
    </div>
  );
}

export default memo(LiveRoomComponent);
