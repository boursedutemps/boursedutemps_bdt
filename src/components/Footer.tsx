"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import LoiEtCharteModal from "@/components/modals/LoiEtCharteModal";
import PolitiqueConfidentialiteModal from "@/components/modals/PolitiqueConfidentialiteModal";
import ContactFormModal from "@/components/modals/ContactFormModal";

export default function Footer() {
  const router = useRouter();
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const [year] = React.useState(new Date().getFullYear());
  const [showLoi, setShowLoi] = useState(false);
  const [showPolitique, setShowPolitique] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const handleNavigate = (page: string) => {
    if (page === "home") router.push("/");
    else router.push(`/${page}`);
  };

  return (
    <footer className="bg-slate-900 pt-20 pb-10 px-6 text-slate-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo + intro */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src="https://i.postimg.cc/5Y3Rg6zs/image-1.jpg"
                  alt="Logo Bourse du Temps"
                  fill
                  className="rounded-full object-cover border border-slate-700 shadow-sm"
                />
              </div>
              <h2 className="font-heading text-xl font-bold text-white uppercase tracking-tighter">
                BOURSE DU TEMPS
              </h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {t("intro")}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-700"
              >
                <span className="text-lg">FB</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-700"
              >
                <span className="text-lg">IG</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-700"
              >
                <span className="text-lg">LI</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">
              {t("navigation")}
            </h3>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => handleNavigate("home")}
                  className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
                >
                  {tNav("home")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("services")}
                  className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
                >
                  {tNav("services")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("requests")}
                  className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
                >
                  {t("requests")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("members")}
                  className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
                >
                  {tNav("members")}
                </button>
              </li>
            </ul>
          </div>

          {/* Communauté */}
          <div>
            <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">
              {t("community")}
            </h3>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => handleNavigate("blog")}
                  className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
                >
                  {t("blogNews")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("forum")}
                  className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
                >
                  {t("forumDiscussion")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("testimonials")}
                  className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
                >
                  {tNav("testimonials")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("about")}
                  className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
                >
                  À propos
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">
              {t("contact")}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-0.5">📍</span>
                <span className="text-slate-400 text-sm leading-relaxed">
                  1 Place Ahmed Orabi, Alexandrie, Égypte
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-400">✉️</span>
                <button
                  onClick={() => setShowContact(true)}
                  className="text-slate-400 hover:text-blue-400 text-sm transition-colors text-left"
                >
                  {t("contactEmail")}
                </button>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-400">📞</span>
                <a
                  href="https://wa.me/50932274422"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-green-400 text-sm transition-colors flex items-center gap-1"
                >
                  +509 32 27 4422
                  <span className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded-full font-bold">WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bas de page */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-medium">
            © {year} Bourse du Temps. {t("rights")}.
          </p>
          <div className="flex gap-8">
            <button
              onClick={() => setShowPolitique(true)}
              className="text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors"
            >
              {t("privacy")}
            </button>
            <button
              onClick={() => setShowLoi(true)}
              className="text-slate-500 hover:text-orange-400 text-xs font-medium transition-colors"
            >
              ⚖️ {t("terms")}
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      {showPolitique && (
        <PolitiqueConfidentialiteModal onClose={() => setShowPolitique(false)} />
      )}
      {showLoi && <LoiEtCharteModal onClose={() => setShowLoi(false)} />}
      {showContact && <ContactFormModal onClose={() => setShowContact(false)} />}
    </footer>
  );
}
