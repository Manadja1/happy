"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Palette,
  Eye,
  Share2,
  Download,
  Check,
  Calendar,
  MapPin,
  QrCode,
  Sliders,
  Type,
  Image as ImageIcon,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";

const STUDIO_TEMPLATES = [
  {
    id: "classic-gold",
    name: "Or Impérial & Ivoire",
    category: "Mariages & Gala",
    bgGradient: "from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1]",
    borderColor: "border-amber-300",
    textColor: "text-amber-950",
  },
  {
    id: "wax-chic",
    name: "Wax Royal & Kente",
    category: "Dot Traditionnelle",
    bgGradient: "from-rose-50/70 via-amber-50/60 to-orange-50/70",
    borderColor: "border-happy-coral-300",
    textColor: "text-happy-ink-950",
  },
  {
    id: "midnight-sparkle",
    name: "Midnight Sparkle",
    category: "Anniversaire VIP",
    bgGradient: "from-[#0F172A] via-[#1E293B] to-[#090D16]",
    borderColor: "border-amber-400/50",
    textColor: "text-white",
  },
  {
    id: "tropical-luxury",
    name: "Tropical Chic & Émeraude",
    category: "Soirée & Pool Party",
    bgGradient: "from-emerald-900 via-teal-900 to-slate-900",
    borderColor: "border-emerald-400/40",
    textColor: "text-white",
  },
];

export default function StudioPage() {
  const [activeTemplate, setActiveTemplate] = useState(STUDIO_TEMPLATES[0]);
  const [title, setTitle] = useState("30 ans d'Ange");
  const [subtitle, setSubtitle] = useState("Une nuit inoubliable sous les étoiles");
  const [date, setDate] = useState("Samedi 26 Septembre 2026 • 20:00");
  const [venue, setVenue] = useState("Sofitel Hôtel Ivoire, Abidjan");
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Nous avons l'immense honneur de vous convier à célébrer ce moment exceptionnel avec nous."
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://happyevents.ci";
    const link = `${origin}/e/ange-anniversaire-30`;
    const message = `🌟 *INVITATION — ${title.toUpperCase()}* 🌟\n\n« ${welcomeMessage} »\n\n📅 *Date :* ${date}\n📍 *Lieu :* ${venue}\n\n👉 Confirmez votre présence et obtenez votre pass d'entrée : ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    setToastMsg("Carton d'invitation prêt sur WhatsApp !");
    setTimeout(() => setToastMsg(""), 3500);
  };

  return (
    <div className="flex flex-col space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-white shadow-xl animate-fadeIn flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-happy-ink-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-happy-ink-900 font-display flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-happy-coral-500" />
            <span>HAPPY STUDIO — Moteur Créatif</span>
          </h1>
          <p className="text-xs sm:text-sm text-happy-ink-600 mt-1">
            Personnalisez votre carton d'invitation numérique et générez le format WhatsApp en un clic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/e/ange-anniversaire-30" target="_blank">
            <Button variant="secondary" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
              Aperçu page publique
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="shadow-glow"
            leftIcon={<Check className="h-4 w-4" />}
          >
            {savedSuccess ? "Enregistré !" : "Enregistrer les modifications"}
          </Button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Customization Form */}
        <div className="lg:col-span-6 space-y-6">
          {/* Template Picker */}
          <div className="rounded-3xl border border-happy-ink-200 bg-white p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-happy-ink-900 flex items-center gap-2">
                <Palette className="h-4 w-4 text-happy-coral-500" />
                1. Choisir le thème visuel
              </h3>
              <Link href="/templates" className="text-xs text-happy-coral-600 hover:underline font-bold">
                Toutes les créations
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {STUDIO_TEMPLATES.map((tpl) => {
                const isSelected = activeTemplate.id === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setActiveTemplate(tpl)}
                    className={`text-left p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-happy-coral-500 bg-happy-coral-50/40 shadow-xs"
                        : "border-happy-ink-100 bg-happy-sand-50 hover:border-happy-ink-200"
                    }`}
                  >
                    <span className="text-xs font-bold text-happy-ink-900 truncate">
                      {tpl.name}
                    </span>
                    <span className="text-[11px] text-happy-ink-500 mt-1">
                      {tpl.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text editor */}
          <div className="rounded-3xl border border-happy-ink-200 bg-white p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-happy-ink-900 flex items-center gap-2">
              <Type className="h-4 w-4 text-happy-coral-500" />
              2. Textes & Personnalisation
            </h3>

            <Input
              label="Titre principal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Input
              label="Sous-titre / Thème"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />

            <Input
              label="Date & Heure affichées"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <Input
              label="Lieu ou Salle"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />

            <Textarea
              label="Message d'accueil"
              rows={3}
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
            />
          </div>
        </div>

        {/* Right Col: Live Interactive Mockup */}
        <div className="lg:col-span-6 sticky top-24">
          <div className="rounded-3xl border border-happy-ink-200 bg-white p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-happy-ink-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-happy-coral-600 flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Rendu Smartphone invité
              </span>
              <Badge variant="confirmed">Carton Numérique</Badge>
            </div>

            {/* Rendered Card */}
            <div
              className={`rounded-2xl border ${activeTemplate.borderColor} bg-gradient-to-br ${activeTemplate.bgGradient} p-7 text-center space-y-4 shadow-sm`}
            >
              <Badge variant="vip" className="mx-auto">
                {activeTemplate.name}
              </Badge>

              <div>
                <h3
                  className={`text-2xl sm:text-3xl font-black font-display tracking-tight ${activeTemplate.textColor}`}
                >
                  {title}
                </h3>
                <p className="text-xs font-semibold opacity-85 mt-1">
                  {subtitle}
                </p>
              </div>

              <p className="text-xs text-happy-ink-700 italic px-2 leading-relaxed">
                « {welcomeMessage} »
              </p>

              <div className="rounded-xl bg-white/95 backdrop-blur-xs p-3.5 text-left space-y-2 text-xs border border-black/5 shadow-xs">
                <div className="flex items-center gap-2 text-happy-ink-800">
                  <Calendar className="h-3.5 w-3.5 text-happy-coral-500 shrink-0" />
                  <span className="font-semibold">{date}</span>
                </div>
                <div className="flex items-center gap-2 text-happy-ink-800">
                  <MapPin className="h-3.5 w-3.5 text-happy-coral-500 shrink-0" />
                  <span className="line-clamp-1">{venue}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-happy-ink-100 flex flex-col items-center">
                <QrCode className="h-16 w-16 text-happy-ink-900" />
                <span className="text-[9px] font-mono text-happy-ink-400 mt-1">
                  BILLET INDIVIDUEL SÉCURISÉ
                </span>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-happy-coral-500 text-white font-bold text-xs shadow-glow">
                Confirmer ma présence (RSVP)
              </button>
            </div>

            {/* Sharing Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <Button
                variant="whatsapp"
                size="sm"
                onClick={handleShareWhatsApp}
                className="w-full text-xs font-bold shadow-soft"
                leftIcon={<Share2 className="h-3.5 w-3.5" />}
              >
                Partager le carton par WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
