"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { User, Service, Request } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { Users, ShieldCheck, BarChart3, Trash2, UserCheck, UserX, RefreshCw } from 'lucide-react';

interface ModerationProps {
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  services: Service[];
  onUpdateServices: (services: Service[]) => void;
  requests: Request[];
  onUpdateRequests: (requests: Request[]) => void;
  currentUser: User;
  onRefresh: () => Promise<void>;
}

async function getToken(): Promise<string> {
  return supabase
    ? ((await supabase.auth.getSession()).data.session?.access_token ?? '')
    : '';
}

const Moderation: React.FC<ModerationProps> = ({
  users, onUpdateUsers, services, onUpdateServices, requests, onUpdateRequests, currentUser, onRefresh
}) => {
  const isAdmin = currentUser.role === 'admin';
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'services' | 'requests'>('stats');
  const [loading, setLoading] = useState<string | null>(null);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalUsers    = users.length;
  const activeUsers   = users.filter(u => u.status !== 'deactivated' && u.status !== 'deleted').length;
  const adminCount    = users.filter(u => u.role === 'admin').length;
  const modCount      = users.filter(u => u.role === 'moderator').length;
  const totalServices = services.length;
  const totalRequests = requests.length;
  const pendingServices = services.filter(s => s.status === 'pending').length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;

  // ── Changer le rôle ────────────────────────────────────────────────────────
  const changeRole = async (userId: string, newRole: 'user' | 'moderator') => {
    if (!isAdmin) return alert("Seul l'administrateur peut changer les rôles.");
    setLoading(`role-${userId}`);
    try {
      const token = await getToken();
      await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      onUpdateUsers(users.map(u => u.uid === userId ? { ...u, role: newRole } : u));
    } finally {
      setLoading(null);
    }
  };

  // ── Changer le statut utilisateur ──────────────────────────────────────────
  const changeStatus = async (userId: string, newStatus: 'active' | 'deactivated') => {
    setLoading(`status-${userId}`);
    try {
      const token = await getToken();
      await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      onUpdateUsers(users.map(u => u.uid === userId ? { ...u, status: newStatus } : u));
    } finally {
      setLoading(null);
    }
  };

  // ── Supprimer service ──────────────────────────────────────────────────────
  const deleteService = async (sid: string) => {
    if (!confirm("Supprimer cette annonce ?")) return;
    setLoading(`service-${sid}`);
    try {
      const token = await getToken();
      await fetch(`/api/services/${sid}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdateServices(services.filter(s => s.id !== sid));
    } finally {
      setLoading(null);
    }
  };

  // ── Supprimer demande ──────────────────────────────────────────────────────
  const deleteRequest = async (rid: string) => {
    if (!confirm("Supprimer cette demande ?")) return;
    setLoading(`request-${rid}`);
    try {
      const token = await getToken();
      await fetch(`/api/requests/${rid}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdateRequests(requests.filter(r => r.id !== rid));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-4xl font-bold text-slate-900">Espace de Modération</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez les membres, contenus et paramètres de la plateforme</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-xl font-bold text-sm ${isAdmin ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-600'}`}>
            {isAdmin ? '👑 Administrateur' : '🛡️ Modérateur'}
          </span>
          <button onClick={onRefresh} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100">
        {[
          { key: 'stats',    label: 'Statistiques', icon: <BarChart3 size={16} /> },
          { key: 'users',    label: `Membres (${totalUsers})`, icon: <Users size={16} /> },
          { key: 'services', label: `Services (${totalServices})`, icon: <ShieldCheck size={16} /> },
          { key: 'requests', label: `Demandes (${totalRequests})`, icon: <ShieldCheck size={16} /> },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition border-b-2 ${
              activeTab === tab.key ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Membres total',    value: totalUsers,       color: 'blue',   icon: '👥' },
              { label: 'Membres actifs',   value: activeUsers,      color: 'green',  icon: '✅' },
              { label: 'Modérateurs',      value: modCount,         color: 'purple', icon: '🛡️' },
              { label: 'Services actifs',  value: totalServices,    color: 'orange', icon: '🔧' },
              { label: 'Demandes actives', value: totalRequests,    color: 'pink',   icon: '📋' },
              { label: 'Services en attente', value: pendingServices, color: 'yellow', icon: '⏳' },
              { label: 'Demandes en attente', value: pendingRequests, color: 'yellow', icon: '⏳' },
              { label: 'Admins',           value: adminCount,       color: 'red',    icon: '👑' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-400 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Distribution des rôles */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Distribution des rôles</h3>
            <div className="space-y-3">
              {[
                { role: 'admin',     label: 'Administrateurs', color: 'bg-red-500',    count: adminCount },
                { role: 'moderator', label: 'Modérateurs',     color: 'bg-purple-500', count: modCount },
                { role: 'user',      label: 'Membres',         color: 'bg-blue-500',   count: totalUsers - adminCount - modCount },
              ].map(r => (
                <div key={r.role} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-500 w-32">{r.label}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className={`${r.color} h-2 rounded-full transition-all`} style={{ width: `${totalUsers > 0 ? (r.count / totalUsers) * 100 : 0}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-8 text-right">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Membre</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map(u => (
                  <tr key={u.uid} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 relative flex-shrink-0">
                          {u.avatar
                            ? <Image src={u.avatar} alt="Avatar" fill className="object-cover" unoptimized={u.avatar.startsWith('data:')} />
                            : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">{u.firstName?.[0]}</div>
                          }
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{u.firstName} {u.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-red-50 text-red-500' :
                        u.role === 'moderator' ? 'bg-purple-50 text-purple-500' :
                        'bg-slate-50 text-slate-500'
                      }`}>
                        {(u.role ?? 'user').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        u.status === 'deactivated' ? 'bg-orange-50 text-orange-500' :
                        u.status === 'deleted'  ? 'bg-red-50 text-red-500' :
                        'bg-green-50 text-green-500'
                      }`}>
                        {u.status === 'deactivated' ? 'INACTIF' : u.status === 'deleted' ? 'SUPPRIMÉ' : 'ACTIF'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isAdmin && u.role !== 'admin' && (
                          <button
                            onClick={() => changeRole(u.uid, u.role === 'moderator' ? 'user' : 'moderator')}
                            disabled={loading === `role-${u.uid}`}
                            className="text-xs font-bold text-blue-600 hover:underline disabled:opacity-50"
                          >
                            {u.role === 'moderator' ? 'Révoquer' : 'Promouvoir'}
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => changeStatus(u.uid, u.status === 'deactivated' ? 'active' : 'deactivated')}
                            disabled={loading === `status-${u.uid}`}
                            className={`p-1.5 rounded-lg transition disabled:opacity-50 ${
                              u.status === 'deactivated'
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-orange-500 hover:bg-orange-50'
                            }`}
                            title={u.status === 'deactivated' ? 'Réactiver' : 'Désactiver'}
                          >
                            {u.status === 'deactivated' ? <UserCheck size={14} /> : <UserX size={14} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Services */}
      {activeTab === 'services' && (
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="p-4 space-y-3">
            {services.length === 0 && <p className="text-slate-400 text-sm p-4 text-center">Aucun service</p>}
            {services.map(s => (
              <div key={s.id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-slate-800">{s.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Par {s.userName} · {s.category} · {s.creditCost} crédits</p>
                  <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    s.status === 'accepted' ? 'bg-green-100 text-green-600' :
                    s.status === 'pending'  ? 'bg-yellow-100 text-yellow-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>{(s.status || 'pending').toUpperCase()}</span>
                </div>
                <button onClick={() => deleteService(s.id)} disabled={loading === `service-${s.id}`}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition disabled:opacity-50">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Requests */}
      {activeTab === 'requests' && (
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="p-4 space-y-3">
            {requests.length === 0 && <p className="text-slate-400 text-sm p-4 text-center">Aucune demande</p>}
            {requests.map(r => (
              <div key={r.id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-slate-800">{r.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Par {r.userName} · {r.category} · {r.creditOffer} crédits</p>
                  <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    r.status === 'fulfilled' ? 'bg-green-100 text-green-600' :
                    r.status === 'pending'   ? 'bg-yellow-100 text-yellow-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>{(r.status || 'pending').toUpperCase()}</span>
                </div>
                <button onClick={() => deleteRequest(r.id)} disabled={loading === `request-${r.id}`}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition disabled:opacity-50">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Moderation;
