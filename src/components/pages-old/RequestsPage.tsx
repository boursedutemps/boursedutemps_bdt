"use client";

import React, { useState } from 'react';
import { User, Request } from '../../types';
import { Edit2, Trash2 } from 'lucide-react';

interface RequestsPageProps {
  user: User | null;
  requests: Request[];
  onUpdate: (r: Request[]) => void;
  onFulfill: (r: Request, amount: number) => void;
  onUpdateStatus: (type: 'service' | 'request', id: string, newStatus: string, partnerId?: string) => void;
}

const RequestsPage: React.FC<RequestsPageProps> = ({ user, requests: initialRequests, onUpdate, onFulfill, onUpdateStatus }) => {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [showAdd, setShowAdd] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  const [negotiatingRequest, setNegotiatingRequest] = useState<Request | null>(null);
  const [negotiatedAmount, setNegotiatedAmount] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newOffer, setNewOffer] = useState(1);
  const [newCat, setNewCat] = useState('Éducation');

  React.useEffect(() => { setRequests(initialRequests); }, [initialRequests]);

  const token = () => localStorage.getItem('token') || '';
  const headers = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` });

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer définitivement cette demande ?")) return;
    await fetch('/api/requests', { method: 'DELETE', headers: headers(), body: JSON.stringify({ id }) });
    const updated = requests.filter(r => r.id !== id);
    setRequests(updated);
    onUpdate(updated);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const requestData = {
      title: newTitle,
      description: newDesc,
      creditOffer: newOffer,
      category: newCat,
      status: 'proposed' as const,
      userId: user.uid,
      userName: `${user.firstName} ${user.lastName}`,
    };

    if (editingRequest) {
      await fetch(`/api/requests/${editingRequest.id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(requestData) });
      const updated = requests.map(r => r.id === editingRequest.id ? { ...r, ...requestData } : r);
      setRequests(updated); onUpdate(updated);
    } else {
      const res = await fetch('/api/requests', { method: 'POST', headers: headers(), body: JSON.stringify(requestData) });
      const data = await res.json();
      const newRequest: Request = { ...requestData, id: data.id, createdAt: new Date().toISOString() };
      const updated = [newRequest, ...requests];
      setRequests(updated); onUpdate(updated);
    }
    setShowAdd(false); setEditingRequest(null); setNewTitle(''); setNewDesc(''); setNewOffer(1);
  };

  const confirmNegotiation = () => {
    if (!acceptedTerms) { alert("Vous devez accepter les Conditions d'Échange."); return; }
    if (negotiatingRequest) { onFulfill(negotiatingRequest, negotiatedAmount); setNegotiatingRequest(null); }
  };

  const filtered = requests.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.category ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="font-heading text-4xl font-bold text-slate-900 mb-2">Besoins & Demandes</h1>
          <p className="text-slate-500">Exprimez ce dont vous avez besoin. La communauté est là pour aider.</p>
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <input type="text" placeholder="Chercher une demande..." className="flex-grow md:w-64 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <button onClick={() => { if (!user) { alert('Connectez-vous pour poster une demande'); return; } setEditingRequest(null); setNewTitle(''); setNewDesc(''); setNewOffer(1); setShowAdd(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition">+ Demander</button>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAdd(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="font-heading text-2xl font-bold mb-6">{editingRequest ? 'Modifier la Demande' : 'Poster une Demande'}</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="ex: Traduction Anglais-Français" />
              <select value={newCat} onChange={e => setNewCat(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none">
                {['Éducation','Informatique','Marketing','Langues','Loisirs','Autre'].map(c => <option key={c}>{c}</option>)}
              </select>
              <input required type="number" min="1" max="20" value={newOffer} onChange={e => setNewOffer(parseInt(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
              <textarea required value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none min-h-[100px]" placeholder="Soyez précis sur votre besoin..."></textarea>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">{editingRequest ? 'Mettre à jour' : 'Publier ma demande'}</button>
            </form>
          </div>
        </div>
      )}

      {negotiatingRequest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setNegotiatingRequest(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl">
            <h2 className="font-heading text-2xl font-bold mb-4 text-center">Aider & Négocier</h2>
            <p className="text-slate-500 text-center mb-8">Vous proposez d'aider {negotiatingRequest.userName} pour "{negotiatingRequest.title}".</p>
            <div className="bg-slate-50 p-6 rounded-2xl mb-6 border border-slate-100">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Montant final convenu</label>
              <div className="flex items-center gap-4">
                <input type="number" min="1" value={negotiatedAmount} onChange={e => setNegotiatedAmount(parseInt(e.target.value))} className="w-full bg-white px-4 py-4 text-2xl font-bold text-blue-600 rounded-xl border-2 border-slate-200 outline-none" />
                <span className="text-2xl">⏰</span>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 w-5 h-5" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} />
                <span className="text-xs text-orange-800 leading-relaxed font-medium">Je confirme avoir pris connaissance de la <strong>Loi des Conditions d'Échange</strong>.</span>
              </label>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={confirmNegotiation} disabled={!acceptedTerms} className={`w-full py-4 rounded-xl font-bold text-lg transition ${acceptedTerms ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Confirmer l'aide</button>
              <button onClick={() => setNegotiatingRequest(null)} className="w-full py-4 text-slate-400 font-bold">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <h3 className="font-heading text-xl font-bold text-slate-800">Aucune demande pour le moment</h3>
          <p className="text-slate-500">Avez-vous besoin de quelque chose ?</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(r => (
            <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col border-l-4 border-l-orange-400">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">{r.category}</span>
                <span className="font-heading font-bold text-orange-600 bg-orange-100/50 px-3 py-1 rounded-lg">⏰ {r.creditOffer}</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">{r.title}</h3>
              <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">{r.description}</p>
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">{r.userName?.[0]}</div>
                  <span className="text-xs font-medium text-slate-600">{r.userName}</span>
                </div>
                <div className="flex gap-2">
                  {user && user.uid === r.userId ? (
                    <>
                      <button onClick={() => { setEditingRequest(r); setNewTitle(r.title ?? ''); setNewDesc(r.description); setNewOffer(r.creditOffer); setNewCat(r.category ?? 'Éducation'); setShowAdd(true); }} className="p-2 text-slate-400 hover:text-blue-600 transition"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(r.id)} className="p-2 text-slate-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                    </>
                  ) : (
                    <button onClick={() => { setNegotiatingRequest(r); setNegotiatedAmount(r.creditOffer); setAcceptedTerms(false); }} className="bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-700 transition">Proposer mon aide</button>
                  )}
                </div>
              </div>
              {r.status === 'proposed' && user && user.uid !== r.userId && (
                <button onClick={() => onUpdateStatus('request', r.id, 'accepted', user.uid)} className="w-full mt-4 bg-green-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition">Accepter la demande</button>
              )}
              {r.status === 'accepted' && (
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-green-600 uppercase">Acceptée</span>
                  {user && (user.uid === r.userId || user.uid === r.fulfilledBy) && (
                    <button onClick={() => onUpdateStatus('request', r.id, 'cancelled')} className="text-[10px] font-bold text-red-600 uppercase hover:underline">Annuler</button>
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

export default RequestsPage;
