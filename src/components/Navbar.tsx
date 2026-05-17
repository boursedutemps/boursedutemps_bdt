"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Bell, Menu, X, Clock, LogOut, User, ChevronDown } from 'lucide-react';
import { User as UserType, Notification } from '@/types';

interface NavbarProps {
  user: UserType | null;
  notifications: Notification[];
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
  onMarkRead: (id: string) => void;
}

const NAV_GROUPS = [
  {
    label: 'Échanger',
    items: [
      { label: '🛠️ Services',  path: '/services',  desc: 'Compétences proposées' },
      { label: '📋 Demandes',  path: '/requests',  desc: 'Besoins de la communauté' },
      { label: '🎓 Ateliers',  path: '/workshops', desc: 'Sessions collectives' },
      { label: '🚀 Projets',   path: '/projects',  desc: 'Temps collaboratif' },
    ],
  },
  {
    label: 'Apprendre',
    items: [
      { label: '📚 Modules',     path: '/modules',      desc: 'Parcours thématiques' },
      { label: '✍️ Blog',        path: '/blog',         desc: 'Articles & ressources' },
      { label: '⭐ Témoignages', path: '/testimonials', desc: 'Avis de la communauté' },
    ],
  },
  {
    label: 'Communauté',
    items: [
      { label: '👥 Membres',  path: '/members', desc: 'Annuaire des membres' },
      { label: '💬 Forum',    path: '/forum',   desc: 'Discussions en direct' },
      { label: 'ℹ️ À propos', path: '/about',   desc: 'Notre mission' },
      { label: '📩 Contact',  path: '/contact', desc: 'Nous écrire' },
    ],
  },
]

