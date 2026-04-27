"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { BlogPost, User, MediaItem, BlogComment } from '../../types';
import { Edit2, Trash2, MessageCircle, Heart, Share2, ExternalLink } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import { uploadToCloudinary } from '../../lib/useCloudinaryUpload';

interface BlogProps {
  blogs: BlogPost[];
  user: User | null;
  onUpdate: (b: BlogPost[]) => void;
  onAuthClick: () => void;
}

const Blog: React.FC<BlogProps> = ({ blogs: initialBlogs, user, onUpdate, onAuthClick }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [showAdd, setShowAdd] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Expérience');
  const [mediaData, setMediaData] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [externalLink, setExternalLink] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [displayLimit, setDisplayLimit] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  React.useEffect(() => { setBlogs(initialBlogs); }, [initialBlogs]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && displayLimit < blogs.length && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => { setDisplayLimit(prev => prev + 5); setIsLoadingMore(false); }, 800);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [blogs.length, displayLimit, isLoadingMore]);

  const token = () => localStorage.getItem('token') || '';
  const headers = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` });

  const resetForm = () => { setNewTitle(''); setNewContent(''); setMediaData(null); setExternalLink(''); setCommentText(''); };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      const result = await uploadToCloudinary(file, 'boursedutemps/media');
      if (result.secure_url) { setMediaData(result.secure_url); setMediaType(file.type.startsWith('video') ? 'video' : 'image'); }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => { setMediaData(reader.result as string); setMediaType(file.type.startsWith('video') ? 'video' : 'image'); };
      reader.readAsDataURL(file);
    } finally { setUploadingMedia(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer définitivement cette publication ?")) return;
    await fetch('/api/blogs', { method: 'DELETE', headers: headers(), body: JSON.stringify({ id }) });
    const updated = blogs.filter(b => b.id !== id);
    setBlogs(updated); onUpdate(updated);
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const media: MediaItem[] = mediaData ? [{ type: mediaType, url: mediaData }] : [];
    const postData = {
      authorId: user.uid,
      authorName: `${user.firstName} ${user.lastName}`,
      authorAvatar: user.avatar,
      title: newTitle,
      content: newContent,
      category: newCategory,
      media,
      externalLink,
    };

    if (editingPost) {
      await fetch(`/api/blogs/${editingPost.id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(postData) });
      const updated = blogs.map(b => b.id === editingPost.id ? { ...b, ...postData } : b);
      setBlogs(updated); onUpdate(updated);
    } else {
      const res = await fetch('/api/blogs', { method: 'POST', headers: headers(), body: JSON.stringify(postData) });
      const data = await res.json();
      const newBlog: BlogPost = { ...postData, id: data.id, likes: [], dislikes: [], reposts: 0, shares: 0, comments: [], createdAt: new Date().toISOString() };
      const updated = [newBlog, ...blogs];
      setBlogs(updated); onUpdate(updated);
    }

    setShowAdd(false); setEditingPost(null); resetForm();
  };

  const handleLike = async (blog: BlogPost) => {
    if (!user) { onAuthClick(); return; }
    const hasLiked = (blog.likes || []).includes(user.uid);
    const newLikes = hasLiked ? blog.likes.filter(id => id !== user.uid) : [...blog.likes, user.uid];
    await fetch(`/api/blogs/${blog.id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ likes: newLikes }) });
    setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, likes: newLikes } : b));
  };

  const handleShare = async (blog: BlogPost) => {
    const newShares = (blog.shares || 0) + 1;
    if (navigator.share) {
      try { await navigator.share({ title: blog.title, text: blog.content, url: window.location.href }); } catch {}
    } else { navigator.clipboard.writeText(window.location.href); alert("Lien copié !"); }
    await fetch(`/api/blogs/${blog.id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ shares: newShares }) });
    setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, shares: newShares } : b));
  };

  const handleComment = async (blog: BlogPost) => {
    if (!user) { onAuthClick(); return; }
    if (!commentText.trim()) return;
    const newComment: BlogComment = {
      id: Math.random().toString(36).substr(2, 9),
      authorId: user.uid,
      authorName: `${user.firstName} ${user.lastName}`,
      authorAvatar: user.avatar,
      content: commentText,
      createdAt: new Date().toISOString(),
    };
    const newComments = [...(blog.comments || []), newComment];
    await fetch(`/api/blogs/${blog.id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ comments: newComments }) });
    setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, comments: newComments } : b));
    setCommentText(''); setActiveCommentPost(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-heading text-4xl font-bold text-slate-900">Fil de la Communauté</h1>
          <p className="text-slate-500 mt-2">Partagez vos expériences et vos succès.</p>
        </div>
        <button
          onClick={() => { if (!user) { onAuthClick(); return; } setEditingPost(null); resetForm(); setShowAdd(true); }}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
        >
          + Publier
        </button>
      </div>

      {showAdd && (
        <div className="mb-12 bg-white rounded-[2.5rem] p-8 shadow-xl border border-blue-50">
          <h2 className="font-heading text-xl font-bold mb-6">{editingPost ? 'Modifier ma publication' : 'Partager mon expérience'}</h2>
          <form onSubmit={handlePost} className="space-y-6">
            <input required placeholder="Titre accrocheur" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <RichTextEditor value={newContent} onChange={setNewContent} placeholder="Racontez votre histoire..." maxLength={8000} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                {['Expérience','Succès','Tutoriel','Actualité'].map(c => <option key={c}>{c}</option>)}
              </select>
              <div className="relative">
                <input type="file" accept="image/*,video/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-200 transition flex items-center justify-center gap-2">
                  {uploadingMedia ? "⏳ Upload..." : mediaData ? "✅ Fichier prêt" : "📁 Importer Photo/Vidéo"}
                </button>
              </div>
            </div>
            {mediaData && (
              <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 p-2">
                {mediaType === 'image' ? <div className="relative w-full h-40"><Image src={mediaData} fill className="object-cover rounded-xl" alt="Preview" unoptimized={mediaData.startsWith('data:')} /></div> : <video src={mediaData} className="w-full h-40 object-cover rounded-xl" />}
                <button type="button" onClick={() => setMediaData(null)} className="text-xs text-red-500 font-bold p-2 hover:underline">Supprimer</button>
              </div>
            )}
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold">{editingPost ? 'Mettre à jour' : 'Publier maintenant'}</button>
              <button type="button" onClick={() => { setShowAdd(false); setEditingPost(null); }} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold">Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-10">
        {blogs.slice(0, displayLimit).map(blog => (
          <article key={blog.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm relative">
                  {blog.authorAvatar ? <Image src={blog.authorAvatar} alt="Author" fill className="object-cover" unoptimized={blog.authorAvatar.startsWith('data:')} /> : <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">{blog.authorName?.[0]}</div>}
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-slate-800">{blog.authorName}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(blog.createdAt).toLocaleDateString()} • {blog.category}</p>
                </div>
                {user && (user.uid === blog.authorId || user.role === 'admin') && (
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingPost(blog); setNewTitle(blog.title ?? ''); setNewContent(blog.content ?? ''); setNewCategory(blog.category ?? ''); if (blog.media?.[0]) { setMediaData(blog.media[0].url); setMediaType(blog.media[0].type); } setShowAdd(true); }} className="p-2 text-slate-400 hover:text-blue-600 transition"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(blog.id)} className="p-2 text-slate-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
                  </div>
                )}
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-4">{blog.title}</h2>
              <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">{blog.content}</p>
              {blog.media?.[0] && (
                <div className="rounded-3xl overflow-hidden mb-6 bg-slate-50 border border-slate-100 relative min-h-[200px]">
                  {blog.media[0].type === 'image' ? <Image src={blog.media[0].url} alt="Media" width={800} height={500} className="w-full h-auto max-h-[500px] object-cover" unoptimized={blog.media[0].url.startsWith('data:')} /> : <video src={blog.media[0].url} controls className="w-full h-auto max-h-[500px]" />}
                </div>
              )}
              {blog.externalLink && (
                <a href={blog.externalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline mb-6">
                  <ExternalLink size={16} />{blog.externalLink}
                </a>
              )}
              <div className="flex items-center gap-6 border-t border-slate-100 pt-6">
                <button onClick={() => handleLike(blog)} className={`flex items-center gap-2 font-bold transition ${user && (blog.likes || []).includes(user.uid) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}>
                  <Heart size={20} className={user && (blog.likes || []).includes(user.uid) ? 'fill-current' : ''} />
                  <span>{(blog.likes || []).length}</span>
                </button>
                <button onClick={() => setActiveCommentPost(activeCommentPost === blog.id ? null : blog.id)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition">
                  <MessageCircle size={20} /><span>{(blog.comments || []).length}</span>
                </button>
                <button onClick={() => handleShare(blog)} className="flex items-center gap-2 text-slate-400 hover:text-green-600 font-bold transition ml-auto">
                  <Share2 size={20} /><span>{blog.shares || 0}</span>
                </button>
              </div>
              {activeCommentPost === blog.id && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="space-y-4 mb-6">
                    {(blog.comments || []).map(comment => (
                      <div key={comment.id} className="bg-slate-50 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden relative">
                            {comment.authorAvatar ? <Image src={comment.authorAvatar} alt="" fill className="object-cover" unoptimized={comment.authorAvatar.startsWith('data:')} /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">{comment.authorName?.[0]}</div>}
                          </div>
                          <span className="font-bold text-sm text-slate-800">{comment.authorName}</span>
                          <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-600 pl-8">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Ajouter un commentaire..." className="flex-grow px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={commentText} onChange={e => setCommentText(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleComment(blog)} />
                    <button onClick={() => handleComment(blog)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm">Envoyer</button>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <div ref={observerTarget} className="py-12 flex justify-center">
        {displayLimit < blogs.length ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-medium">Chargement...</p>
          </div>
        ) : blogs.length > 0 ? (
          <p className="text-slate-400 text-sm font-medium">Vous avez atteint la fin du fil.</p>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 font-medium">Aucune publication. Soyez le premier !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
