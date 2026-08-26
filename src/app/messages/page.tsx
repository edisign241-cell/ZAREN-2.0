'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Send,
  ShieldCheck,
  Package,
  Check,
  CheckCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Phone,
  Image,
  DollarSign,
  User,
  ExternalLink
} from 'lucide-react';
import { zarenStore } from '@/db/store';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Conversation, Message, ProductOffer } from '@/types';

export default function MessagesPage() {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [offers, setOffers] = useState<ProductOffer[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const convs = zarenStore.getConversations();
    setConversations(convs);
    setOffers(zarenStore.getOffers());
    if (convs.length > 0 && !selectedConvId) {
      setSelectedConvId(convs[0].id);
    }
  }, [selectedConvId]);

  useEffect(() => {
    if (selectedConvId) {
      const msgs = zarenStore.getMessages(selectedConvId);
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [selectedConvId]);

  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];
  const activeOffer = activeConv?.offerId ? offers.find(o => o.id === activeConv.offerId) : undefined;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const newMsg = zarenStore.sendMessage(
      activeConv.id,
      currentUser?.id || 'usr_buyer_1',
      currentUser?.name || 'Moi',
      inputText
    );

    setMessages([...messages, newMsg]);
    setInputText('');
    setConversations(zarenStore.getConversations());
  };

  const handleOfferResponse = (offerId: string, action: 'ACCEPT' | 'REJECT' | 'COUNTER', counterPrice?: number) => {
    const updated = zarenStore.respondToOffer(offerId, action, counterPrice);
    setOffers(zarenStore.getOffers());
    if (selectedConvId) {
      setMessages(zarenStore.getMessages(selectedConvId));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 min-h-[calc(100vh-5rem)]">
      
      {/* En-tête Messagerie Sécurisée */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#008A45] flex items-center justify-center font-bold">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black italic text-gray-900">
              Messagerie Sécurisée ZARÉN
            </h1>
            <p className="text-xs text-gray-500">
              Échanges en direct protégés par le séquestre Mobile Money.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black italic bg-emerald-100 text-[#008A45] border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>GARANTIE SÉQUESTRE ACTIVE</span>
        </span>
      </div>

      {/* Conteneur Grille Chat */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] h-[72vh]">
        
        {/* LISTE DES CONVERSATIONS (COL 4) */}
        <div className="md:col-span-4 border-r border-gray-200 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-gray-200 bg-white">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Discussions Récentes ({conversations.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-gray-100">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                Aucune conversation active pour le moment.
              </div>
            ) : (
              conversations.map((conv) => {
                const other = conv.participants.find(p => p.id !== (currentUser?.id || 'usr_seller_1')) || conv.participants[0];
                const isSelected = conv.id === selectedConvId;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition ${
                      isSelected ? 'bg-emerald-50/80 border-l-4 border-[#008A45]' : 'hover:bg-gray-100/70 bg-white'
                    }`}
                  >
                    <img
                      src={other.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={other.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-gray-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-gray-900 truncate">
                          {other.name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(conv.lastMessageAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {conv.productTitle && (
                        <span className="text-[10px] text-[#008A45] font-black truncate block mb-1">
                          📦 {conv.productTitle}
                        </span>
                      )}

                      <p className="text-xs text-gray-500 truncate">
                        {conv.lastMessage || 'Nouvelle discussion'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* FENÊTRE DE DISCUSSION (COL 8) */}
        {activeConv ? (
          <div className="md:col-span-8 flex flex-col bg-white">
            
            {/* Header de la discussion active */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeConv.participants[1]?.avatar || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=150&q=80'}
                  alt="Interlocuteur"
                  className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-gray-900">
                      {activeConv.participants[1]?.name || 'Vendeur Certifié'}
                    </h3>
                    <span className="text-[10px] text-[#008A45] bg-emerald-50 px-1.5 py-0.2 rounded-full font-bold">
                      ✓ Vérifié
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500">
                    📞 {activeConv.participants[1]?.phone || '+241 07 45 88 12'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/profile/usr_seller_1"
                  className="py-1.5 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Voir Profil & Avis</span>
                </Link>
              </div>
            </div>

            {/* BANDEAU OFFRE DE PRIX EN COURS / ACCEPTÉE */}
            {activeOffer && (
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-b border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#008A45] text-white flex items-center justify-center font-black">
                    🤝
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">
                        Offre de prix : {formatPrice(activeOffer.offeredPrice)}
                      </span>
                      <span className="text-[10px] text-gray-400 line-through">
                        {formatPrice(activeOffer.originalPrice)}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        activeOffer.status === 'ACCEPTED' 
                          ? 'bg-emerald-200 text-emerald-800'
                          : activeOffer.status === 'REJECTED'
                          ? 'bg-rose-200 text-rose-800'
                          : 'bg-amber-200 text-amber-800'
                      }`}>
                        {activeOffer.status === 'ACCEPTED' && '✓ OFFRE ACCEPTÉE'}
                        {activeOffer.status === 'PENDING' && '⏳ EN ATTENTE DU VENDEUR'}
                        {activeOffer.status === 'REJECTED' && '❌ OFFRE REFUSÉE'}
                        {activeOffer.status === 'COUNTERED' && '🔄 CONTRE-OFFRE FAITE'}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-600 block">
                      Article : {activeOffer.productTitle}
                    </span>
                  </div>
                </div>

                {/* Actions sur l'offre */}
                <div className="flex items-center gap-2">
                  {activeOffer.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleOfferResponse(activeOffer.id, 'ACCEPT')}
                        className="py-1.5 px-3 rounded-lg bg-[#008A45] text-white text-xs font-bold hover:bg-[#007339] transition cursor-pointer"
                      >
                        ✓ Accepter
                      </button>
                      <button
                        onClick={() => handleOfferResponse(activeOffer.id, 'REJECT')}
                        className="py-1.5 px-3 rounded-lg bg-rose-100 text-rose-700 text-xs font-bold hover:bg-rose-200 transition cursor-pointer"
                      >
                        Refuser
                      </button>
                    </>
                  )}

                  {activeOffer.status === 'ACCEPTED' && (
                    <Link
                      href={`/checkout/${activeOffer.productId}?offerPrice=${activeOffer.offeredPrice}`}
                      className="py-2 px-4 rounded-xl bg-[#008A45] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:bg-[#007339] transition"
                    >
                      <span>Payer {formatPrice(activeOffer.offeredPrice)} sous Séquestre</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Zone des messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30 custom-scrollbar">
              {messages.map((msg) => {
                const isMe = msg.senderId === (currentUser?.id || 'usr_buyer_1');

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {!isMe && (
                        <span className="text-[10px] font-bold text-gray-500 mb-1">
                          {msg.senderName}
                        </span>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#111827] text-white rounded-br-none shadow-sm'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>

                    <span className="text-[9px] text-gray-400 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Barre de saisie de message */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Écrivez votre message sécurisé..."
                className="flex-1 px-4 py-3 rounded-2xl bg-gray-100 border border-transparent focus:border-[#008A45] focus:bg-white text-xs outline-none transition font-medium"
              />
              <button
                type="submit"
                className="p-3 rounded-2xl bg-[#008A45] hover:bg-[#007339] text-white shadow-md transition active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          <div className="md:col-span-8 flex flex-col items-center justify-center p-12 text-center bg-white space-y-3">
            <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-[#008A45] flex items-center justify-center">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-gray-800">Aucune discussion active</h3>
            <p className="text-xs text-gray-500 max-w-sm">
              Vos échanges avec les acheteurs et vendeurs sous séquestre ZARÉN s'afficheront ici en temps réel.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