const Navbar: React.FC<NavbarProps> = ({ user, notifications, onLogin, onLogout, onMarkRead }) => {
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [openGroup, setOpenGroup]       = useState<string | null>(null);
  const [showNotifs, setShowNotifs]     = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted]           = useState(false);
  const pathname    = usePathname();
  const notifsRef   = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const groupRefs   = useRef<Record<string, HTMLDivElement | null>>({});

  const unread             = notifications.filter(n => !n.isRead).length;
  const isAdmin            = user?.role === 'admin';
  const isAdminOrMod       = user?.role === 'admin' || user?.role === 'moderator';
  const isInstitutionAdmin = user?.role === 'institution_admin';

  useEffect(() => {
    setMounted(true);
    const handleClick = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
      const inGroup = Object.values(groupRefs.current).some(ref => ref?.contains(e.target as Node));
      if (!inGroup) setOpenGroup(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isGroupActive = (group: typeof NAV_GROUPS[0]) =>
    group.items.some(item => pathname === item.path || pathname.startsWith(item.path + '/'));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative w-9 h-9">
              <Image src="https://i.postimg.cc/5Y3Rg6zs/image-1.jpg" alt="Logo" fill
                className="rounded-full object-cover border border-slate-100 group-hover:scale-105 transition-transform" />
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900 hidden sm:block uppercase">
              Bourse du Temps
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            <Link href="/" className={`px-3 py-2 rounded-full text-sm font-semibold transition-all ${
              pathname === '/' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            }`}>Accueil</Link>

            {NAV_GROUPS.map(group => (
              <div key={group.label} className="relative"
                ref={el => { groupRefs.current[group.label] = el }}>
                <button
                  onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold transition-all ${
                    isGroupActive(group) || openGroup === group.label
                      ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}>
                  {group.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openGroup === group.label ? 'rotate-180' : ''}`} />
                </button>
                {openGroup === group.label && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                    <div className="p-2 space-y-0.5">
                      {group.items.map(item => (
                        <Link key={item.path} href={item.path} onClick={() => setOpenGroup(null)}
                          className={`flex flex-col px-3 py-2.5 rounded-xl transition-all ${
                            pathname === item.path ? 'bg-blue-50' : 'hover:bg-slate-50'
                          }`}>
                          <span className={`text-sm font-semibold ${pathname === item.path ? 'text-blue-600' : 'text-slate-700'}`}>
                            {item.label}
                          </span>
                          <span className="text-xs text-slate-400 mt-0.5">{item.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isAdminOrMod && (
              <Link href="/moderation" className={`px-3 py-2 rounded-full text-sm font-semibold transition-all ${
                pathname === '/moderation' ? 'text-purple-600 bg-purple-50' : 'text-purple-500 hover:bg-purple-50'
              }`}>Modération</Link>
            )}
            {isAdmin && (
              <Link href="/admin/institutions" className={`px-3 py-2 rounded-full text-sm font-semibold transition-all ${
                pathname.startsWith('/admin') ? 'text-violet-600 bg-violet-50' : 'text-violet-500 hover:bg-violet-50'
              }`}>🏛️ Institutions</Link>
            )}
            {isInstitutionAdmin && (
              <Link href="/i/dashboard" className="px-3 py-2 rounded-full text-sm font-semibold text-violet-500 hover:bg-violet-50 transition-all">
                🏛️ Mon institution
              </Link>
            )}
          </div>

          {/* Actions droite */}
          <div className="hidden lg:flex items-center gap-2 ml-auto">
            <Link href="/recherche" className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all ${
              pathname === '/recherche'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600'
                : 'text-blue-600 border border-blue-200 hover:bg-blue-50'
            }`}>
              <Search className="w-3.5 h-3.5" /> Recherche IA
            </Link>

            {user && (
              <div className="relative" ref={notifsRef}>
                <button onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 rounded-full text-slate-500 hover:bg-slate-50 transition">
                  <Bell className="w-5 h-5" />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {unread}
                    </span>
                  )}
                </button>
                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <h3 className="font-bold text-sm">Notifications</h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{unread} non lues</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-400">Aucune notification</div>
                      ) : notifications.map(n => (
                        <div key={n.id} onClick={() => { onMarkRead(n.id); setShowNotifs(false); }}
                          className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition ${!n.isRead ? 'bg-blue-50/30' : ''}`}>
                          <div className="flex gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 ${
                              n.type === 'transaction' ? 'bg-green-100' : n.type === 'connection' ? 'bg-purple-100' : 'bg-blue-100'
                            }`}>
                              {n.type === 'transaction' ? '💰' : n.type === 'connection' ? '🤝' : '🔔'}
                            </div>
                            <div>
                              <p className="text-sm text-slate-700 leading-tight">
                                <span className="font-bold">{n.fromName}</span> {n.content}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                {mounted ? new Date(n.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-blue-600 text-white pl-3 pr-1.5 py-1.5 rounded-full hover:bg-blue-700 transition shadow-md shadow-blue-200">
                  <Clock className="w-4 h-4 text-blue-100" />
                  <span className="text-sm font-bold">{user.credits}</span>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center overflow-hidden border border-blue-300 relative">
                    {user.avatar
                      ? <Image src={user.avatar} alt="avatar" fill className="object-cover" sizes="28px" />
                      : <span className="text-[10px] text-blue-600 font-bold">{user.firstName?.[0] || '?'}</span>
                    }
                  </div>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-50">
                      <p className="text-sm font-bold text-slate-800 truncate">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link href="/profile" onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition font-semibold">
                      <User size={15} className="text-blue-500" /> Mon profil
                    </Link>
                    <Link href="/dashboard" onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition font-semibold">
                      <Clock size={15} className="text-blue-500" /> Dashboard
                    </Link>
                    <div className="border-t border-slate-100" />
                    <button onClick={() => { setShowUserMenu(false); onLogout(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition font-semibold">
                      <LogOut size={15} /> Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={onLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-blue-100">
                Accès Membre
              </button>
            )}
          </div>

          {/* Mobile burger */}
          <button className="lg:hidden ml-auto p-2 text-slate-600 hover:bg-slate-50 rounded-full"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="p-4 space-y-1">
            <Link href="/" onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-bold transition ${pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'}`}>
              🏠 Accueil
            </Link>
            {NAV_GROUPS.map(group => (
              <div key={group.label}>
                <button onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition ${
                    isGroupActive(group) ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}>
                  {group.label}
                  <ChevronDown className={`w-4 h-4 transition-transform ${openGroup === group.label ? 'rotate-180' : ''}`} />
                </button>
                {openGroup === group.label && (
                  <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-blue-100 pl-3">
                    {group.items.map(item => (
                      <Link key={item.path} href={item.path}
                        onClick={() => { setMobileOpen(false); setOpenGroup(null); }}
                        className={`block px-3 py-2 rounded-lg text-sm transition ${
                          pathname === item.path ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600 hover:bg-slate-50'
                        }`}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isAdminOrMod && (
              <Link href="/moderation" onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-bold text-purple-600 hover:bg-purple-50 transition">
                🛡️ Modération
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin/institutions" onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-bold text-violet-600 hover:bg-violet-50 transition">
                🏛️ Institutions
              </Link>
            )}
            <Link href="/recherche" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition">
              <Search className="w-4 h-4" /> Recherche IA
            </Link>
            <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm">
                    <Clock className="w-5 h-5" /> Mon profil · {user.credits} crédits
                  </Link>
                  <button onClick={() => { setMobileOpen(false); onLogout(); }}
                    className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 py-3 rounded-xl font-bold text-sm hover:bg-red-50 transition">
                    <LogOut size={16} /> Se déconnecter
                  </button>
                </>
              ) : (
                <button onClick={() => { onLogin(); setMobileOpen(false); }}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-100">
                  Accès Membre
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
