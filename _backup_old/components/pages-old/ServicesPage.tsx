"use client";

import React, { useState } from 'react';
import { User, Service } from '../../types';
import { Edit2, Trash2 } from 'lucide-react';

interface ServicesPageProps {
  user: User | null;
  services: Service[];
  onUpdate: (s: Service[]) => void;
  onBuy: (s: Service, amount: number) => void;
  onUpdateStatus: (type: 'service' | 'request', id: string, newStatus: string, partnerId?: string) => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ user, services: initialServices, onUpdate, onBuy, onUpdateStatus }) => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [showAdd, setShowAdd] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [negotiatingService, setNegotiatingService] = useState<Service | null>(null);
  const [negotiatedAmount, setNegotiatedAmount] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCost, setNewCost] = useState(1);
  const [newCat, setNewCat] = useState('Éducation');

  React.useEffect(() => { setServices(initialServices); }, [initialServices]);

  const token = () => localStorage.getItem('token') || '';
  const headers = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` });

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer définitivement ce service ?")) return;
    await fetch('/api/services', { method: 'DELETE', headers: headers(), body: JSON.stringify({ id }) });
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    onUpdate(updated);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const serviceData = { title: newTitle, description: newDesc, creditCost: newCost, category: newCat, status: 'proposed' as const, userId: user.uid, userName: `${user.firstName} ${user.lastName}` };

    if (editingService) {
      await fetch(`/api/services/${editingService.id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(serviceData) });
      const updated = services.map(s => s.id === editingService.id ? { ...s, ...serviceData } : s);
      setServices(updated); onUpdate(updated);
    } else {
      const res = await fetch('/api/services', { method: 'POST', headers: headers(), body: JSON.stringify(serviceData) });
      const data = await res.json();
      const newService: Service = { ...serviceData, id: data.id, createdAt: new Date().toISOString() };
      const updated = [newService, ...services];
      setServices(updated); onUpdate(updated);
    }
    setShowAdd(false); setEditingService(null); setNewTitle(''); setNewDesc(''); setNewCost(1);
  };

  const confirmNegotiation = () => {
    if (!acceptedTerms) { alert("Vous devez accepter les Conditions d'Échange."); return; }
    if (negotiatingService) { onBuy(negotiatingService, negotiatedAmount); setNegotiatingService(null); }
  };

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.category ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="font-heading text-4xl font-bold text-slate-900 mb-2">Talents & Services</h1>
          <p className="text-slate-500">Toutes les tâches ne valent pas les mêmes. Négociez vos crédits.</p>
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <input type="text" placeholder="Rechercher un talent..." className="flex-grow md:w-64 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <button onClick={() => { if (!user) { alert('Connectez-vous pour ajouter un service'); return; } setEditingService(null); setNewTitle(''); setNewDesc(''); setNewCost(1); setShowAdd(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition">+ Proposer</button>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAdd(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="font-heading text-2xl font-bold mb-6">{editingService ? 'Modifier le Service' : 'Proposer un Service'}</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="ex: Coaching Marketing" />
              <select value={newCat} onChange={e => setNewCat(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none">
                {['Éducation','Informatique','Marketing','Langues','Loisirs','Autre'].map(c => <option key={c}>{c}</option>)}
              </select>
              <input required type="number" min="1" max="20" value={newCost} onChange={e => setNewCost(parseInt(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
              <textarea required value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none min-h-[100px]" placeholder="Détaillez votre offre..."></textarea>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">{editingService ? 'Mettre à jour' : 'Publier le service'}</button>
            </form>
          </div>
        </div>
      )}

      {negotiatingService && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setNegotiatingService(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl">
            <h2 className="font-heading text-2xl font-bold mb-4 text-center">Négociation</h2>
            <p className="text-slate-500 text-center mb-8">Ajustez le montant pour "{negotiatingService.title}"</p>
            <div className="bg-slate-50 p-6 rounded-2xl mb-6 border border-slate-100">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Montant final convenu</label>
              <div className="flex items-center gap-4">
                <input type="number" min="1" value={negotiatedAmount} onChange={e => setNegotiatedAmount(parseInt(e.target.value))} className="w-full bg-white px-4 py-4 text-2xl font-bold text-blue-600 rounded-xl border-2 border-slate-200 outline-none" />
                <span className="text-2xl">⏰</span>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 w-5 h-5" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} />
                <span className="text-xs text-blue-800 leading-relaxed font-medium">Je confirme avoir pris connaissance de la <strong>Loi des Conditions d'Échange</strong>.</span>
              </label>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={confirmNegotiation} disabled={!acceptedTerms} className={`w-full py-4 rounded-xl font-bold text-lg transition ${acceptedTerms ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Confirmer l'échange</button>
              <button onClick={() => setNegotiatingService(null)} className="w-full py-4 text-slate-400 font-bold">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <h3 className="font-heading text-xl font-bold text-slate-800">Aucun service trouvé</h3>
          <p className="text-slate-500">Soyez le premier à proposer votre talent !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(s => (
            <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{s.category}</span>
                <span className="font-heading font-bold text-blue-600 bg-blue-100/50 px-3 py-1 rounded-lg">⏰ {s.creditCost}</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">{s.description}</p>
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">{s.userName?.[0]}</div>
                  <span className="text-xs font-medium text-slate-600">{s.userName}</span>
                </div>
                <div className="flex gap-2">
                  {user && user.uid === s.userId ? (
                    <>
                      <button onClick={() => { setEditingService(s); setNewTitle(s.title ?? ''); setNewDesc(s.description); setNewCost(s.creditCost); setNewCat(s.category ?? 'Éducation'); setShowAdd(true); }} className="p-2 text-slate-400 hover:text-blue-600 transition"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                    </>
                  ) : (
                    <button onClick={() => { setNegotiatingService(s); setNegotiatedAmount(s.creditCost); setAcceptedTerms(false); }} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition">Négocier & Prendre</button>
                  )}
                </div>
              </div>
              {s.status === 'proposed' && user && user.uid !== s.userId && (
                <button onClick={() => onUpdateStatus('service', s.id, 'accepted', user.uid)} className="w-full mt-4 bg-green-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition">Accepter le service</button>
              )}
              {s.status === 'accepted' && (
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-green-600 uppercase">Accepté</span>
                  {user && (user.uid === s.userId || user.uid === s.acceptedBy) && (
                    <button onClick={() => onUpdateStatus('service', s.id, 'cancelled')} className="text-[10px] font-bold text-red-600 uppercase hover:underline">Annuler</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
