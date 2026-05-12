"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Loader2, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { uploadToCloudinary } from '@/lib/useCloudinaryUpload';

interface AvatarUploadProps {
  currentAvatar?: string;
  firstName: string;
  userId: string;
  onSuccess: (newAvatarUrl: string) => void;
}

export default function AvatarUpload({ currentAvatar, firstName, userId, onSuccess }: AvatarUploadProps) {
  const [preview, setPreview]   = useState<string | null>(null);
  const [file, setFile]         = useState<File | null>(null);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setError('Fichier trop lourd (max 5 Mo)'); return; }
    setFile(f);
    setError('');
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      // Upload vers Cloudinary (ou Supabase Storage selon ce qui est dispo)
      let photoUrl = '';

      try {
        photoUrl = await uploadToCloudinary(file);
      } catch {
        // Fallback : Supabase Storage
        if (supabase) {
          const ext  = file.name.split('.').pop() ?? 'jpg';
          const path = `avatars/${userId}.${ext}`;
          const { error: uploadErr } = await supabase.storage
            .from('avatars')
            .upload(path, file, { upsert: true });
          if (uploadErr) throw uploadErr;
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
          photoUrl = urlData.publicUrl;
        } else {
          throw new Error('Aucun service de stockage disponible');
        }
      }

      // PATCH /api/profil
      const token = supabase
        ? ((await supabase.auth.getSession()).data.session?.access_token ?? '')
        : '';

      const res = await fetch('/api/profil', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: photoUrl }),
      });

      if (!res.ok) throw new Error('Erreur lors de la mise à jour');

      setSuccess(true);
      setPreview(null);
      setFile(null);
      onSuccess(photoUrl);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message || 'Erreur upload');
    } finally {
      setLoading(false);
    }
  };

  const cancel = () => { setPreview(null); setFile(null); setError(''); };

  const avatarSrc = preview || currentAvatar || '';

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar + overlay caméra */}
      <div className="relative group cursor-pointer" onClick={() => !loading && inputRef.current?.click()}>
        <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-100 border-4 border-white shadow-lg">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt="Avatar"
              width={96}
              height={96}
              className="object-cover w-full h-full"
              unoptimized={avatarSrc.startsWith('data:')}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-3xl font-bold">
              {firstName?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
        </div>
        {/* Overlay */}
        {!loading && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <Camera size={22} className="text-white" />
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
            <Loader2 size={22} className="text-white animate-spin" />
          </div>
        )}
        {success && (
          <div className="absolute inset-0 rounded-full bg-green-500/80 flex items-center justify-center">
            <Check size={22} className="text-white" />
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {/* Boutons confirmer / annuler */}
      {file && !loading && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpload}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            <Check size={13} /> Confirmer
          </button>
          <button
            onClick={cancel}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            <X size={13} /> Annuler
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
      {success && <p className="text-xs text-green-600 font-semibold">Photo mise à jour ✓</p>}

      {!file && (
        <p className="text-[11px] text-slate-400">Cliquez sur la photo pour la changer</p>
      )}
    </div>
  );
}
