"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Compass,
  Calendar,
  QrCode,
  MessageCircle,
  Users,
  Bot,
  LayoutDashboard,
  CreditCard,
  CheckCircle2,
  ShieldAlert,
  ExternalLink,
  Volume2,
  MapPin,
  Crown,
  Wine,
  Utensils,
  Smartphone,
  ArrowRight,
  Minimize2,
  Maximize2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TourStep {
  id: string;
  stepNumber: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  targetUrl: string;
  requiresAuth?: boolean;
  highlights: string[];
  proTip: string;
  iconName:
    | "sparkles"
    | "ticket"
    | "whatsapp"
    | "users"
    | "scanner"
    | "ai"
    | "dashboard"
    | "pricing";
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "creation-studio",
    stepNumber: 1,
    badge: "Étape 1 sur 8 • Création & Design",
    title: "Créez votre événement en 3 minutes chrono",
    subtitle: "Mariages, Anniversaires VIP, Dots coutumières, Baptêmes & Galas",
    description:
      "Choisissez parmi nos modèles haute couture pensés pour la Côte d'Ivoire et l'Afrique francophone. Personnalisez les couleurs, les horaires, le dress code et les lieux avec géolocalisation Google Maps intégrée.",
    targetUrl: "/templates",
    highlights: [
      "Thèmes prestigieux : Or Impérial, Wax Royal, Ivoire & Émeraude",
      "Configuration multi-étapes (Mairie, Église/Mosquée, Réception)",
      "Génération instantanée d'un lien unique personnalisable (/e/votre-evenement)",
    ],
    proTip:
      "Astuce : Vous pouvez changer de thème visuel à tout moment sans perdre vos invités ni modifier le lien envoyé.",
    iconName: "sparkles",
  },
  {
    id: "public-pass",
    stepNumber: 2,
    badge: "Étape 2 sur 8 • Expérience Invité",
    title: "Le Faire-Part Digital & Pass VIP avec QR Code",
    subtitle: "Une page d'invitation somptueuse sur mobile, sans aucune application à installer",
    description:
      "Chaque invité découvre une page web fluide aux couleurs de votre cérémonie : compte à rebours en direct, itinéraire GPS en 1 clic, programme détaillé et génération de son Pass d'accès personnel avec QR Code cryptographique.",
    targetUrl: "/e/mariage-marc-et-aminata",
    highlights: [
      "Compte à rebours dynamique jusqu'au jour J",
      "Billet QR Code unique téléchargeable en image HD sur le téléphone",
      "Itinéraire Google Maps & Waze direct vers la salle de réception",
    ],
    proTip:
      "Testez en direct le Pass public du Mariage de Marc & Aminata pour voir exactement ce que reçoivent vos invités !",
    iconName: "ticket",
  },
  {
    id: "whatsapp-rsvp",
    stepNumber: 3,
    badge: "Étape 3 sur 8 • Diffusion WhatsApp & RSVP",
    title: "Partage WhatsApp 1-Clic & Confirmations en Direct",
    subtitle: "Fini les listes papier et les appels interminables pour savoir qui vient",
    description:
      "Envoyez vos invitations personnalisées sur WhatsApp en un clic. Vos invités confirment leur présence, indiquent leurs accompagnants (+1), leurs préférences alimentaires et vous laissent un mot au Livre d'Or.",
    targetUrl: "/dashboard/rsvp",
    requiresAuth: true,
    highlights: [
      "Messages WhatsApp pré-rédigés avec le prénom de chaque invité",
      "Collecte des régimes alimentaires (Standard, Halal, Végétarien, Sans allergènes)",
      "Notifications en temps réel à chaque nouvelle réponse",
    ],
    proTip:
      "Relancez en 1 clic uniquement les invités 'En attente' à J-7 sans déranger ceux qui ont déjà confirmé.",
    iconName: "whatsapp",
  },
  {
    id: "guests-management",
    stepNumber: 4,
    badge: "Étape 4 sur 8 • Carnet d'Invités & VIP",
    title: "Gestion Intelligente des Invités & Groupes",
    subtitle: "Organisez Familles, Amis, Collègues et Tables d'Honneur sans stress",
    description:
      "Importez vos contacts par fichier CSV ou ajoutez-les à la volée. Filtrez par statut (Confirmé, En attente, Décliné), attribuez le statut VIP et contrôlez les quotas d'accompagnants (+1) autorisés.",
    targetUrl: "/dashboard/guests",
    requiresAuth: true,
    highlights: [
      "Import/Export CSV compatible Excel & Google Sheets",
      "Attribution de badges VIP pour un accueil privilégié au protocole",
      "Recherche instantanée par nom, téléphone (+225) ou groupe",
    ],
    proTip:
      "Chaque invité créé reçoit automatiquement un jeton QR cryptographique unique impossible à falsifier.",
    iconName: "users",
  },
  {
    id: "qr-checkin",
    stepNumber: 5,
    badge: "Étape 5 sur 8 • Sécurité & Accueil Jour J",
    title: "Scanner QR Code Caméra & Anti-Fraude Atomique",
    subtitle: "Validez les entrées en 0,8 seconde avec un simple smartphone à l'accueil",
    description:
      "Le jour J, vos hôtesses scannent les billets QR avec la caméra de leur téléphone (WebRTC). Notre verrou atomique bloque instantanément tout billet déjà utilisé ou partagé frauduleusement.",
    targetUrl: "/dashboard/checkin",
    requiresAuth: true,
    highlights: [
      "Scan caméra direct dans le navigateur (aucun matériel coûteux requis)",
      "Protection anti-doublon atomique : alerte rouge si un pass est présenté 2 fois",
      "Mode recherche manuelle de secours si l'invité a oublié son téléphone",
    ],
    proTip:
      "Plusieurs hôtesses peuvent scanner simultanément à différentes portes d'entrée : la synchronisation est instantanée.",
    iconName: "scanner",
  },
  {
    id: "happy-ai",
    stepNumber: 6,
    badge: "Étape 6 sur 8 • Intelligence Artificielle",
    title: "Happy AI : Calculateur Traiteur & Boissons",
    subtitle: "Zéro gaspillage, zéro pénurie : estimez vos quantités exactes en FCFA",
    description:
      "Basé sur le nombre réel d'invités confirmés, le type de cérémonie et la météo d'Abidjan, Happy AI calcule le nombre exact de bouteilles (Champagne, Vin, Liqueurs, Bissap/Jus, Eau) et les portions traiteur nécessaires.",
    targetUrl: "/dashboard/ai",
    requiresAuth: true,
    highlights: [
      "Calcul ajusté selon la durée de la soirée et la température ambiante",
      "Répartition précise : Champagne, Vins, Bières, Jus naturels & Eau minérale",
      "Génération d'une fiche de commande prête pour votre traiteur",
    ],
    proTip:
      "Utilisez le simulateur interactif ci-contre pour voir comment Happy AI adapte les quantités selon vos invités !",
    iconName: "ai",
  },
  {
    id: "organizer-dashboard",
    stepNumber: 7,
    badge: "Étape 7 sur 8 • Pilotage Centralisé",
    title: "Un Tableau de Bord Complet & Multi-Événements",
    subtitle: "Pilotez un ou plusieurs événements depuis votre téléphone ou ordinateur",
    description:
      "Suivez d'un seul coup d'œil le taux de confirmation, la jauge de remplissage de la salle, les dernières réponses reçues et basculez facilement entre votre Mariage Civile, la Dot et la Soirée de Gala.",
    targetUrl: "/dashboard",
    requiresAuth: true,
    highlights: [
      "Sélecteur rapide multi-événements en haut de l'écran",
      "Ajout rapide d'invité en 5 secondes depuis l'accueil du Dashboard",
      "Interface 100% adaptée aux smartphones (barre de navigation tactile)",
    ],
    proTip:
      "En cliquant sur 'Visiter cette page en direct', nous vous connectons automatiquement au compte Démo Organisateur.",
    iconName: "dashboard",
  },
  {
    id: "pricing-mobile-money",
    stepNumber: 8,
    badge: "Étape 8 sur 8 • Tarifs & Mobile Money",
    title: "Démarrez gratuitement, évoluez selon vos besoins",
    subtitle: "Forfaits transparents en FCFA payables par Wave, Orange Money & MTN",
    description:
      "Créez et testez votre événement gratuitement jusqu'à 30 invités. Passez aux formules Célébration (15 000 FCFA) ou Prestige (35 000 FCFA) en un clic via votre compte Mobile Money habituel.",
    targetUrl: "/pricing",
    highlights: [
      "Formule Découverte 100% Gratuite (jusqu'à 30 invités, pass QR inclus)",
      "Paiement local instantané : Wave CI, Orange Money, MTN MoMo & Cartes",
      "Aucun abonnement caché : vous payez uniquement à l'événement",
    ],
    proTip:
      "Prêt à lancer votre propre événement ? Cliquez sur 'Créer mon événement' à la fin de cette visite !",
    iconName: "pricing",
  },
];

