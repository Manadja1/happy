"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  QrCode,
  Share2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Eye,
  Check,
  Palette,
  Heart,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const TEMPLATE_PRESETS = [
  {
    id: "classic-gold",
    name: "Or Impérial & Ivoire",
    type: "Mariage & Gala",
    badge: "Populaire",
    bgGradient: "from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1]",
    textColor: "text-amber-950",
    borderColor: "border-amber-300",
  },
  {
    id: "wax-chic",
    name: "Wax Royal & Kente",
    type: "Dot & Coutumes",
    badge: "Tradition",
    bgGradient: "from-rose-50/70 via-amber-50/60 to-orange-50/70",
    textColor: "text-happy-ink-950",
    borderColor: "border-happy-coral-300",
  },
  {
    id: "midnight-sparkle",
    name: "Midnight Sparkle",
    type: "Anniversaire VIP",
    badge: "VIP",
    bgGradient: "from-[#0F172A] via-[#1E293B] to-[#090D16]",
    textColor: "text-white",
    borderColor: "border-amber-400/50",
  },
  {
    id: "tropical-luxury",
    name: "Tropical Chic & Émeraude",
    type: "Pool Party & Soirée",
    badge: "Festif",
    bgGradient: "from-emerald-900 via-teal-900 to-slate-900",
    textColor: "text-white",
    borderColor: "border-emerald-400/40",
  },
  {
    id: "celestial-pure",
    name: "Douceur Céleste",
    type: "Baptême & Dédicace",
    badge: "Pureté",
    bgGradient: "from-[#F0F7FF] via-[#F8FAFC] to-[#EFF6FF]",
    textColor: "text-slate-900",
    borderColor: "border-sky-200",
  },
  {
    id: "pastel-romance",
    name: "Pastel Romance",
    type: "Baby Shower & Douceur",
    badge: "Romantique",
    bgGradient: "from-pink-50/70 via-rose-50/40 to-amber-50/50",
    textColor: "text-slate-900",
    borderColor: "border-pink-200",
  },
];

function CreateEventContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTemplate = searchParams.get("template") || "classic-gold";

  const [activeMode, setActiveMode] = useState<"step" | "ai">("step");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form Fields
  const [name, setName] = useState("30 ans d'Ange");
  const [type, setType] = useState("BIRTHDAY");
  const [date, setDate] = useState("2026-09-26");
  const [startTime, setStartTime] = useState("19:30");
  const [endTime, setEndTime] = useState("04:00");
  const [venue, setVenue] = useState("Sofitel Hôtel Ivoire, Salle Chandelier, Abidjan");
  const [description, setDescription] = useState(
    "Nous avons l'immense joie de vous convier à célébrer ce grand cap dans une ambiance festive et chaleureuse !"
  );
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [guestCount, setGuestCount] = useState("100");
  const [allowPlusOne, setAllowPlusOne] = useState(true);
  const [enableQr, setEnableQr] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState(
    "Je veux organiser le mariage de Marc et Aminata le 17 octobre 2026 à Abidjan avec environ 200 invités et un thème Or & Ivoire."
  );

  useEffect(() => {
    const tmpl = searchParams.get("template");
    if (tmpl) {
      setSelectedTemplate(tmpl);
    }

    const typeParam = searchParams.get("type");
    if (typeParam) {
      const lower = typeParam.toLowerCase();
      if (lower.includes("mariage") || lower === "wedding") {
        setType("WEDDING");
        setName("Mariage de Marc & Aminata");
        setSelectedTemplate("classic-gold");
      } else if (lower.includes("anniversaire") || lower === "birthday") {
        setType("BIRTHDAY");
        setName("30 ans d'Ange");
        setSelectedTemplate("midnight-sparkle");
      } else if (lower.includes("dot") || lower === "tradition") {
        setType("TRADITIONAL");
        setName("Dot Coutumière de Koffi & Estelle");
        setSelectedTemplate("wax-chic");
      } else if (lower.includes("gala")) {
        setType("GALA");
        setName("Gala & Awards Tech 2026");
        setSelectedTemplate("classic-gold");
      }
    }

    const promptParam = searchParams.get("prompt");
    if (promptParam) {
      setAiPrompt(promptParam);
      setActiveMode("ai");
    }
  }, [searchParams]);

  const handleAiFill = () => {
    setName("Mariage de Marc & Aminata");
    setType("WEDDING");
    setDate("2026-10-17");
    setStartTime("15:00");
    setEndTime("02:00");
    setVenue("Cathédrale Saint-Paul & Sofitel Ivoire, Abidjan");
    setSelectedTemplate("classic-gold");
    setGuestCount("200");
    setActiveMode("step");
    setCurrentStep(1);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          date,
          startTime,
          endTime,
          venue,
          description,
          theme: currentTplData.name,
          status: "PUBLISHED",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/dashboard?eventId=${json.data.id}`);
        }, 800);
      } else {
        alert(json.error?.message || "Erreur lors de la création de l'événement");
      }
    } catch (err: any) {
      alert("Erreur de communication : " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTplData =
    TEMPLATE_PRESETS.find((t) => t.id === selectedTemplate) ||
    TEMPLATE_PRESETS[0];

  return (
    <div className="flex flex-col space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-happy-ink-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-happy-ink-500 mb-1">
            <Link href="/dashboard" className="hover:text-happy-coral-600">
              Tableau de bord
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-happy-ink-900">Nouvel événement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-happy-ink-900 font-display">
            Créer mon événement
          </h1>
          <p className="text-xs sm:text-sm text-happy-ink-600 mt-1">
            Définissez les détails, personnalisez votre carton d'invitation et préparez vos envois WhatsApp.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-2xl bg-happy-sand-200/80 p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveMode("step")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
              activeMode === "step"
                ? "bg-white text-happy-ink-900 shadow-soft"
                : "text-happy-ink-600 hover:text-happy-ink-900"
            }`}
          >
            Mode Guidé
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("ai")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
              activeMode === "ai"
                ? "bg-white text-happy-coral-600 shadow-soft"
                : "text-happy-ink-600 hover:text-happy-ink-900"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-happy-coral-500" />
            <span>Assistant IA</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3 text-sm font-bold text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Événement créé avec succès ! Redirection vers votre tableau de bord...</span>
        </div>
      )}

      {/* AI MODE */}
      {activeMode === "ai" && (
        <div className="rounded-3xl border border-happy-coral-200 bg-happy-sand-50 p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-center gap-2.5 text-happy-coral-700">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              HAPPY AI Quick Mode • Création Express
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-happy-ink-900 font-display">
            Décrivez votre célébration avec vos propres mots
          </h2>
          <p className="text-xs sm:text-sm text-happy-ink-600">
            L'intelligence artificielle analyse votre demande, configure la date, sélectionne le modèle d'invitation adapté et pré-remplit les champs pour vous.
          </p>

          <div className="space-y-3">
            <textarea
              rows={3}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full rounded-2xl border border-happy-ink-200 bg-white p-4 text-sm text-happy-ink-900 font-medium focus:border-happy-coral-500 focus:outline-none focus:ring-2 focus:ring-happy-coral-500/20"
            />
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="font-bold text-happy-ink-500 mr-2 self-center">
                Exemples rapides :
              </span>
              <button
                type="button"
                onClick={() =>
                  setAiPrompt(
                    "Anniversaire surprise pour mes 40 ans le 12 décembre à Abidjan avec 80 amis proches, thème chic."
                  )
                }
                className="rounded-lg bg-white border border-happy-sand-200 px-2.5 py-1 text-happy-ink-700 hover:border-happy-coral-300"
              >
                🎂 40 ans surprise
              </button>
              <button
                type="button"
                onClick={() =>
                  setAiPrompt(
                    "Dot traditionnelle baoulé le 5 novembre à Yamoussoukro avec 150 convives des deux familles."
                  )
                }
                className="rounded-lg bg-white border border-happy-sand-200 px-2.5 py-1 text-happy-ink-700 hover:border-happy-coral-300"
              >
                👑 Dot traditionnelle
              </button>
              <button
                type="button"
                onClick={() =>
                  setAiPrompt(
                    "Baptême de la petite Marie le 18 octobre à Cocody, réception de 60 invités."
                  )
                }
                className="rounded-lg bg-white border border-happy-sand-200 px-2.5 py-1 text-happy-ink-700 hover:border-happy-coral-300"
              >
                🕊️ Baptême
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              onClick={handleAiFill}
              className="shadow-glow px-6"
              leftIcon={<Wand2 className="h-4 w-4" />}
            >
              Générer et pré-remplir l'événement
            </Button>
          </div>
        </div>
      )}

      {/* GUIDED STEP-BY-STEP MODE */}
      {activeMode === "step" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Left Col */}
          <div className="lg:col-span-7 space-y-6">
            {/* Stepper indicators */}
            <div className="flex items-center justify-between rounded-2xl bg-white border border-happy-ink-100 p-3 shadow-xs">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentStep === 1
                    ? "bg-happy-coral-500 text-white shadow-soft"
                    : "text-happy-ink-600 hover:text-happy-ink-900"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">
                  1
                </span>
                <span>Détails</span>
              </button>

              <div className="h-0.5 w-6 bg-happy-ink-200" />

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentStep === 2
                    ? "bg-happy-coral-500 text-white shadow-soft"
                    : "text-happy-ink-600 hover:text-happy-ink-900"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">
                  2
                </span>
                <span>Carton & Style</span>
              </button>

              <div className="h-0.5 w-6 bg-happy-ink-200" />

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentStep === 3
                    ? "bg-happy-coral-500 text-white shadow-soft"
                    : "text-happy-ink-600 hover:text-happy-ink-900"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">
                  3
                </span>
                <span>Invités & QR</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="rounded-3xl border border-happy-ink-200 bg-white p-6 sm:p-8 shadow-soft space-y-6">
              {/* STEP 1: General Details */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <h3 className="text-lg font-black text-happy-ink-900 font-display">
                    Étape 1 : Informations générales
                  </h3>

                  <Input
                    label="Nom de l'événement"
                    placeholder="Ex: 30 ans d'Ange ou Mariage de Marc & Aminata"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-happy-ink-700">
                      Type de célébration
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="h-11 w-full rounded-xl border border-happy-ink-200 bg-white px-3.5 text-sm text-happy-ink-900 focus:border-happy-coral-500 focus:outline-none"
                    >
                      <option value="BIRTHDAY">Anniversaire / Jubilé</option>
                      <option value="WEDDING">Mariage civil / religieux</option>
                      <option value="DOT">Dot traditionnelle / Coutume</option>
                      <option value="BAPTISM">Baptême / Communion</option>
                      <option value="BABY_SHOWER">Baby Shower</option>
                      <option value="CORPORATE">Gala / Cocktail d'entreprise</option>
                      <option value="GRADUATION">Remise de diplôme</option>
                      <option value="OTHER">Autre célébration</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <Input
                        label="Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="Début"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        label="Fin"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <Input
                    label="Lieu ou Salle de réception"
                    placeholder="Ex: Sofitel Hôtel Ivoire, Abidjan"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    leftIcon={<MapPin className="h-4 w-4" />}
                    required
                  />

                  <Textarea
                    label="Message d'invitation pour les invités"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Partagez quelques mots chaleureux à destination de vos invités..."
                  />

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => setCurrentStep(2)}
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Continuer vers le carton
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: Template Selection */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-happy-ink-900 font-display">
                      Étape 2 : Style du carton d'invitation
                    </h3>
                    <Link
                      href="/templates"
                      target="_blank"
                      className="text-xs text-happy-coral-600 hover:underline font-bold"
                    >
                      Voir toute la galerie
                    </Link>
                  </div>

                  <p className="text-xs text-happy-ink-500">
                    Sélectionnez le design visuel qui sera envoyé à vos invités via WhatsApp et affiché sur leur page mobile sécurisée.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TEMPLATE_PRESETS.map((tpl) => {
                      const isSelected = selectedTemplate === tpl.id;
                      return (
                        <div
                          key={tpl.id}
                          onClick={() => setSelectedTemplate(tpl.id)}
                          className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                            isSelected
                              ? "border-happy-coral-500 bg-happy-coral-50/30 shadow-soft ring-2 ring-happy-coral-500/20"
                              : "border-happy-ink-200 bg-white hover:border-happy-ink-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-happy-ink-900">
                              {tpl.name}
                            </span>
                            {isSelected && (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-happy-coral-500 text-white">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                          <span className="text-[11px] text-happy-ink-500">
                            {tpl.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setCurrentStep(1)}
                      leftIcon={<ChevronLeft className="h-4 w-4" />}
                    >
                      Retour
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => setCurrentStep(3)}
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Continuer vers les options
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Guests & Security Options */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-fadeIn">
                  <h3 className="text-lg font-black text-happy-ink-900 font-display">
                    Étape 3 : Paramètres des invités & Sécurité
                  </h3>

                  <Input
                    label="Nombre d'invités estimés"
                    type="number"
                    min="5"
                    max="2000"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    leftIcon={<Users className="h-4 w-4" />}
                  />

                  <div className="space-y-3 pt-2">
                    {/* Toggle Plus One */}
                    <label className="flex items-start gap-3 rounded-2xl border border-happy-ink-200 p-3.5 hover:bg-happy-sand-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={allowPlusOne}
                        onChange={(e) => setAllowPlusOne(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded text-happy-coral-500 focus:ring-happy-coral-500"
                      />
                      <div>
                        <span className="block text-xs font-bold text-happy-ink-900">
                          Autoriser les accompagnants (+1)
                        </span>
                        <span className="text-[11px] text-happy-ink-500">
                          Permet à vos invités de préciser le nom de leur conjoint ou accompagnant lors du RSVP.
                        </span>
                      </div>
                    </label>

                    {/* Toggle QR Code */}
                    <label className="flex items-start gap-3 rounded-2xl border border-happy-ink-200 p-3.5 hover:bg-happy-sand-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={enableQr}
                        onChange={(e) => setEnableQr(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded text-happy-coral-500 focus:ring-happy-coral-500"
                      />
                      <div>
                        <span className="block text-xs font-bold text-happy-ink-900">
                          Générer un QR Code individuel anti-doublon
                        </span>
                        <span className="text-[11px] text-happy-ink-500">
                          Chaque invité confirmé reçoit un QR Code unique scannable le jour J pour sécuriser l'accès.
                        </span>
                      </div>
                    </label>

                    {/* Toggle WhatsApp Notifications */}
                    <label className="flex items-start gap-3 rounded-2xl border border-happy-ink-200 p-3.5 hover:bg-happy-sand-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={whatsappNotifications}
                        onChange={(e) => setWhatsappNotifications(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded text-happy-coral-500 focus:ring-happy-coral-500"
                      />
                      <div>
                        <span className="block text-xs font-bold text-happy-ink-900">
                          Activer les relances WhatsApp intelligentes
                        </span>
                        <span className="text-[11px] text-happy-ink-500">
                          Générez des messages de rappel personnalisés en un clic pour les invités en attente.
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-happy-ink-100">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setCurrentStep(2)}
                      leftIcon={<ChevronLeft className="h-4 w-4" />}
                    >
                      Retour
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                      className="shadow-glow"
                      rightIcon={<CheckCircle2 className="h-4 w-4" />}
                    >
                      {isSubmitting ? "Création en cours..." : "Créer et ouvrir l'événement"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Col: Live Invitation Card Preview */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="rounded-3xl border border-happy-ink-200 bg-white p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-happy-ink-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-happy-coral-600 flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  Aperçu en direct
                </span>
                <Badge variant="confirmed">Carton Numérique</Badge>
              </div>

              {/* Dynamic Styled Card */}
              <div
                className={`rounded-2xl border ${currentTplData.borderColor} bg-gradient-to-br ${currentTplData.bgGradient} p-6 text-center space-y-4 shadow-sm`}
              >
                <Badge variant="vip" className="mx-auto">
                  {currentTplData.name}
                </Badge>

                <div>
                  <h3
                    className={`text-2xl font-black font-display tracking-tight ${currentTplData.textColor}`}
                  >
                    {name || "Nom de votre événement"}
                  </h3>
                  <p className="text-xs font-medium opacity-80 mt-1">
                    Célébration officielle
                  </p>
                </div>

                <p className="text-xs text-happy-ink-700 italic px-2 line-clamp-3">
                  « {description} »
                </p>

                <div className="rounded-xl bg-white/90 backdrop-blur-xs p-3.5 text-left space-y-2 text-xs border border-black/5 shadow-xs">
                  <div className="flex items-center gap-2 text-happy-ink-800">
                    <Calendar className="h-3.5 w-3.5 text-happy-coral-500 shrink-0" />
                    <span>
                      {date ? new Date(date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Date à définir"} • {startTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-happy-ink-800">
                    <MapPin className="h-3.5 w-3.5 text-happy-coral-500 shrink-0" />
                    <span className="line-clamp-1">{venue || "Lieu à définir"}</span>
                  </div>
                </div>

                {enableQr && (
                  <div className="p-3 bg-white rounded-xl border border-happy-ink-100 flex flex-col items-center">
                    <QrCode className="h-16 w-16 text-happy-ink-900" />
                    <span className="text-[9px] font-mono text-happy-ink-400 mt-1">
                      BILLET INDIVIDUEL ANTI-FRAUDE
                    </span>
                  </div>
                )}

                <div className="pt-1">
                  <div className="w-full py-2.5 rounded-xl bg-happy-coral-500 text-white font-bold text-xs shadow-glow">
                    Confirmer ma présence (RSVP)
                  </div>
                </div>
              </div>

              {/* Meta info */}
              <div className="pt-2 text-center text-xs text-happy-ink-500 flex items-center justify-center gap-1.5">
                <Share2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Génération automatique du lien d'invitation WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewEventPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-happy-coral-500 border-t-transparent" />
        </div>
      }
    >
      <CreateEventContent />
    </Suspense>
  );
}
