"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  MessageCircle,
  Clock,
  Wine,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Wand2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AiAssistantPage() {
  const [activeTab, setActiveTab] = useState<"timeline" | "whatsapp" | "calculator" | "checklist">("timeline");
  const [copied, setCopied] = useState<string | null>(null);

  // WhatsApp generator state
  const [tone, setTone] = useState<"warm" | "formal" | "vip" | "traditional">("vip");
  const [guestCount, setGuestCount] = useState<number>(100);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  const whatsappTemplates = {
    vip: `🌟 *INVITATION VIP — 30 ANS D'ANGE* 🌟\n\nCher(e) ami(e),\nUne nouvelle décennie se célèbre entouré de ceux qui comptent le plus.\n\nJ'ai le plaisir de vous convier à une soirée d'exception :\n📅 *Samedi 26 Septembre 2026 dès 19h30*\n📍 *Sofitel Abidjan Hôtel Ivoire — Salle Chandelier*\n👔 *Dress Code : Chic & Élégant avec une touche d'Or*\n\nPour valider votre présence et recevoir votre pass QR Code sécurisé en 10 secondes :\n👉 http://localhost:3000/e/ange-anniversaire-30\n\nAu plaisir immense de célébrer ensemble !`,
    warm: `Salut cher ami ! 🎉\nJe fête mes 30 ans le samedi 26 septembre au Sofitel Hôtel Ivoire et ta présence me ferait énormément plaisir !\n\nConfirme-moi vite ta venue sur ce lien pour recevoir ton pass d'entrée :\n👉 http://localhost:3000/e/ange-anniversaire-30\n\nÀ très vite pour une fête mémorable !`,
    formal: `Chers Partenaires et Amis,\nNous avons l'honneur de vous convier à la célébration officielle de nos 30 ans.\n\nDate : Samedi 26 Septembre 2026 à 19h30\nLieu : Sofitel Abidjan Hôtel Ivoire\n\nMerci de bien vouloir confirmer votre présence via votre lien sécurisé :\n👉 http://localhost:3000/e/ange-anniversaire-30`,
    traditional: `Au nom des familles et dans la pure tradition africaine, nous avons la joie de vous convier à célébrer cette grande alliance.\n\nVenez partager ce moment béni avec nous :\n👉 http://localhost:3000/e/ange-anniversaire-30\n\nQue la paix et la joie soient avec vous.`,
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-happy-ink-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-happy-ink-900 font-display flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-happy-coral-500 to-amber-500 text-white shadow-soft">
              <Sparkles className="h-5 w-5" />
            </div>
            <span>HAPPY AI — Assistant Intelligent</span>
          </h1>
          <p className="text-xs sm:text-sm text-happy-ink-600 mt-1">
            Générez votre déroulé de soirée, calculez votre traiteur et rédigez vos messages WhatsApp en un clic.
          </p>
        </div>

        <Badge variant="vip" className="self-start sm:self-auto">
          IA Événementielle Active
        </Badge>
      </div>

      {/* Feature Mode Tabs */}
      <div className="flex flex-wrap rounded-2xl bg-happy-sand-100 p-1">
        <button
          onClick={() => setActiveTab("timeline")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === "timeline"
              ? "bg-white text-happy-ink-900 shadow-xs"
              : "text-happy-ink-600 hover:text-happy-ink-900"
          }`}
        >
          <Clock className="h-4 w-4 text-happy-coral-500" />
          <span>Déroulé & Planning Minute par Minute</span>
        </button>
        <button
          onClick={() => setActiveTab("whatsapp")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === "whatsapp"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-happy-ink-600 hover:text-happy-ink-900"
          }`}
        >
          <MessageCircle className="h-4 w-4 text-emerald-600" />
          <span>Rédacteur WhatsApp Intelligent</span>
        </button>
        <button
          onClick={() => setActiveTab("calculator")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === "calculator"
              ? "bg-white text-amber-800 shadow-xs"
              : "text-happy-ink-600 hover:text-happy-ink-900"
          }`}
        >
          <Wine className="h-4 w-4 text-amber-600" />
          <span>Calculateur Boissons & Traiteur</span>
        </button>
        <button
          onClick={() => setActiveTab("checklist")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === "checklist"
              ? "bg-white text-happy-coral-700 shadow-xs"
              : "text-happy-ink-600 hover:text-happy-ink-900"
          }`}
        >
          <CheckCircle2 className="h-4 w-4 text-happy-coral-600" />
          <span>Checklist & Recommandations</span>
        </button>
      </div>

      {/* Tab 1: Timeline Planning */}
      {activeTab === "timeline" && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-happy-ink-100">
            <div>
              <h2 className="text-lg font-bold text-happy-ink-900 font-display">
                Planning suggéré par l'IA : Anniversaire VIP (100 personnes)
              </h2>
              <p className="text-xs text-happy-ink-500">
                Généré sur mesure pour le Sofitel Hôtel Ivoire avec DJ et cocktail dînatoire.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                handleCopy(
                  "18h30: Arrivée équipe\n19h30: Cocktail bienvenue\n20h45: Discours\n21h15: Dîner\n22h45: Gâteau\n23h15: Soirée dansante",
                  "timeline"
                )
              }
              leftIcon={copied === "timeline" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            >
              {copied === "timeline" ? "Copié !" : "Copier le planning"}
            </Button>
          </div>

          <div className="space-y-4">
            {[
              {
                time: "18h30 - 19h15",
                title: "Mise en place & Test Scanner QR aux entrées",
                desc: "Arrivée des hôtesses d'accueil, configuration des smartphones avec l'application scanner HAPPY EVENTS.",
                badge: "Logistique",
              },
              {
                time: "19h30 - 20h30",
                title: "Accueil VIP des invités & Cocktail de bienvenue",
                desc: "Scan des pass QR à l'entrée en 1 seconde, remise des bracelets VIP, champagne & amuses-bouches au son du pianiste.",
                badge: "Accueil",
              },
              {
                time: "20h45 - 21h15",
                title: "Entrée triomphale de la star de la soirée & Toast officiel",
                desc: "Projection de la rétrospective vidéo des 30 ans, discours de bienvenue et ouverture de la salle principale.",
                badge: "Moment Fort",
              },
              {
                time: "21h15 - 22h45",
                title: "Dîner gastronomique & Prestation artistique",
                desc: "Service des plats chauds et animations musicales live.",
                badge: "Traiteur",
              },
              {
                time: "22h45 - 23h15",
                title: "Gâteau majestueux, Cierges magiques & Fontaine de Champagne",
                desc: "Coupure du gâteau des 30 ans, distribution des cierges magiques à tous les convives pour des photos inoubliables.",
                badge: "Photos & Climax",
              },
              {
                time: "23h15 - 04h00",
                title: "Soirée Dansante DJ & Bar à Cocktails",
                desc: "Ouverture du dancefloor, sons Afrobeats, Coupé-décalé & Lounge jusqu'à l'aube.",
                badge: "Dancefloor",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-happy-sand-50/70 border border-happy-ink-100 hover:border-happy-coral-200 transition-colors"
              >
                <div className="rounded-xl bg-white border border-happy-sand-200 px-3 py-1.5 text-xs font-mono font-bold text-happy-coral-600 shrink-0 shadow-2xs">
                  {step.time}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-happy-ink-900">{step.title}</h3>
                    <Badge variant="confirmed">{step.badge}</Badge>
                  </div>
                  <p className="text-xs text-happy-ink-600 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 2: WhatsApp Generator */}
      {activeTab === "whatsapp" && (
        <Card className="p-6">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-lg font-bold text-happy-ink-900 font-display">
              Générateur de Messages d'Invitation WhatsApp
            </h2>
            <p className="text-xs text-happy-ink-500">
              Choisissez le ton adapté à votre audience. Le texte est prêt à être partagé sur WhatsApp avec votre lien unique.
            </p>

            {/* Tone Selector */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => setTone("vip")}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  tone === "vip"
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-happy-sand-100 text-happy-ink-700"
                }`}
              >
                👑 Prestige & VIP
              </button>
              <button
                onClick={() => setTone("warm")}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  tone === "warm"
                    ? "bg-happy-coral-100 text-happy-coral-900 border border-happy-coral-300"
                    : "bg-happy-sand-100 text-happy-ink-700"
                }`}
              >
                🎉 Chaleureux & Amical
              </button>
              <button
                onClick={() => setTone("formal")}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  tone === "formal"
                    ? "bg-slate-200 text-slate-900 border border-slate-300"
                    : "bg-happy-sand-100 text-happy-ink-700"
                }`}
              >
                👔 Solennel & Professionnel
              </button>
              <button
                onClick={() => setTone("traditional")}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  tone === "traditional"
                    ? "bg-orange-100 text-orange-900 border border-orange-300"
                    : "bg-happy-sand-100 text-happy-ink-700"
                }`}
              >
                ✨ Tradition & Dot
              </button>
            </div>

            {/* Preview Box */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 relative">
              <pre className="whitespace-pre-wrap font-sans text-xs text-happy-ink-800 leading-relaxed">
                {whatsappTemplates[tone]}
              </pre>

              <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between">
                <Button
                  variant="whatsapp"
                  size="sm"
                  onClick={() => handleCopy(whatsappTemplates[tone], "wa_msg")}
                  leftIcon={copied === "wa_msg" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                >
                  {copied === "wa_msg" ? "Copié !" : "Copier le message"}
                </Button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(whatsappTemplates[tone])}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="secondary" size="sm" leftIcon={<Send className="h-4 w-4 text-emerald-600" />}>
                    Ouvrir WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 3: Catering Calculator */}
      {activeTab === "calculator" && (
        <Card className="p-6">
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-happy-ink-900 font-display">
                Calculateur Prévisionnel Boissons & Buffet Traiteur
              </h2>
              <p className="text-xs text-happy-ink-500">
                Ajustez le nombre d'invités pour obtenir les quantités recommandées par les meilleurs traiteurs d'Abidjan.
              </p>
            </div>

            {/* Slider */}
            <div className="rounded-2xl bg-happy-sand-50 p-4 border border-happy-ink-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-happy-ink-800">
                  Nombre d'invités prévus :
                </label>
                <span className="text-lg font-black text-happy-coral-600">{guestCount} personnes</span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full accent-happy-coral-500"
              />
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50">
                <span className="text-xs font-bold text-amber-800 uppercase">Champagne & Mousseux</span>
                <p className="text-2xl font-black text-amber-950 mt-1">
                  {Math.ceil(guestCount / 4)} bouteilles
                </p>
                <p className="text-[11px] text-amber-700 mt-1">~1 coupe d'accueil + 1 toast gâteau</p>
              </div>

              <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50">
                <span className="text-xs font-bold text-rose-800 uppercase">Vin Rouge & Blanc</span>
                <p className="text-2xl font-black text-rose-950 mt-1">
                  {Math.ceil(guestCount / 3)} bouteilles
                </p>
                <p className="text-[11px] text-rose-700 mt-1">Pour accompagner le dîner</p>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50">
                <span className="text-xs font-bold text-emerald-800 uppercase">Cocktail & Canapés</span>
                <p className="text-2xl font-black text-emerald-950 mt-1">
                  {guestCount * 8} pièces
                </p>
                <p className="text-[11px] text-emerald-700 mt-1">8 pièces salées/sucrées par pers.</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Checklist */}
      {activeTab === "checklist" && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-happy-ink-900 font-display mb-4">
            Checklist Intelligente J-30 à Jour J
          </h2>
          <div className="space-y-3 text-xs">
            {[
              { status: true, text: "Création du carton virtuel sur Happy Studio et choix du thème" },
              { status: true, text: "Envoi des premières invitations par WhatsApp aux proches" },
              { status: true, text: "Réservation de la salle Sofitel Ivoire et acompte traiteur" },
              { status: false, text: "Rappel automatique WhatsApp aux 8 invités sans réponse (J-15)" },
              { status: false, text: "Export de la liste traiteur avec les régimes spéciaux (J-7)" },
              { status: false, text: "Attribution des accès scanners QR aux 2 hôtesses d'accueil (J-2)" },
              { status: false, text: "Accueil des invités et validation des billets QR sans doublon (Jour J)" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-happy-sand-50/60 border border-happy-ink-100"
              >
                <CheckCircle2
                  className={`h-4 w-4 shrink-0 ${
                    item.status ? "text-emerald-600" : "text-happy-ink-300"
                  }`}
                />
                <span className={item.status ? "line-through text-happy-ink-400" : "font-semibold text-happy-ink-800"}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
