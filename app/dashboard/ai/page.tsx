"use client";

import React, { useState, useEffect } from "react";
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
  Share2,
  Droplets,
  Beer,
  Utensils,
  Cake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AiAssistantPage() {
  const [activeTab, setActiveTab] = useState<"calculator" | "timeline" | "whatsapp" | "checklist">("calculator");
  const [copied, setCopied] = useState<string | null>(null);

  // WhatsApp generator state
  const [tone, setTone] = useState<"warm" | "formal" | "vip" | "traditional">("vip");
  const [guestCount, setGuestCount] = useState<number>(100);
  const [baseUrl, setBaseUrl] = useState("https://happyevents.ci");

  const [eventName, setEventName] = useState("30 ans d'Ange");
  const [eventVenue, setEventVenue] = useState("Sofitel Hôtel Ivoire, Abidjan");
  const [eventSlug, setEventSlug] = useState("ange-anniversaire-30");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "timeline" || tabParam === "whatsapp" || tabParam === "checklist" || tabParam === "calculator") {
        setActiveTab(tabParam);
      }

      const evtId = params.get("eventId") || localStorage.getItem("happy_active_event_id") || "evt_30ans_ange";
      fetch("/api/events")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const found = json.data.find((e: any) => e.id === evtId) || json.data[0];
            setEventName(found.name);
            setEventVenue(found.location || "Abidjan");
            setEventSlug(found.slug);
          }
        })
        .catch(() => {});

      fetch(`/api/events/${evtId}/stats`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data?.confirmedGuests > 0) {
            setGuestCount(json.data.confirmedGuests);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  const eventLink = `${baseUrl}/e/${eventSlug}`;

  // Calculated Catering & Drinks values based on guestCount
  const champagneBottles = Math.ceil(guestCount / 4);
  const wineBottles = Math.ceil(guestCount / 3);
  const beerBottles = guestCount * 2;
  const softDrinksBottles = Math.ceil(guestCount * 1.5);
  const waterPacks = Math.ceil(guestCount / 6);
  const spiritsBottles = Math.ceil(guestCount / 12);
  const canapesPieces = guestCount * 8;
  const buffetPortions = Math.ceil(guestCount * 1.15);
  const cakePortions = guestCount;

  const cateringSummaryText = `🎉 *ESTIMATION BOISSONS & TRAITEUR — HAPPY EVENTS*
Événement : ${eventName} (${eventVenue})
Nombre de convives : ${guestCount} personnes

🍾 *BOISSONS & BAR :*
• Champagne & Mousseux : ${champagneBottles} bouteilles (~1 coupe d'accueil + toast)
• Vins Rouges & Blancs : ${wineBottles} bouteilles (Service à table)
• Bières & Panachés (Solibra, Beaufort, Heineken) : ${beerBottles} bouteilles
• Sodas, Sucreries & Jus frais (Bissap, Gingembre) : ${softDrinksBottles} bouteilles/packs
• Eau minérale (Awa / Céleste) : ${waterPacks} packs de 12 (0.5L / 1.5L)
• Spiritueux de bar (Whisky, Rhum, Gin) : ${spiritsBottles} bouteilles

🍢 *BUFFET & TRAITEUR :*
• Amuse-bouches & Cocktail : ${canapesPieces} pièces (8 pièces/pers.)
• Buffet chaud (Plats de résistance) : ${buffetPortions} portions (+15% de marge)
• Gâteau d'événement : ${cakePortions} parts

Calculé via HAPPY EVENTS IA Assistant : ${eventLink}`;

  const whatsappTemplates = {
    vip: `🌟 *INVITATION VIP — 30 ANS D'ANGE* 🌟\n\nCher(e) ami(e),\nUne nouvelle décennie se célèbre entouré de ceux qui comptent le plus.\n\nJ'ai le plaisir de vous convier à une soirée d'exception :\n📅 *Samedi 26 Septembre 2026 dès 19h30*\n📍 *Sofitel Abidjan Hôtel Ivoire — Salle Chandelier*\n👔 *Dress Code : Chic & Élégant avec une touche d'Or*\n\nPour valider votre présence et recevoir votre pass QR Code sécurisé en 10 secondes :\n👉 ${eventLink}\n\nAu plaisir immense de célébrer ensemble !`,
    warm: `Salut cher ami ! 🎉\nJe fête mes 30 ans le samedi 26 septembre au Sofitel Hôtel Ivoire et ta présence me ferait énormément plaisir !\n\nConfirme-moi vite ta venue sur ce lien pour recevoir ton pass d'entrée :\n👉 ${eventLink}\n\nÀ très vite pour une fête mémorable !`,
    formal: `Chers Partenaires et Amis,\nNous avons l'honneur de vous convier à la célébration officielle de nos 30 ans.\n\nDate : Samedi 26 Septembre 2026 à 19h30\nLieu : Sofitel Abidjan Hôtel Ivoire\n\nMerci de bien vouloir confirmer votre présence via votre lien sécurisé :\n👉 ${eventLink}`,
    traditional: `Au nom des familles et dans la pure tradition africaine, nous avons la joie de vous convier à célébrer cette grande alliance.\n\nVenez partager ce moment béni avec nous :\n👉 ${eventLink}\n\nQue la paix et la joie soient avec vous.`,
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {copied && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-white shadow-xl animate-fadeIn flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="h-4 w-4" />
          <span>Élément copié avec succès dans le presse-papier !</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-happy-ink-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-happy-ink-900 font-display flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-happy-coral-500 to-amber-500 text-white shadow-soft">
              <Sparkles className="h-5 w-5" />
            </div>
            <span>HAPPY AI — Assistant Intelligent</span>
          </h1>
          <p className="text-xs sm:text-sm text-happy-ink-600 mt-1">
            Générez votre déroulé de soirée, calculez vos boissons & traiteur et rédigez vos invitations WhatsApp.
          </p>
        </div>

        <Badge variant="vip" className="self-start sm:self-auto">
          IA Événementielle Active
        </Badge>
      </div>

      {/* Feature Mode Tabs (Scrollable on mobile - Garanti accessible sur tous les écrans) */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none rounded-2xl bg-happy-sand-100 p-1.5 w-full">
        <button
          onClick={() => setActiveTab("calculator")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === "calculator"
              ? "bg-white text-amber-900 shadow-xs ring-1 ring-amber-200"
              : "text-happy-ink-600 hover:text-happy-ink-900"
          }`}
        >
          <Wine className="h-4 w-4 text-amber-600 shrink-0" />
          <span>🍾 Boissons & Traiteur</span>
          <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[9px] font-black text-amber-800">
            Calculateur
          </span>
        </button>

        <button
          onClick={() => setActiveTab("timeline")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === "timeline"
              ? "bg-white text-happy-ink-900 shadow-xs"
              : "text-happy-ink-600 hover:text-happy-ink-900"
          }`}
        >
          <Clock className="h-4 w-4 text-happy-coral-500 shrink-0" />
          <span>⏱️ Déroulé & Planning</span>
        </button>

        <button
          onClick={() => setActiveTab("whatsapp")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === "whatsapp"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-happy-ink-600 hover:text-happy-ink-900"
          }`}
        >
          <MessageCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>💬 Textes WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab("checklist")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
            activeTab === "checklist"
              ? "bg-white text-happy-coral-700 shadow-xs"
              : "text-happy-ink-600 hover:text-happy-ink-900"
          }`}
        >
          <CheckCircle2 className="h-4 w-4 text-happy-coral-600 shrink-0" />
          <span>✅ Checklist J-30</span>
        </button>
      </div>

      {/* TAB 1: CATERING & BEVERAGE CALCULATOR (La section demandée spécifiquement) */}
      {activeTab === "calculator" && (
        <Card className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-happy-ink-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">🍾</span>
                <h2 className="text-lg sm:text-xl font-bold text-happy-ink-900 font-display">
                  Calculateur Prévisionnel Boissons, Bar & Buffet Traiteur
                </h2>
              </div>
              <p className="text-xs text-happy-ink-500 mt-1">
                Quantités exactes recommandées selon les standards de réception à Abidjan (vin, champagne, bières locales, sodas et mets chauds).
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopy(cateringSummaryText, "catering_copy")}
                leftIcon={copied === "catering_copy" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              >
                {copied === "catering_copy" ? "Copié !" : "Copier la liste"}
              </Button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(cateringSummaryText)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  variant="whatsapp"
                  size="sm"
                  leftIcon={<Share2 className="h-4 w-4" />}
                >
                  Envoyer WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Guest Count Selector & Presets */}
          <div className="rounded-3xl bg-happy-sand-50 p-4 sm:p-6 border border-happy-ink-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs sm:text-sm font-black text-happy-ink-900 uppercase tracking-wide">
                Nombre de personnes prévues :
              </label>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-happy-coral-600 font-display">
                  {guestCount}
                </span>
                <span className="text-xs font-bold text-happy-ink-600">invités</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full accent-happy-coral-500 h-2 bg-happy-sand-200 rounded-lg cursor-pointer"
            />

            {/* Quick Presets Buttons (Super pratique sur mobile) */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
              <span className="text-[11px] font-bold text-happy-ink-500 shrink-0">Presets :</span>
              {[30, 50, 100, 150, 200, 300, 500].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setGuestCount(preset)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    guestCount === preset
                      ? "bg-happy-coral-600 text-white shadow-soft"
                      : "bg-white text-happy-ink-700 border border-happy-ink-200 hover:bg-happy-sand-100"
                  }`}
                >
                  {preset} pers.
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: BOISSONS & BAR (La liste complète) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wine className="h-5 w-5 text-happy-coral-600" />
              <h3 className="text-sm font-black uppercase tracking-wider text-happy-ink-900">
                1. Boissons & Bar (Cave & Fraîcheur)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Champagne */}
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50/70 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-900 uppercase">Champagne & Mousseux</span>
                  <span className="text-lg">🍾</span>
                </div>
                <p className="text-2xl font-black text-amber-950 mt-1">
                  {champagneBottles} bouteilles
                </p>
                <p className="text-[11px] text-amber-800 mt-1">
                  ~1 coupe d&apos;accueil + 1 toast pour le gâteau
                </p>
              </div>

              {/* Vin Rouge & Blanc */}
              <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50/70 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-900 uppercase">Vins Rouges & Blancs</span>
                  <span className="text-lg">🍷</span>
                </div>
                <p className="text-2xl font-black text-rose-950 mt-1">
                  {wineBottles} bouteilles
                </p>
                <p className="text-[11px] text-rose-800 mt-1">
                  À servir pendant le dîner (~1 bouteille pour 3 convives)
                </p>
              </div>

              {/* Bières locales & fraîches */}
              <div className="p-4 rounded-2xl border border-yellow-200 bg-yellow-50/40 hover:bg-yellow-50/70 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-yellow-900 uppercase">Bières & Panachés</span>
                  <span className="text-lg">🍺</span>
                </div>
                <p className="text-2xl font-black text-yellow-950 mt-1">
                  {beerBottles} bouteilles / canettes
                </p>
                <p className="text-[11px] text-yellow-800 mt-1">
                  Solibra, Beaufort Lager, Bock & Heineken très fraîches
                </p>
              </div>

              {/* Sodas, Sucreries & Jus d'Abidjan */}
              <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50/40 hover:bg-orange-50/70 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-orange-900 uppercase">Softs & Jus de fruits</span>
                  <span className="text-lg">🧃</span>
                </div>
                <p className="text-2xl font-black text-orange-950 mt-1">
                  {softDrinksBottles} bouteilles
                </p>
                <p className="text-[11px] text-orange-800 mt-1">
                  Sodas, jus d&apos;orange, Bissap & Gingembre naturel
                </p>
              </div>

              {/* Eau Minérale */}
              <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/40 hover:bg-sky-50/70 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-sky-900 uppercase">Eau Minérale Naturelle</span>
                  <span className="text-lg">💧</span>
                </div>
                <p className="text-2xl font-black text-sky-950 mt-1">
                  {waterPacks} packs de 12
                </p>
                <p className="text-[11px] text-sky-800 mt-1">
                  Packs d&apos;eau Awa / Céleste (bouteilles 0.5L et 1.5L)
                </p>
              </div>

              {/* Spiritueux & Cocktails */}
              <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50/70 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-900 uppercase">Spiritueux & Bar</span>
                  <span className="text-lg">🍸</span>
                </div>
                <p className="text-2xl font-black text-purple-950 mt-1">
                  {spiritsBottles} bouteilles
                </p>
                <p className="text-[11px] text-purple-800 mt-1">
                  Whisky, Rhum, Gin & Vodka pour les cocktails de nuit
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: BUFFET & REPAS TRAITEUR */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-emerald-600" />
              <h3 className="text-sm font-black uppercase tracking-wider text-happy-ink-900">
                2. Buffet, Amuse-Bouches & Gâteau
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Amuse-bouches */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-900 uppercase">Canapés & Cocktail</span>
                  <span className="text-lg">🍢</span>
                </div>
                <p className="text-2xl font-black text-emerald-950 mt-1">
                  {canapesPieces} pièces
                </p>
                <p className="text-[11px] text-emerald-800 mt-1">
                  Mini-brochettes, pastels, samoussas & toasts (8 pcs/invité)
                </p>
              </div>

              {/* Plats de résistance */}
              <div className="p-4 rounded-2xl border border-teal-200 bg-teal-50/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-teal-900 uppercase">Buffet Chaud</span>
                  <span className="text-lg">🍗</span>
                </div>
                <p className="text-2xl font-black text-teal-950 mt-1">
                  {buffetPortions} portions
                </p>
                <p className="text-[11px] text-teal-800 mt-1">
                  Mérou braisé, poulet piqué, alloco, riz pilaf & attiéké
                </p>
              </div>

              {/* Gâteau */}
              <div className="p-4 rounded-2xl border border-pink-200 bg-pink-50/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-pink-900 uppercase">Gâteau d&apos;Événement</span>
                  <span className="text-lg">🎂</span>
                </div>
                <p className="text-2xl font-black text-pink-950 mt-1">
                  {cakePortions} parts
                </p>
                <p className="text-[11px] text-pink-800 mt-1">
                  Pièce montée ou gâteau design personnalisé
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-happy-ink-100">
            <p className="text-xs text-happy-ink-500">
              💡 <em>Astuce Happy : Prévoyez toujours 15% de glace pilée et de glaçons en supplément pour les cocktails en climat tropical.</em>
            </p>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(cateringSummaryText)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="whatsapp" className="w-full text-xs" leftIcon={<Send className="h-4 w-4" />}>
                Partager l&apos;estimation au Caviste / Traiteur
              </Button>
            </a>
          </div>
        </Card>
      )}

      {/* TAB 2: TIMELINE PLANNING */}
      {activeTab === "timeline" && (
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-happy-ink-100">
            <div>
              <h2 className="text-lg font-bold text-happy-ink-900 font-display">
                Planning suggéré par l&apos;IA : Anniversaire VIP (100 personnes)
              </h2>
              <p className="text-xs text-happy-ink-500 mt-0.5">
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
                className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-happy-sand-50/70 border border-happy-ink-100 hover:border-happy-coral-200 transition-colors"
              >
                <div className="rounded-xl bg-white border border-happy-sand-200 px-2.5 sm:px-3 py-1.5 text-xs font-mono font-bold text-happy-coral-600 shrink-0 shadow-2xs">
                  {step.time}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs sm:text-sm font-bold text-happy-ink-900">{step.title}</h3>
                    <Badge variant="confirmed">{step.badge}</Badge>
                  </div>
                  <p className="text-xs text-happy-ink-600 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 3: WHATSAPP GENERATOR */}
      {activeTab === "whatsapp" && (
        <Card className="p-4 sm:p-6">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-lg font-bold text-happy-ink-900 font-display">
              Générateur de Messages d&apos;Invitation WhatsApp
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

              <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between flex-wrap gap-2">
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

      {/* TAB 4: CHECKLIST */}
      {activeTab === "checklist" && (
        <Card className="p-4 sm:p-6">
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
