"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { User, ForumTopic, MediaItem } from "@/types";
import RichTextEditor from "@/components/RichTextEditor";
import { uploadToCloudinary } from "@/lib/useCloudinaryUpload";
import { Edit2, Trash2, MessageCircle, Heart, Share2 } from "lucide-react";

interface ForumProps {
  user: User | null;
  topics: ForumTopic[];
}

const Forum: React.FC<ForumProps> = ({ user, topics }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editingPost, setEditingPost] = useState<ForumTopic | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [mediaData, setMediaData] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [externalLink, setExternalLink] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // -----------------------------
  // UPLOAD MEDIA
  // -----------------------------
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);

    try {
      const result = await uploadToCloudinary(file, "boursedutemps/media");

      if (result.secure_url) {
        setMediaData(result.secure_url);
        setMediaType(file.type.startsWith("video") ? "video" : "image");
      } else {
        throw new Error("Upload échoué");
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaData(reader.result as string);
        setMediaType(file.type.startsWith("video") ? "video" : "image");
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingMedia(false);
    }
  };

  // -----------------------------
  // DELETE POST
  // -----------------------------
  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer définitivement ce sujet ?")) return;

    await fetch(`/api/forum/${id}`, { method: "DELETE" });
  };

  // -----------------------------
  // CREATE / UPDATE POST
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Connectez-vous pour participer");

    const media: MediaItem[] = mediaData
      ? [{ type: mediaType, url: mediaData }]
      : [];

    const postData = {
      title: newTitle,
      message: newMsg,
      media,
      externalLink,
    };

    const method = editingPost ? "PUT" : "POST";
    const url = editingPost ? `/api/forum/${editingPost.id}` : "/api/forum";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    setShowAdd(false);
    setEditingPost(null);
    setNewTitle("");
    setNewMsg("");
    setMediaData(null);
    setExternalLink("");
  };

  // -----------------------------
  // LIKE
  // -----------------------------
  const handleLike = async (t: ForumTopic) => {
    if (!user) return alert("Connectez-vous pour participer");
    await fetch(`/api/forum/${t.id}/like`, { method: "POST" });
  };

  // -----------------------------
  // SHARE
  // -----------------------------
  const handleShare = async (t: ForumTopic) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.title,
          text: t.message,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié !");
    }

    await fetch(`/api/forum/${t.id}/share`, { method: "POST" });
  };

  // -----------------------------
  // COMMENT
  // -----------------------------
  const handleComment = async (t: ForumTopic) => {
    if (!user) return alert("Connectez-vous pour participer");
    if (!commentText.trim()) return;

    await fetch(`/api/forum/${t.id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText }),
    });

    setCommentText("");
    setActiveCommentPost(null);
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-heading text-4xl font-bold text-slate-900">
          Forum des échanges
        </h1>

        <button
          onClick={() => {
            if (!user) return alert("Connectez-vous pour participer");
            setEditingPost(null);
            setNewTitle("");
            setNewMsg("");
            setMediaData(null);
            setExternalLink("");
            setShowAdd(true);
          }}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition"
        >
          Nouveau Sujet
        </button>
      </div>

      {/* FORMULAIRE */}
      {showAdd && (
        <div className="mb-12 bg-white p-8 rounded-[2rem] border border-blue-100 shadow-xl shadow-blue-50">
          <h2 className="font-heading text-xl font-bold mb-6">
            {editingPost ? "Modifier le sujet" : "Lancer une discussion"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              placeholder="Titre du sujet"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <RichTextEditor
              value={newMsg}
              onChange={setNewMsg}
              placeholder="Votre message..."
              maxLength={6000}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="url"
                placeholder="Lien externe (optionnel)"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
              />

              <div className="relative">
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-100 border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-200 transition flex items-center justify-center gap-2 h-full"
                >
                  {mediaData ? "✅ Fichier prêt" : "📁 Importer Photo/Vidéo"}
                </button>
              </div>
            </div>

            {mediaData && (
              <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 p-2">
                {mediaType === "image" ? (
                  <div className="relative w-full h-40">
                    <Image
                      src={mediaData}
                      fill
                      className="object-cover rounded-xl"
                      alt="Preview"
                      unoptimized={mediaData.startsWith("data:")}
                    />
                  </div>
                ) : (
                  <video
                    src={mediaData}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                )}
                <button
                  type="button"
                  onClick={() => setMediaData(null)}
                  className="text-xs text-red-500 font-bold p-2 hover:underline"
                >
                  Supprimer le fichier
                </button>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold"
              >
                {editingPost ? "Mettre à jour" : "Publier"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  setEditingPost(null);
                }}
                className="bg-slate-100 text-slate-500 px-8 py-3 rounded-xl font-bold"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LISTE DES TOPICS */}
      <div className="space-y-6">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition group relative"
            >
              {/* ACTIONS ADMIN */}
              {user &&
                (user.uid === topic.authorId || user.role === "admin") && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingPost(topic);
                        setNewTitle(topic.title ?? "");
                        setNewMsg(topic.message ?? "");
                        setExternalLink(topic.externalLink || "");
                        if (topic.media?.length) {
                          setMediaData(topic.media[0].url);
                          setMediaType(topic.media[0].type);
                        }
                        setShowAdd(true);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-600 transition bg-white/80 backdrop-blur-sm rounded-full"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(topic.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition bg-white/80 backdrop-blur-sm rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

              {/* AUTEUR */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition overflow-hidden relative">
                  {topic.authorAvatar ? (
                    <Image
                      src={topic.authorAvatar}
                      alt="Author"
                      fill
                      className="object-cover"
                      unoptimized={topic.authorAvatar.startsWith("data:")}
                    />
                  ) : (
                    topic.authorName[0]
                  )}
                </div>

                <div className="flex-grow">
                  <h3 className="font-heading text-xl font-bold text-slate-800 mb-2 pr-16">
                    {topic.title}
                  </h3>

                  <p className="text-slate-500 text-sm mb-4">
                    {topic.message}
                  </p>

                  {/* LIEN EXTERNE */}
                  {topic.externalLink && (
                    <a
                      href={topic.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mb-4 text-blue-600 hover:underline text-sm font-medium"
                    >
                      🔗 Lien externe
                    </a>
                  )}

                  {/* MEDIA */}
                  {topic.media?.length > 0 && (
                    <div className="rounded-2xl overflow-hidden mb-4 bg-slate-50 border border-slate-100 relative min-h-[200px]">
                      {topic.media[0].type === "image" ? (
                        <Image
                          src={topic.media[0].url}
                          alt="Media"
                          width={800}
                          height={300}
                          className="w-full h-auto max-h-[300px] object-cover"
                          unoptimized={topic.media[0].url.startsWith("data:")}
                        />
                      ) : (
                        <video
                          src={topic.media[0].url}
                          controls
                          className="w-full h-auto max-h-[300px]"
                        />
                      )}
                    </div>
                  )}

                  {/* META */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Par {topic.authorName}
                    </span>
                    <span className="text-[10px] text-slate-300">
                      {new Date(topic.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-6 border-t border-slate-50 pt-4">
                    <button
                      onClick={() => handleLike(topic)}
                      className={`flex items-center gap-2 font-bold transition ${
                        user && (topic.likes || []).includes(user.uid)
                          ? "text-red-500"
                          : "text-slate-400 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        size={18}
                        className={
                          user && (topic.likes || []).includes(user.uid)
                            ? "fill-current"
                            : ""
                        }
                      />
                      <span className="text-xs">
                        {(topic.likes || []).length}
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        setActiveCommentPost(
                          activeCommentPost === topic.id ? null : topic.id
                        )
                      }
                      className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition"
                    >
                      <MessageCircle size={18} />
                      <span className="text-xs">
                        {(topic.comments || []).length}
                      </span>
                    </button>

                    <button
                      onClick={() => handleShare(topic)}
                      className="flex items-center gap-2 text-slate-400 hover:text-green-600 font-bold transition ml-auto"
                    >
                      <Share2 size={18} />
                      <span className="text-xs">{topic.shares || 0}</span>
                    </button>
                  </div>

                  {/* COMMENTAIRES */}
                  {activeCommentPost === topic.id && (
                    <div className="mt-4 pt-4 border-t border-slate-50 animate-in fade-in slide-in-from-top-4">
                      <div className="space-y-4 mb-4">
                        {(topic.comments || []).map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-slate-50 p-3 rounded-2xl"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden relative">
                                {comment.authorAvatar ? (
                                  <Image
                                    src={comment.authorAvatar}
                                    alt="Comment Author"
                                    fill
                                    className="object-cover"
                                    unoptimized={comment.authorAvatar.startsWith(
                                      "data:"
                                    )}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[8px] font-bold">
                                    {comment.authorName[0]}
                                  </div>
                                )}
                              </div>
                              <span className="font-bold text-xs text-slate-800">
                                {comment.authorName}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 pl-7">
                              {comment.content}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Commenter..."
                          className="flex-grow px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleComment(topic)
                          }
                        />
                        <button
                          onClick={() => handleComment(topic)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition"
                        >
                          Envoyer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <span className="text-5xl mb-4 block">💬</span>
            <p className="text-slate-400 font-medium">
              Aucune discussion en cours. Soyez le premier !
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