export function GuidedTour() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isNavigatingLive, setIsNavigatingLive] = useState(false);
  const [showFloatingBadge, setShowFloatingBadge] = useState(true);

  // Interactive preview states inside the tour modal
  const [selectedThemePreview, setSelectedThemePreview] = useState<"gold" | "wax" | "emerald">("gold");
  const [simulatedRsvpSent, setSimulatedRsvpSent] = useState(false);
  const [simulatedGuestFilter, setSimulatedGuestFilter] = useState<"ALL" | "VIP" | "CONFIRMED">("ALL");
  const [simulatedScanState, setSimulatedScanState] = useState<"idle" | "valid" | "duplicate">("idle");
  const [simulatedGuestCount, setSimulatedGuestCount] = useState(150);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"wave" | "orange" | "mtn">("wave");

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Listen to custom event `open-guided-tour` from anywhere in the app
  useEffect(() => {
    const handleOpenTour = (e: Event) => {
      const customEvt = e as CustomEvent<{ stepIndex?: number }>;
      if (typeof customEvt.detail?.stepIndex === "number") {
        setCurrentStepIndex(customEvt.detail.stepIndex);
      }
      setIsMinimized(false);
      setIsOpen(true);
    };

    window.addEventListener("open-guided-tour", handleOpenTour);
    return () => window.removeEventListener("open-guided-tour", handleOpenTour);
  }, []);

  // Keyboard navigation (Left / Right / Escape)
  useEffect(() => {
    if (!isOpen || isMinimized) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setAutoPlay(false);
      } else if (e.key === "ArrowRight") {
        setCurrentStepIndex((prev) => (prev + 1) % TOUR_STEPS.length);
      } else if (e.key === "ArrowLeft") {
        setCurrentStepIndex((prev) => (prev - 1 + TOUR_STEPS.length) % TOUR_STEPS.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isMinimized]);

  // Auto-play timer
  useEffect(() => {
    if (!isOpen || isMinimized || !autoPlay) return;
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev + 1 >= TOUR_STEPS.length) {
          setAutoPlay(false);
          return prev;
        }
        return prev + 1;
      });
    }, 6500);
    return () => clearInterval(timer);
  }, [isOpen, isMinimized, autoPlay]);

  const handleNext = useCallback(() => {
    setAutoPlay(false);
    if (currentStepIndex + 1 < TOUR_STEPS.length) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      if (isMinimized) {
        navigateToStepLive(TOUR_STEPS[nextIdx]);
      }
    } else {
      setIsOpen(false);
      setIsMinimized(false);
    }
  }, [currentStepIndex, isMinimized]);

  const handlePrev = useCallback(() => {
    setAutoPlay(false);
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      if (isMinimized) {
        navigateToStepLive(TOUR_STEPS[prevIdx]);
      }
    }
  }, [currentStepIndex, isMinimized]);

  const navigateToStepLive = async (step: TourStep) => {
    setIsNavigatingLive(true);
    try {
      if (step.requiresAuth) {
        // Ensure visitor has an active session (auto-login demo account if not logged in)
        const sessionRes = await fetch("/api/auth/session");
        const sessionJson = await sessionRes.json();
        if (!sessionJson.success || !sessionJson.data?.user) {
          await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isDemo: true }),
          });
        }
      }
      setIsMinimized(true);
      router.push(step.targetUrl);
    } catch {
      setIsMinimized(true);
      router.push(step.targetUrl);
    } finally {
      setIsNavigatingLive(false);
    }
  };

  const renderStepIcon = (iconName: TourStep["iconName"]) => {
    switch (iconName) {
      case "sparkles":
        return <Sparkles className="h-5 w-5 text-amber-400" />;
      case "ticket":
        return <QrCode className="h-5 w-5 text-happy-coral-400" />;
      case "whatsapp":
        return <MessageCircle className="h-5 w-5 text-emerald-400" />;
      case "users":
        return <Users className="h-5 w-5 text-blue-400" />;
      case "scanner":
        return <QrCode className="h-5 w-5 text-emerald-400" />;
      case "ai":
        return <Bot className="h-5 w-5 text-purple-400" />;
      case "dashboard":
        return <LayoutDashboard className="h-5 w-5 text-amber-400" />;
      case "pricing":
        return <CreditCard className="h-5 w-5 text-happy-coral-400" />;
    }
  };

  // Renders an interactive visual simulator tailored to the current step
  const renderInteractiveStage = () => {
    switch (currentStep.id) {
      case "creation-studio":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-happy-ink-400">
                Testez les Thèmes en Direct
              </span>
              <div className="flex gap-1.5">
                {[
                  { id: "gold", label: "👑 Or Impérial" },
                  { id: "wax", label: "🌺 Wax Royal" },
                  { id: "emerald", label: "💎 Émeraude" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedThemePreview(t.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      selectedThemePreview === t.id
                        ? "bg-happy-coral-500 text-white shadow-sm"
                        : "bg-happy-ink-800 text-happy-ink-300 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`rounded-2xl p-5 border transition-all duration-300 ${
                selectedThemePreview === "gold"
                  ? "bg-gradient-to-br from-amber-950/90 via-happy-ink-900 to-amber-900/40 border-amber-500/40"
                  : selectedThemePreview === "wax"
                  ? "bg-gradient-to-br from-happy-coral-950/90 via-happy-ink-900 to-rose-900/40 border-happy-coral-500/40"
                  : "bg-gradient-to-br from-emerald-950/90 via-happy-ink-900 to-teal-900/40 border-emerald-500/40"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold mb-2">
                <span>MARIAGE NUPTIAL • ABIDJAN</span>
                <span>17 OCT. 2026</span>
              </div>
              <h4 className="text-xl font-black font-display text-white">
                Marc & Aminata
              </h4>
              <p className="text-xs text-happy-ink-300 mt-1 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                Sofitel Abidjan Hôtel Ivoire — Salle Chandelier
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-happy-ink-300">Lien généré :</span>
                <span className="font-mono text-amber-300 font-bold">
                  happyevents.ci/e/mariage-marc-et-aminata
                </span>
              </div>
            </div>
          </div>
        );

      case "public-pass":
        return (
          <div className="space-y-3">
            <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-happy-ink-900 to-happy-ink-950 p-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-happy-ink-800">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                    PASS VIP TABLE D&apos;HONNEUR
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">
                    Invité : M. Jean-Marc Kouassi (+1)
                  </h4>
                </div>
                <Crown className="h-5 w-5 text-amber-400" />
              </div>

              <div className="my-3 flex items-center gap-4 bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="h-16 w-16 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
                  <QrCode className="h-full w-full text-happy-ink-950" />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Billet Cryptographique Actif
                  </p>
                  <p className="text-happy-ink-300 text-[11px]">
                    Présentez ce QR Code à l&apos;entrée du Sofitel Hôtel Ivoire.
                  </p>
                  <p className="font-mono text-[10px] text-amber-400">
                    TOKEN: QR-8F92A-VIP
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="rounded-lg bg-happy-ink-800/80 p-2">
                  <span className="block text-happy-ink-400 text-[10px]">Cérémonie</span>
                  <strong className="text-white">15h00</strong>
                </div>
                <div className="rounded-lg bg-happy-ink-800/80 p-2">
                  <span className="block text-happy-ink-400 text-[10px]">Dîner Gala</span>
                  <strong className="text-white">20h00</strong>
                </div>
                <div className="rounded-lg bg-happy-ink-800/80 p-2">
                  <span className="block text-happy-ink-400 text-[10px]">Table</span>
                  <strong className="text-amber-400">Or #1</strong>
                </div>
              </div>
            </div>
          </div>
        );

      case "whatsapp-rsvp":
        return (
          <div className="space-y-3">
            <div className="rounded-2xl border border-emerald-500/30 bg-happy-ink-900/90 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4" /> Simulation de réponse invité
                </span>
                <span className="text-[10px] text-happy-ink-400">Temps réel</span>
              </div>

              {!simulatedRsvpSent ? (
                <div className="space-y-3">
                  <p className="text-xs text-happy-ink-200">
                    Cliquez ci-dessous pour simuler la confirmation d&apos;un invité depuis WhatsApp :
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSimulatedRsvpSent(true)}
                      className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Je confirme (+1)
                    </button>
                    <button
                      onClick={() => setSimulatedRsvpSent(true)}
                      className="p-2.5 rounded-xl bg-happy-ink-800 hover:bg-happy-ink-700 text-happy-ink-200 text-xs font-semibold transition-colors"
                    >
                      Menu Halal / Sans alcool
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      RSVP enregistré instantanément !
                    </span>
                    <button
                      onClick={() => setSimulatedRsvpSent(false)}
                      className="text-[10px] text-happy-ink-400 underline hover:text-white"
                    >
                      Réinitialiser
                    </button>
                  </div>
                  <p className="text-[11px] text-happy-ink-200">
                    L&apos;organisateur reçoit la notification et le Pass QR est activé automatiquement.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case "guests-management": {
        const sampleGuests = [
          { name: "Aïcha Traoré", group: "Famille", vip: true, status: "CONFIRMED" },
          { name: "Marc-Antoine Konan", group: "Amis", vip: true, status: "CONFIRMED" },
          { name: "Kouadio Yao", group: "Collègues", vip: false, status: "PENDING" },
        ].filter((g) => {
          if (simulatedGuestFilter === "VIP") return g.vip;
          if (simulatedGuestFilter === "CONFIRMED") return g.status === "CONFIRMED";
          return true;
        });

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-happy-ink-400 uppercase">
                Filtrer la liste :
              </span>
              <div className="flex gap-1">
                {[
                  { id: "ALL", label: "Tous (3)" },
                  { id: "VIP", label: "VIP (2)" },
                  { id: "CONFIRMED", label: "Confirmés (2)" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSimulatedGuestFilter(f.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      simulatedGuestFilter === f.id
                        ? "bg-happy-coral-500 text-white"
                        : "bg-happy-ink-800 text-happy-ink-300 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {sampleGuests.map((g, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-happy-ink-900 border border-happy-ink-800 text-xs"
                >
                  <div>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      {g.name}
                      {g.vip && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                          VIP
                        </span>
                      )}
                    </p>
                    <span className="text-[10px] text-happy-ink-400">{g.group}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      g.status === "CONFIRMED"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-950 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {g.status === "CONFIRMED" ? "Confirmé" : "En attente"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "qr-checkin":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-happy-ink-400">
                Testez le Scanner Anti-Fraude :
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setSimulatedScanState("valid")}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors"
                >
                  1er Scan (Valide)
                </button>
                <button
                  onClick={() => setSimulatedScanState("duplicate")}
                  className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold transition-colors"
                >
                  2e Scan (Doublon)
                </button>
              </div>
            </div>

            {simulatedScanState === "idle" && (
              <div className="rounded-2xl border border-happy-ink-800 bg-happy-ink-900/80 p-5 text-center space-y-2">
                <QrCode className="h-10 w-10 text-happy-coral-400 mx-auto animate-pulse" />
                <p className="text-xs font-bold text-white">
                  Caméra WebRTC prête à scanner
                </p>
                <p className="text-[11px] text-happy-ink-400">
                  Cliquez sur « 1er Scan » ou « 2e Scan » ci-dessus pour voir la réaction du système.
                </p>
              </div>
            )}

            {simulatedScanState === "valid" && (
              <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/70 p-4 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span>ACCÈS AUTORISÉ • INVITÉ VIP</span>
                </div>
                <p className="text-xs text-white font-semibold">
                  Mme Aïcha Traoré (+1 accompagnant) — Table d&apos;Honneur #1
                </p>
                <p className="text-[10px] text-emerald-400">
                  Verrou atomique enregistré à l&apos;instant.
                </p>
              </div>
            )}

            {simulatedScanState === "duplicate" && (
              <div className="rounded-2xl border border-red-500/60 bg-red-950/80 p-4 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-2 text-red-300 font-bold text-xs">
                  <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
                  <span>ALERTE ANTI-FRAUDE : BILLET DÉJÀ SCANNÉ !</span>
                </div>
                <p className="text-xs text-white font-semibold">
                  Ce QR Code a déjà été validé à 19h42 par l&apos;hôtesse Porte A.
                </p>
                <p className="text-[10px] text-red-300">
                  Tentative de réutilisation bloquée automatiquement.
                </p>
              </div>
            )}
          </div>
        );

      case "happy-ai": {
        const champagne = Math.ceil(simulatedGuestCount / 6);
        const wine = Math.ceil(simulatedGuestCount / 4);
        const naturalJuice = Math.ceil(simulatedGuestCount * 0.6);
        const waterBottles = Math.ceil(simulatedGuestCount * 1.5);

        return (
          <div className="space-y-3">
            <div className="rounded-2xl border border-purple-500/30 bg-happy-ink-900/90 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Bot className="h-4 w-4" /> Simulateur Happy AI en direct
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black">
                  {simulatedGuestCount} invités
                </span>
              </div>

              <div>
                <input
                  type="range"
                  min={30}
                  max={400}
                  step={10}
                  value={simulatedGuestCount}
                  onChange={(e) => setSimulatedGuestCount(Number(e.target.value))}
                  className="w-full accent-happy-coral-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-happy-ink-400 mt-0.5">
                  <span>30 invités</span>
                  <span>Glissez pour calculer</span>
                  <span>400 invités</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-happy-ink-950 border border-happy-ink-800 flex items-center justify-between">
                  <span className="text-happy-ink-300 flex items-center gap-1.5">
                    <Wine className="h-3.5 w-3.5 text-amber-400" /> Champagne
                  </span>
                  <strong className="text-white">{champagne} bout.</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-happy-ink-950 border border-happy-ink-800 flex items-center justify-between">
                  <span className="text-happy-ink-300 flex items-center gap-1.5">
                    <Wine className="h-3.5 w-3.5 text-rose-400" /> Vins rouges/bl.
                  </span>
                  <strong className="text-white">{wine} bout.</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-happy-ink-950 border border-happy-ink-800 flex items-center justify-between">
                  <span className="text-happy-ink-300 flex items-center gap-1.5">
                    <Utensils className="h-3.5 w-3.5 text-emerald-400" /> Bissap / Jus
                  </span>
                  <strong className="text-white">{naturalJuice} L</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-happy-ink-950 border border-happy-ink-800 flex items-center justify-between">
                  <span className="text-happy-ink-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-400" /> Eau minérale
                  </span>
                  <strong className="text-white">{waterBottles} bout.</strong>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "organizer-dashboard":
        return (
          <div className="rounded-2xl border border-happy-ink-800 bg-happy-ink-900/90 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                Aperçu Temps Réel • Mariage Marc & Aminata
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                EN DIRECT
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-happy-ink-950 border border-happy-ink-800">
                <p className="text-[10px] text-happy-ink-400 uppercase font-bold">Invités</p>
                <p className="text-lg font-black text-white">188</p>
              </div>
              <div className="p-2.5 rounded-xl bg-happy-ink-950 border border-happy-ink-800">
                <p className="text-[10px] text-emerald-400 uppercase font-bold">Confirmés</p>
                <p className="text-lg font-black text-emerald-400">94%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-happy-ink-950 border border-happy-ink-800">
                <p className="text-[10px] text-amber-400 uppercase font-bold">VIP</p>
                <p className="text-lg font-black text-amber-400">42</p>
              </div>
            </div>
            <div className="w-full bg-happy-ink-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-happy-coral-500 to-amber-400 h-full w-[94%] rounded-full" />
            </div>
          </div>
        );

      case "pricing-mobile-money":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "wave", name: "Wave CI", fee: "0% frais", color: "border-cyan-500/50 bg-cyan-950/40 text-cyan-300" },
                { id: "orange", name: "Orange Money", fee: "Instantané", color: "border-orange-500/50 bg-orange-950/40 text-orange-300" },
                { id: "mtn", name: "MTN MoMo", fee: "Sécurisé", color: "border-yellow-500/50 bg-yellow-950/40 text-yellow-300" },
              ].map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setSelectedPaymentMethod(pm.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedPaymentMethod === pm.id
                      ? pm.color
                      : "border-happy-ink-800 bg-happy-ink-900/60 text-happy-ink-400"
                  }`}
                >
                  <p className="text-xs font-bold">{pm.name}</p>
                  <p className="text-[10px] opacity-80">{pm.fee}</p>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-happy-ink-800 bg-happy-ink-900/90 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-happy-ink-300">🌱 Formule Découverte (≤ 30 invités)</span>
                <strong className="text-emerald-400">0 FCFA (Gratuit)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">🎉 Formule Célébration (≤ 200 invités)</span>
                <strong className="text-amber-400">15 000 FCFA</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">👑 Formule Prestige (Invités illimités + IA)</span>
                <strong className="text-happy-coral-400">35 000 FCFA</strong>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* 1. Floating Launcher Pill (Bottom-Right) when Tour is closed */}
      {!isOpen && showFloatingBadge && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-1.5 animate-fadeIn">
          <button
            onClick={() => {
              setIsMinimized(false);
              setIsOpen(true);
            }}
            className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-happy-ink-950 via-happy-ink-900 to-happy-ink-950 border border-amber-500/40 px-4 py-2.5 text-white shadow-2xl hover:border-happy-coral-500 hover:scale-105 transition-all duration-200"
            title="Lancer la visite guidée interactive de HAPPY EVENTS"
          >
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-happy-coral-500 to-amber-500 text-white">
              <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "8s" }} />
            </span>
            <div className="text-left">
              <span className="block text-xs font-extrabold tracking-tight leading-none">
                Visite Guidée
              </span>
              <span className="block text-[10px] text-amber-400 font-semibold mt-0.5">
                Découvrir les 8 outils →
              </span>
            </div>
          </button>

          <button
            onClick={() => setShowFloatingBadge(false)}
            className="h-7 w-7 rounded-full bg-happy-ink-900/90 border border-happy-ink-700 text-happy-ink-400 hover:text-white flex items-center justify-center text-xs shadow-md"
            aria-label="Masquer le bouton de visite guidée"
            title="Masquer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 2. Minimized Live-Page Guided Dock (Bottom Bar while browsing real pages) */}
      {isOpen && isMinimized && (
        <div className="fixed bottom-20 lg:bottom-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl rounded-3xl border border-amber-500/40 bg-happy-ink-950/95 p-3.5 sm:px-5 text-white shadow-2xl backdrop-blur-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-happy-coral-500 to-amber-500 text-white font-black text-xs">
                {currentStep.stepNumber}/8
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Mode Exploration En Direct
                  </span>
                  <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                    {pathname}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                  {currentStep.title}
                </h4>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="p-2 rounded-xl bg-happy-ink-800 text-happy-ink-300 hover:text-white disabled:opacity-40"
                title="Étape précédente"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsMinimized(false)}
                className="px-3 py-2 rounded-xl bg-happy-ink-800 hover:bg-happy-ink-700 text-amber-300 text-xs font-bold flex items-center gap-1.5"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Détails</span>
              </button>

              <button
                onClick={handleNext}
                className="px-3.5 py-2 rounded-xl bg-happy-coral-500 hover:bg-happy-coral-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-soft"
              >
                <span>
                  {currentStepIndex + 1 < TOUR_STEPS.length ? "Étape suivante" : "Terminer"}
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                className="p-2 rounded-xl text-happy-ink-400 hover:text-white hover:bg-happy-ink-800"
                title="Fermer la visite guidée"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Full Interactive Guided Tour Modal */}
      {isOpen && !isMinimized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-happy-ink-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl rounded-3xl border border-happy-ink-800 bg-[#0B101E] text-white shadow-2xl overflow-hidden my-auto">
            {/* Top Progress Bar */}
            <div className="w-full bg-happy-ink-900 h-1.5 flex">
              {TOUR_STEPS.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex-1 h-full cursor-pointer transition-all duration-300 ${
                    idx <= currentStepIndex
                      ? "bg-gradient-to-r from-happy-coral-500 to-amber-400"
                      : "bg-happy-ink-800"
                  }`}
                />
              ))}
            </div>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-happy-ink-800/80 bg-happy-ink-950/60">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-happy-coral-500 to-amber-500 text-white shadow-soft">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-black tracking-tight font-display text-white">
                    VISITE GUIDÉE INTERACTIVE • HAPPY<span className="text-happy-coral-500">EVENTS</span>
                  </span>
                  <p className="text-[11px] text-happy-ink-400">
                    Découvrez toutes les fonctionnalités en 2 minutes ou testez chaque page en direct
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Auto-Play toggle */}
                <button
                  onClick={() => setAutoPlay(!autoPlay)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    autoPlay
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                      : "bg-happy-ink-900 border-happy-ink-800 text-happy-ink-300 hover:text-white"
                  }`}
                >
                  {autoPlay ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">
                    {autoPlay ? "Pause" : "Lecture auto"}
                  </span>
                </button>

                {/* Minimize to Dock */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 rounded-xl bg-happy-ink-900 border border-happy-ink-800 text-happy-ink-300 hover:text-white"
                  title="Réduire en barre flottante"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>

                {/* Close button */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setAutoPlay(false);
                  }}
                  className="p-2 rounded-xl bg-happy-ink-900 border border-happy-ink-800 text-happy-ink-300 hover:text-red-400"
                  title="Fermer (Échap)"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Step Selector Pills */}
            <div className="px-5 sm:px-7 py-2.5 bg-happy-ink-950/40 border-b border-happy-ink-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {TOUR_STEPS.map((step, idx) => {
                const active = idx === currentStepIndex;
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      setAutoPlay(false);
                      setCurrentStepIndex(idx);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                      active
                        ? "bg-happy-coral-500 text-white shadow-sm"
                        : idx < currentStepIndex
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                        : "bg-happy-ink-900 text-happy-ink-400 hover:text-white"
                    }`}
                  >
                    <span>{step.stepNumber}.</span>
                    <span>
                      {step.stepNumber === 1 && "Création"}
                      {step.stepNumber === 2 && "Pass QR Public"}
                      {step.stepNumber === 3 && "WhatsApp RSVP"}
                      {step.stepNumber === 4 && "Invités & VIP"}
                      {step.stepNumber === 5 && "Scanner Entrée"}
                      {step.stepNumber === 6 && "Happy AI"}
                      {step.stepNumber === 7 && "Dashboard"}
                      {step.stepNumber === 8 && "Tarifs & Wave"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Main 2-Column Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-7">
              {/* Left Column: Explanation & Highlights (7 cols) */}
              <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-happy-ink-900 border border-happy-ink-700 text-xs font-bold text-amber-400">
                    {renderStepIcon(currentStep.iconName)}
                    <span>{currentStep.badge}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black font-display text-white leading-tight">
                    {currentStep.title}
                  </h2>

                  <p className="text-xs sm:text-sm font-semibold text-happy-coral-400">
                    {currentStep.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-happy-ink-300 leading-relaxed">
                    {currentStep.description}
                  </p>

                  {/* Key Feature Bullets */}
                  <div className="pt-2 space-y-2">
                    {currentStep.highlights.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-happy-ink-200">
                        <div className="mt-0.5 h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Tip Box */}
                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
                  <strong className="text-amber-400 block mb-0.5">💡 Bon à savoir :</strong>
                  {currentStep.proTip}
                </div>
              </div>

              {/* Right Column: Interactive Live Simulator + Direct Page Button (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-happy-ink-800 bg-happy-ink-950/80 p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-happy-ink-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-happy-ink-400">
                      Aperçu Interactif
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  {renderInteractiveStage()}
                </div>

                {/* Open Real Page CTA */}
                <div className="pt-3 border-t border-happy-ink-800 space-y-2">
                  <button
                    onClick={() => navigateToStepLive(currentStep)}
                    disabled={isNavigatingLive}
                    className="w-full py-2.5 px-4 rounded-xl bg-happy-ink-800 hover:bg-happy-ink-700 border border-happy-ink-700 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-happy-coral-400" />
                    <span>
                      {isNavigatingLive
                        ? "Ouverture de la page en direct..."
                        : `Tester cette page en direct (${currentStep.targetUrl})`}
                    </span>
                  </button>
                  {currentStep.requiresAuth && (
                    <p className="text-[10px] text-center text-happy-ink-400">
                      ✓ Connexion Démo Organisateur automatique incluse pour explorer cette page
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer: Step Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-7 py-4 border-t border-happy-ink-800 bg-happy-ink-950/80">
              <div className="flex items-center gap-2 text-xs text-happy-ink-400">
                <span>
                  Étape <strong className="text-white">{currentStep.stepNumber}</strong> sur{" "}
                  <strong className="text-white">{TOUR_STEPS.length}</strong>
                </span>
                <span className="hidden md:inline">• Utilisez les flèches ← → du clavier</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  leftIcon={<ChevronLeft className="h-4 w-4" />}
                  className="text-xs bg-happy-ink-900 border-happy-ink-700 text-white hover:bg-happy-ink-800 disabled:opacity-40"
                >
                  Précédent
                </Button>

                {currentStepIndex + 1 < TOUR_STEPS.length ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleNext}
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                    className="text-xs shadow-soft"
                  >
                    Étape suivante ({currentStepIndex + 2}/8)
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/dashboard/events/new");
                    }}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    className="text-xs bg-gradient-to-r from-happy-coral-500 to-amber-500 shadow-soft"
                  >
                    Créer mon événement maintenant
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

