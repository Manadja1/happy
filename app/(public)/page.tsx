"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Share2,
  QrCode,
  Users,
  Calendar,
  MessageCircle,
  Shield,
  Clock,
  HeartHandshake,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Zap,
  MapPin,
  Flame,
  Award,
  Smartphone,
  CheckCircle,
  Eye,
  Utensils,
  Camera,
  Copy,
  CheckCheck,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  categoryTab: string;
  pillText: string;
  titlePrefix: string;
  titleHighlight: string;
  titleHighlightGradient: string;
  titleSuffix?: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  imageSrc: string;
  imageAlt: string;
  venue: string;
  date: string;
  guestMetric: string;
  confirmedRate: string;
  confirmedPercent: number;
  floatingRsvp: {
    guest: string;
    details: string;
    time: string;
  };
  floatingCheckin: {
    venue: string;
    detail: string;
    scanSpeed: string;
  };
  featuredTemplate: {
    name: string;
    link: string;
  };
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "mariage",
    categoryTab: "💍 Mariage Royal",
    pillText: "👑 MARIAGES D'EXCEPTION & CÉLÉBRATIONS PRESTIGIEUSES",
    titlePrefix: "Sublimez votre union avec",
    titleHighlight: "l'élégance d'un Mariage Royal",
    titleHighlightGradient: "from-amber-200 via-amber-300 to-yellow-400",
    titleSuffix: "et un accueil d'honneur inoubliable.",
    subtitle:
      "Créez en 3 minutes le faire-part digital qui émerveillera vos familles, partagez vos invitations par WhatsApp avec RSVP en direct et offrez un accueil VIP fluide grâce au billet QR anti-doublon.",
    primaryCtaText: "Créer mon mariage",
    primaryCtaLink: "/dashboard/events/new?type=mariage",
    secondaryCtaText: "Explorer le modèle Mariage Or",
    secondaryCtaLink: "/templates?category=mariage",
    imageSrc: "/images/hero-wedding.jpg",
    imageAlt: "Mariage somptueux en grand salon de fête à Abidjan",
    venue: "Sofitel Hôtel Ivoire, Abidjan",
    date: "17 Octobre 2026 • 15:00",
    guestMetric: "188 invités",
    confirmedRate: "94% confirmés",
    confirmedPercent: 94,
    floatingRsvp: {
      guest: "Famille Traoré (+2)",
      details: "Marc & Aminata : Présence confirmée Table d'Honneur",
      time: "Il y a 2 min",
    },
    floatingCheckin: {
      venue: "Sofitel Hôtel Ivoire",
      detail: "Billet QR scanné • Entrée VIP validée",
      scanSpeed: "1.2s",
    },
    featuredTemplate: {
      name: "👑 Modèle Mariage Or",
      link: "/dashboard/events/new?template=classic-gold",
    },
  },
  {
    id: "anniversaire",
    categoryTab: "🎉 Anniversaire VIP",
    pillText: "✨ ANNIVERSAIRES VIP, ROOFTOP & SOIRÉES EXCLUSIVES",
    titlePrefix: "Transformez votre anniversaire en",
    titleHighlight: "une célébration VIP inoubliable,",
    titleHighlightGradient: "from-happy-coral-400 via-rose-300 to-amber-300",
    titleSuffix: "organisée sans le moindre stress.",
    subtitle:
      "Rassemblez vos amis en un clin d'œil, diffusez vos cartons numériques sur WhatsApp, collectez les confirmations en temps réel et validez les accès au cocktail en 1 seconde par scan QR.",
    primaryCtaText: "Créer mon anniversaire",
    primaryCtaLink: "/dashboard/events/new?type=anniversaire",
    secondaryCtaText: "Découvrir le modèle VIP Night",
    secondaryCtaLink: "/templates?category=anniversaire",
    imageSrc: "/images/hero-birthday.jpg",
    imageAlt: "Anniversaire VIP festif avec cierges magiques sur rooftop à Abidjan",
    venue: "Le Palm Club Rooftop, Plateau",
    date: "26 Septembre 2026 • 20:00",
    guestMetric: "92 invités",
    confirmedRate: "88% confirmés",
    confirmedPercent: 88,
    floatingRsvp: {
      guest: "Marc & Carine Konan (+1)",
      details: "30 ans d'Ange : Confirmation WhatsApp reçue",
      time: "À l'instant",
    },
    floatingCheckin: {
      venue: "Le Palm Club Rooftop",
      detail: "Pass VIP scanné • Cocktail d'accueil validé",
      scanSpeed: "0.8s",
    },
    featuredTemplate: {
      name: "✨ Modèle Wax Royal",
      link: "/dashboard/events/new?template=wax-chic",
    },
  },
  {
    id: "tradition",
    categoryTab: "🌺 Dot Traditionnelle",
    pillText: "🌺 ALLIANCES COUTUMIÈRES & CÉRÉMONIES TRADITIONNELLES",
    titlePrefix: "Célébrez vos traditions et",
    titleHighlight: "la noblesse de vos coutumes",
    titleHighlightGradient: "from-amber-400 via-orange-300 to-rose-400",
    titleSuffix: "avec la fierté de vos racines.",
    subtitle:
      "Rendez hommage aux grandes familles avec un carton numérique aux étoffes royales, transmettez les invitations d'honneur par WhatsApp et maîtrisez l'accueil des délégations en toute sérénité.",
    primaryCtaText: "Créer ma dot coutumière",
    primaryCtaLink: "/dashboard/events/new?type=dot",
    secondaryCtaText: "Explorer les cartons Coutumiers",
    secondaryCtaLink: "/templates?category=tradition",
    imageSrc: "/images/hero-tradition.jpg",
    imageAlt: "Cérémonie traditionnelle de dot avec parures royales à Abidjan",
    venue: "Résidence Les Baobabs, Cocody",
    date: "8 Novembre 2026 • 11:30",
    guestMetric: "150 invités",
    confirmedRate: "96% confirmés",
    confirmedPercent: 96,
    floatingRsvp: {
      guest: "Doyen Kouamé & délégation (+4)",
      details: "Koffi & Estelle : Présence coutumière confirmée",
      time: "Il y a 4 min",
    },
    floatingCheckin: {
      venue: "Résidence Les Baobabs",
      detail: "Accueil délégations • Entrée d'honneur validée",
      scanSpeed: "1.0s",
    },
    featuredTemplate: {
      name: "👑 Modèle Kente Prestige",
      link: "/dashboard/events/new?template=kente",
    },
  },
  {
    id: "gala",
    categoryTab: "🏆 Gala d'Entreprise",
    pillText: "🏆 ÉVÉNEMENTS CORPORATE, AWARDS & SOIRÉES DE PRESTIGE",
    titlePrefix: "Offrez à votre gala d'entreprise",
    titleHighlight: "une signature d'excellence",
    titleHighlightGradient: "from-sky-300 via-indigo-200 to-amber-200",
    titleSuffix: "et un émargement VIP instantané.",
    subtitle:
      "Émettez des badges numériques personnalisés pour vos partenaires et décideurs, suivez les confirmations en temps réel et assurez un contrôle d'accès ultra-rapide sans aucune file d'attente.",
    primaryCtaText: "Créer mon événement pro",
    primaryCtaLink: "/dashboard/events/new?type=gala",
    secondaryCtaText: "Explorer les modèles Corporate",
    secondaryCtaLink: "/templates?category=gala",
    imageSrc: "/images/hero-gala.jpg",
    imageAlt: "Dîner de gala prestige et awards d'entreprise à Abidjan",
    venue: "CRRAE-UMOA, Abidjan Plateau",
    date: "11 Décembre 2026 • 19:30",
    guestMetric: "320 invités",
    confirmedRate: "91% confirmés",
    confirmedPercent: 91,
    floatingRsvp: {
      guest: "Directrice Générale & Équipe",
      details: "Tech & Banking Awards : Table VIP Décideurs confirmée",
      time: "Il y a 8 min",
    },
    floatingCheckin: {
      venue: "Ballroom CRRAE-UMOA",
      detail: "Badge VIP scanné • Émargement live sans file d'attente",
      scanSpeed: "1.1s",
    },
    featuredTemplate: {
      name: "🏆 Modèle Gala Prestige",
      link: "/dashboard/events/new?template=gala-gold",
    },
  },
];

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [simulatedCheckinToast, setSimulatedCheckinToast] = useState(false);

  const currentSlideRef = useRef(0);
  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  const [studioTheme, setStudioTheme] = useState<"gold" | "wax" | "emerald">("gold");
  const [simulatedRsvpCount, setSimulatedRsvpCount] = useState(188);
  const [simulatedRsvpAdded, setSimulatedRsvpAdded] = useState(false);
  const [simulatedScanSuccess, setSimulatedScanSuccess] = useState(false);

  const [quickPrompt, setQuickPrompt] = useState(
    "Je veux organiser l'anniversaire d'Ange le 26 septembre 2026 à Abidjan avec environ 100 invités."
  );

  const goToSlide = (newIndex: number) => {
    setPrevSlide(currentSlideRef.current);
    setCurrentSlide(newIndex);
    setSlideProgress(0);
  };

  const handleSelectSlide = (idx: number) => {
    if (idx === currentSlideRef.current) return;
    goToSlide(idx);
  };

  const handlePrevSlide = () => {
    const current = currentSlideRef.current;
    const prev = current === 0 ? HERO_SLIDES.length - 1 : current - 1;
    goToSlide(prev);
  };

  const handleNextSlide = () => {
    const current = currentSlideRef.current;
    const next = (current + 1) % HERO_SLIDES.length;
    goToSlide(next);
  };

  // Auto-advance slideshow timer with progress bar
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 40; // 40ms interval for silky smooth progress bar
    const totalDuration = 6000; // 6 seconds per slide
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          const current = currentSlideRef.current;
          const next = (current + 1) % HERO_SLIDES.length;
          setPrevSlide(current);
          setCurrentSlide(next);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused]);

  const faqs = [
    {
      q: "Mes invités ont-ils besoin de télécharger une application ?",
      a: "Non, absolument aucune application à installer ! Vos invités reçoivent un lien sécurisé optimisé pour leur smartphone, accessible directement via WhatsApp ou SMS en un clic.",
    },
    {
      q: "Comment fonctionne le suivi des présences avec WhatsApp ?",
      a: "Vous pouvez générer un message d'invitation personnalisé prêt à l'envoi avec votre lien unique. Dès qu'un invité valide ou décline son RSVP, votre tableau de bord est mis à jour en temps réel.",
    },
    {
      q: "Comment s'effectue le contrôle des entrées avec le QR Code ?",
      a: "Chaque invité confirmé reçoit un QR code unique. Le jour de votre événement, vous ou vos agents de sécurité/accueil scannez simplement le QR code depuis l'appareil photo de n'importe quel smartphone. Le système valide l'entrée et bloque automatiquement tout doublon.",
    },
    {
      q: "Quels sont les moyens de paiement acceptés pour les forfaits payants ?",
      a: "Nous acceptons l'ensemble des moyens de paiement mobiles d'Afrique francophone : Wave, Orange Money, MTN MoMo, Moov Money, ainsi que les cartes bancaires Visa et Mastercard.",
    },
  ];

  return (
    <div className="flex flex-col overflow-hidden">
      {/* 1. CINEMATIC HERO SLIDESHOW (IMMERSIVE, DYNAMIC & CONVIVIAL) */}
      <section
        className="relative min-h-[720px] sm:min-h-[800px] lg:min-h-[860px] w-full flex flex-col justify-between overflow-hidden bg-happy-ink-950 text-white select-none pt-4 pb-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Layer 1: Photographic Background Slides with Ken Burns Zoom & Smooth Fade */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = currentSlide === idx;
            const isPrev = prevSlide === idx && prevSlide !== currentSlide;
            return (
              <div
                key={slide.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-in-out",
                  isActive
                    ? "opacity-100 z-20"
                    : isPrev
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  className={cn(
                    "h-full w-full object-cover object-center transition-transform duration-[10000ms] ease-out",
                    isActive ? "scale-105" : "scale-100"
                  )}
                />
                {/* Subtle cinematic veil: background photos are clearly visible and vibrant */}
                <div className="absolute inset-0 bg-gradient-to-t from-happy-ink-950/85 via-black/35 to-black/45" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.15)_0%,_rgba(8,11,17,0.60)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-happy-ink-950 to-transparent" />
              </div>
            );
          })}
        </div>

        {/* Layer 2: Top Interactive Category Tabs Bar */}
        <div className="relative z-30 pt-4 sm:pt-6 px-4 max-w-4xl mx-auto w-full">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/45 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-2xl">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = currentSlide === idx;
              return (
                <button
                  key={slide.id}
                  onClick={() => handleSelectSlide(idx)}
                  className={cn(
                    "relative px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center overflow-hidden text-center",
                    isActive
                      ? "bg-white text-happy-ink-950 shadow-md font-extrabold"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  <span className="truncate">{slide.categoryTab}</span>
                  {/* Persistent Progress Bar on Tab */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full bg-happy-coral-500 transition-all ease-linear",
                        isActive ? "duration-75" : "duration-200"
                      )}
                      style={{ width: isActive ? `${slideProgress}%` : "0%" }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>



        {/* Layer 3: Main Central Hero Content Stack (Synchronized Crossfade with Zero Layout Shift) */}
        <div className="relative z-20 grid grid-cols-1 grid-rows-1 w-full max-w-4xl mx-auto px-4 my-auto">
          {/* Soft central scrim behind hero card for crisp legibility over clear photos */}
          <div className="absolute inset-0 -inset-x-4 sm:-inset-x-8 -inset-y-6 bg-happy-ink-950/40 rounded-3xl backdrop-blur-[2px] border border-white/10 shadow-2xl pointer-events-none -z-10" />

          {HERO_SLIDES.map((slide, idx) => {
            const isActive = currentSlide === idx;
            return (
              <div
                key={slide.id}
                className={cn(
                  "col-start-1 row-start-1 flex flex-col items-center justify-center text-center py-6 sm:py-8 transition-all duration-700 ease-out",
                  isActive
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto z-10"
                    : "opacity-0 translate-y-4 scale-[0.98] pointer-events-none z-0"
                )}
              >
                {/* Top Pill with live pulsing badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/50 backdrop-blur-md px-4 py-1.5 shadow-xl mb-6">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {slide.pillText}
                  </span>
                </div>

                {/* Main Hero Title — Dynamic & Varied per slide */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.18] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                  {slide.titlePrefix}{" "}
                  <span
                    className={cn(
                      "bg-gradient-to-r bg-clip-text text-transparent underline decoration-white/25 underline-offset-8 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]",
                      slide.titleHighlightGradient
                    )}
                  >
                    {slide.titleHighlight}
                  </span>
                  {slide.titleSuffix && (
                    <>
                      {" "}
                      <span className="text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
                        {slide.titleSuffix}
                      </span>
                    </>
                  )}
                </h1>

                {/* Subtitle with core SaaS value propositions */}
                <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-100 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] font-medium">
                  {slide.subtitle}
                </p>

                {/* Animated CTA Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                  {/* Primary Action Button with Shimmer Light Beam Effect */}
                  <Link href={slide.primaryCtaLink} className="w-full sm:w-auto">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto text-base h-13 px-8 btn-shimmer shadow-glow hover:scale-105 transition-all duration-200 group font-bold bg-gradient-to-r from-happy-coral-500 via-happy-coral-600 to-amber-500 border-none text-white"
                      rightIcon={
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-200" />
                      }
                    >
                      {slide.primaryCtaText}
                    </Button>
                  </Link>

                  {/* Secondary Action: Templates Discovery */}
                  <Link href={slide.secondaryCtaLink} className="w-full sm:w-auto">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto text-base h-13 px-6 bg-white/15 hover:bg-white/25 text-white border-white/25 backdrop-blur-md shadow-xl transition-all duration-200 group"
                      leftIcon={
                        <Sparkles className="h-4 w-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                      }
                    >
                      {slide.secondaryCtaText}
                    </Button>
                  </Link>
                </div>

                {/* Real-time Live Activity Proof Cards (Integrated, Responsive, Zero-Overlap) */}
                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl mx-auto text-left">
                  {/* Card 1: RSVP WhatsApp en direct */}
                  <div className="flex items-center gap-3.5 rounded-2xl bg-slate-900/85 backdrop-blur-xl p-3.5 sm:p-4 shadow-2xl border border-white/20 hover:border-emerald-400/40 transition-all group">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          RSVP WhatsApp en direct
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                        {slide.floatingRsvp.guest}
                      </p>
                      <p className="text-[11px] text-white/70 truncate">
                        {slide.floatingRsvp.details}
                      </p>
                      <span className="text-[9px] text-white/40 block mt-0.5">
                        {slide.floatingRsvp.time}
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Contrôle d'accès QR Code */}
                  <div className="flex items-center gap-3.5 rounded-2xl bg-slate-900/85 backdrop-blur-xl p-3.5 sm:p-4 shadow-2xl border border-white/20 hover:border-amber-400/40 transition-all group">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 shrink-0 border border-amber-500/30 group-hover:scale-105 transition-transform">
                      <Shield className="h-6 w-6 text-happy-coral-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                          Contrôle d'accès QR Code
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                        {slide.floatingCheckin.venue}
                      </p>
                      <p className="text-[11px] text-white/70 truncate">
                        {slide.floatingCheckin.detail} ({slide.floatingCheckin.scanSpeed})
                      </p>
                      <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">
                        ● {slide.guestMetric} • {slide.confirmedRate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Direct Access Tags */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-white/90">
                  <span className="text-white/60">Accès direct :</span>
                  <Link
                    href={slide.featuredTemplate.link}
                    className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 text-white backdrop-blur-md transition-all shadow-xs"
                  >
                    {slide.featuredTemplate.name}
                  </Link>
                  {slide.id !== "anniversaire" ? (
                    <Link
                      href="/dashboard/events/new?template=wax-chic"
                      className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 text-white backdrop-blur-md transition-all shadow-xs"
                    >
                      ✨ Modèle Wax Royal
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard/events/new?template=classic-gold"
                      className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 text-white backdrop-blur-md transition-all shadow-xs"
                    >
                      👑 Modèle Mariage Or
                    </Link>
                  )}
                  <Link
                    href="/pricing"
                    className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 text-white backdrop-blur-md transition-all shadow-xs"
                  >
                    🏷️ Voir les tarifs
                  </Link>
                  <Link
                    href="/e/ange-anniversaire-30"
                    className="rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 px-3 py-1 text-emerald-300 backdrop-blur-md transition-all shadow-xs"
                  >
                    📱 Voir une démo en direct
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Layer 4: Bottom Controls Bar (Prev/Next, Play/Pause, Slide Indicators, Counter) */}
        <div className="relative z-30 pb-2 px-4 max-w-5xl mx-auto w-full flex items-center justify-between text-xs text-white/80">
          {/* Controls: Prev / Next / Pause */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSlide}
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-colors"
              aria-label="Diapositive précédente"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextSlide}
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-colors"
              aria-label="Diapositive suivante"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="h-9 px-3 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center gap-1.5 text-white backdrop-blur-md transition-colors"
              aria-label={isPaused ? "Reprendre le défilement" : "Mettre en pause"}
            >
              {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline text-[11px] font-medium">
                {isPaused ? "Lecture" : "Pause"}
              </span>
            </button>
          </div>

          {/* Slide Indicator Dots & Counter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSlide(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    currentSlide === idx ? "w-6 bg-happy-coral-400" : "w-2 bg-white/40 hover:bg-white/70"
                  )}
                  aria-label={`Aller au slide ${idx + 1}`}
                />
              ))}
            </div>
            <span className="font-mono text-xs font-bold text-white/90">
              0{currentSlide + 1} / 0{HERO_SLIDES.length}
            </span>
          </div>
        </div>
      </section>

      {/* 3. CONTINUOUS ANIMATED STATS MARQUEE TICKER */}
      <section className="bg-happy-ink-950 text-white py-4 overflow-hidden border-y border-happy-ink-800">
        <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-semibold flex items-center gap-10">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            +15 000 Invités accueillis avec succès en Côte d'Ivoire & Afrique de l'Ouest
          </span>
          <span className="text-happy-coral-400">•</span>
          <span className="flex items-center gap-2">
            <QrCode className="h-4 w-4 text-emerald-400" />
            99.8% de QR Codes validés le jour J sans fraude ni doublon
          </span>
          <span className="text-happy-coral-400">•</span>
          <span className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-emerald-400" />
            Conçu pour WhatsApp & 100% optimisé smartphone
          </span>
          <span className="text-happy-coral-400">•</span>
          <span className="flex items-center gap-2">
            <span>💳 Wave, Orange Money, MTN MoMo, Moov Money</span>
          </span>
          <span className="text-happy-coral-400">•</span>
          <span className="flex items-center gap-2">
            ⭐ 4.9/5 satisfaction des hôtes et organisateurs
          </span>
          <span className="text-happy-coral-400">•</span>
          <span className="flex items-center gap-2">
            🇨🇮 Abidjan • 🇸🇳 Dakar • 🇧🇯 Cotonou • 🇹🇬 Lomé • 🇨🇲 Douala
          </span>
        </div>
      </section>

      {/* 4. QUICK MODE — HAPPY AI DEMO (#features) */}
      <section
        id="features"
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-happy-ink-100"
      >
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="vip" className="mb-4">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Création Instantanée • Quick Mode
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-happy-ink-900 font-display">
            Exprimez votre idée naturellement. HAPPY AI s'occupe du reste.
          </h2>
          <p className="mt-3 text-base text-happy-ink-600 max-w-2xl mx-auto">
            Pas de formulaires interminables. Écrivez comme vous parleriez à un wedding planner ou ami organisateur.
          </p>

          {/* Natural Language Box with Quick Chips */}
          <div className="mt-8 rounded-3xl border border-happy-coral-200 bg-happy-sand-50 p-4 sm:p-6 text-left shadow-soft">
            <label className="block text-xs font-bold uppercase tracking-wider text-happy-coral-700 mb-2">
              Votre demande en français courant :
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                className="flex-1 rounded-2xl border border-happy-ink-200 bg-white px-4 py-3 text-sm text-happy-ink-900 font-medium focus:border-happy-coral-500 focus:outline-none focus:ring-2 focus:ring-happy-coral-500/20 shadow-2xs"
              />
              <Link href={`/dashboard/events/new?prompt=${encodeURIComponent(quickPrompt)}`}>
                <Button
                  variant="primary"
                  className="w-full sm:w-auto h-12 px-6 shadow-glow btn-shimmer font-bold"
                  leftIcon={<Sparkles className="h-4 w-4" />}
                >
                  Générer l'événement
                </Button>
              </Link>
            </div>

            {/* Clickable Quick Prompts */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-happy-ink-500 mr-1">
                Exemples rapides :
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuickPrompt(
                    "Mariage d'Ange et Marc le 17 octobre 2026 à Abidjan avec 200 invités, thème Or & Ivoire."
                  )
                }
                className="rounded-lg bg-white border border-happy-sand-200 px-2.5 py-1 text-happy-ink-700 hover:border-happy-coral-300 hover:text-happy-coral-600 transition-colors shadow-2xs"
              >
                💍 Mariage Or & Ivoire
              </button>
              <button
                type="button"
                onClick={() =>
                  setQuickPrompt(
                    "Dot traditionnelle Baoulé le 8 novembre à Cocody avec 150 convives des deux familles."
                  )
                }
                className="rounded-lg bg-white border border-happy-sand-200 px-2.5 py-1 text-happy-ink-700 hover:border-happy-coral-300 hover:text-happy-coral-600 transition-colors shadow-2xs"
              >
                👑 Dot traditionnelle
              </button>
              <button
                type="button"
                onClick={() =>
                  setQuickPrompt(
                    "Cocktail VIP des 10 ans de notre cabinet d'audit au Sofitel Ivoire avec 80 décideurs."
                  )
                }
                className="rounded-lg bg-white border border-happy-sand-200 px-2.5 py-1 text-happy-ink-700 hover:border-happy-coral-300 hover:text-happy-coral-600 transition-colors shadow-2xs"
              >
                🍸 Cocktail Entreprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMMENT ÇA MARCHE (#how-it-works) */}
      <section
        id="how-it-works"
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5] overflow-hidden border-b border-happy-ink-100"
      >
        {/* Subtle decorative ambient glowing orbs */}
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-happy-coral-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[250px] bg-amber-100/35 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-happy-coral-200 bg-happy-coral-50/90 backdrop-blur-md px-4 py-1.5 shadow-xs mb-4">
              <span className="flex h-2 w-2 rounded-full bg-happy-coral-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-happy-coral-600">
                Simplicité absolue
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-happy-ink-900 font-display tracking-tight leading-tight">
              Le cycle complet de votre fête,{" "}
              <span className="bg-gradient-to-r from-happy-coral-500 via-amber-500 to-happy-coral-600 bg-clip-text text-transparent">
                sous contrôle
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-happy-ink-600 max-w-2xl mx-auto leading-relaxed">
              De l'idée initiale jusqu'aux souvenirs du lendemain, chaque étape est fluidifiée. Fini le stress des listes papier éparpillées et des relances manuelles.
            </p>

            {/* Stepper Pipeline Indicators (Connecting flow on desktop) */}
            <div className="hidden lg:flex items-center justify-center gap-3 mt-8 max-w-4xl mx-auto p-2 bg-white/90 backdrop-blur-md rounded-2xl border border-happy-ink-200/80 shadow-soft">
              {[
                { step: "01", label: "Création & Design", dot: "bg-happy-coral-500" },
                { step: "02", label: "Partage WhatsApp", dot: "bg-emerald-500" },
                { step: "03", label: "RSVP en temps réel", dot: "bg-amber-500" },
                { step: "04", label: "Check-in QR fluide", dot: "bg-blue-600" },
              ].map((item, i) => (
                <React.Fragment key={item.step}>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-happy-ink-800 bg-happy-sand-50/80 border border-happy-sand-200/70">
                    <span className={cn("flex h-2 w-2 rounded-full", item.dot)} />
                    <span className="font-mono text-happy-ink-500">{item.step}</span>
                    <span>{item.label}</span>
                  </div>
                  {i < 3 && (
                    <div className="h-0.5 w-6 bg-gradient-to-r from-happy-ink-200 to-happy-ink-300 rounded-full" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 4 Interactive Feature Showcase Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {/* Step 1: Création & Design */}
            <div className="group relative rounded-3xl border border-happy-coral-200/70 bg-white p-6 shadow-soft hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-happy-coral-400 via-amber-400 to-happy-coral-500" />

              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-happy-coral-100 text-happy-coral-600 font-black text-xl shadow-xs group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-happy-coral-50 border border-happy-coral-200/60 text-[11px] font-bold text-happy-coral-700">
                    <Clock className="h-3 w-3" />
                    <span>3 min chrono</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-happy-ink-900 font-display">
                  Création & Design
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-happy-ink-600 leading-relaxed">
                  Générez votre page événement et personnalisez votre carton d'invitation numérique dans le Happy Studio.
                </p>

                {/* HIGH-FIDELITY MICRO-UI MOCKUP: Mini Studio & Invitation Card */}
                <div className="mt-5 rounded-2xl border border-happy-sand-300/80 bg-gradient-to-b from-happy-sand-50/90 to-white p-3.5 shadow-inner">
                  {/* Mini Studio Top Bar */}
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-happy-ink-100 text-[10px] font-bold text-happy-ink-500">
                    <div className="flex items-center gap-1.5 text-happy-coral-600 font-extrabold">
                      <Sparkles className="h-3 w-3" />
                      <span>Happy Studio IA</span>
                    </div>
                    {/* Interactive Color Switcher Dots */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-happy-ink-400 hidden sm:inline">Palette :</span>
                      <button
                        type="button"
                        onClick={() => setStudioTheme("gold")}
                        className={cn(
                          "h-3.5 w-3.5 rounded-full bg-amber-400 ring-2 transition-all",
                          studioTheme === "gold" ? "ring-happy-coral-500 scale-125" : "ring-transparent opacity-70"
                        )}
                        title="Thème Or Impérial"
                      />
                      <button
                        type="button"
                        onClick={() => setStudioTheme("wax")}
                        className={cn(
                          "h-3.5 w-3.5 rounded-full bg-happy-coral-500 ring-2 transition-all",
                          studioTheme === "wax" ? "ring-happy-coral-500 scale-125" : "ring-transparent opacity-70"
                        )}
                        title="Thème Wax Chic"
                      />
                      <button
                        type="button"
                        onClick={() => setStudioTheme("emerald")}
                        className={cn(
                          "h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 transition-all",
                          studioTheme === "emerald" ? "ring-happy-coral-500 scale-125" : "ring-transparent opacity-70"
                        )}
                        title="Thème Émeraude"
                      />
                    </div>
                  </div>

                  {/* Dynamic Invitation Preview Card */}
                  <div
                    className={cn(
                      "rounded-xl p-3 text-center transition-all duration-300 border shadow-xs relative overflow-hidden",
                      studioTheme === "gold"
                        ? "bg-gradient-to-br from-slate-900 to-amber-950 text-amber-100 border-amber-400/40"
                        : studioTheme === "wax"
                        ? "bg-gradient-to-br from-happy-coral-950 to-amber-900 text-white border-happy-coral-400/40"
                        : "bg-gradient-to-br from-slate-950 to-emerald-950 text-emerald-100 border-emerald-400/40"
                    )}
                  >
                    <div className="text-[9px] font-black uppercase tracking-widest text-amber-300/90 mb-0.5">
                      Invitation Privée
                    </div>
                    <div className="text-xs font-extrabold font-display tracking-tight text-white">
                      Aïcha & Marc
                    </div>
                    <div className="text-[10px] text-white/80 mt-0.5 font-medium">
                      17 Octobre • Sofitel Hôtel Ivoire
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-xs px-2 py-0.5 text-[9px] font-semibold text-white">
                      <span>✨ Page Web & Carton WhatsApp prêts</span>
                    </div>
                  </div>
                </div>

                {/* Key Benefits List */}
                <div className="mt-4 space-y-1.5 text-xs text-happy-ink-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-happy-coral-500 shrink-0" />
                    <span>+20 Modèles Africains & Contemporains</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-happy-coral-500 shrink-0" />
                    <span>Génération de textes & programme par IA</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Link */}
              <div className="mt-6 pt-4 border-t border-happy-ink-100">
                <Link
                  href="/dashboard/events/new"
                  className="inline-flex items-center gap-1 text-xs font-bold text-happy-coral-600 hover:text-happy-coral-700 group-hover:translate-x-0.5 transition-all"
                >
                  <span>Créer mon carton en 3 min</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 2: Partage WhatsApp */}
            <div className="group relative rounded-3xl border border-emerald-200/70 bg-white p-6 shadow-soft hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-600" />

              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-black text-xl shadow-xs group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-bold text-emerald-700">
                    <MessageCircle className="h-3 w-3" />
                    <span>En 1 clic</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-happy-ink-900 font-display">
                  Partage WhatsApp
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-happy-ink-600 leading-relaxed">
                  Envoyez vos invitations directement par WhatsApp avec des messages soignés et un lien public unique.
                </p>

                {/* HIGH-FIDELITY MICRO-UI MOCKUP: Realistic WhatsApp Bubble */}
                <div className="mt-5 rounded-2xl border border-emerald-100 bg-[#EFEAE2] p-3 shadow-inner">
                  {/* WhatsApp Header Strip */}
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#075E54]/10 text-[10px]">
                    <div className="flex items-center gap-1.5 font-bold text-[#075E54]">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>WhatsApp • Famille Traoré</span>
                    </div>
                    <span className="text-[9px] text-[#075E54]/70 font-semibold">En ligne</span>
                  </div>

                  {/* WhatsApp Chat Bubble */}
                  <div className="rounded-xl bg-white p-2.5 shadow-xs border border-black/5 text-left">
                    <p className="text-[11px] text-happy-ink-800 leading-snug">
                      Bonjour Tonton Marc ! 👋 Vous êtes chaleureusement invité au Mariage d'Aïcha & Marc.
                    </p>
                    {/* Rich Link Card inside WhatsApp */}
                    <div className="mt-2 rounded-lg bg-emerald-50/70 border border-emerald-200/70 p-2 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-emerald-600 flex items-center justify-center text-white shrink-0 font-bold text-[10px]">
                        💍
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-happy-ink-900 truncate">
                          happy.events/e/aicha-marc
                        </p>
                        <p className="text-[9px] text-emerald-700 font-semibold">
                          Valider ma présence en 10s
                        </p>
                      </div>
                    </div>
                    {/* WhatsApp Bubble Footer with Double Blue Ticks */}
                    <div className="mt-1.5 flex items-center justify-end gap-1 text-[9px] text-happy-ink-400">
                      <span>14:22</span>
                      <CheckCheck className="h-3.5 w-3.5 text-sky-500" />
                    </div>
                  </div>
                </div>

                {/* Key Benefits List */}
                <div className="mt-4 space-y-1.5 text-xs text-happy-ink-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>0 application à installer pour vos convives</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Lien public sécurisé avec aperçu riche</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Link */}
              <div className="mt-6 pt-4 border-t border-happy-ink-100">
                <a
                  href="#whatsapp"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 group-hover:translate-x-0.5 transition-all"
                >
                  <span>Voir la démo WhatsApp</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Step 3: RSVP en temps réel */}
            <div className="group relative rounded-3xl border border-amber-200/70 bg-white p-6 shadow-soft hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 font-black text-xl shadow-xs group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-[11px] font-bold text-amber-700">
                    <Users className="h-3 w-3" />
                    <span>Temps réel</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-happy-ink-900 font-display">
                  RSVP en temps réel
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-happy-ink-600 leading-relaxed">
                  Suivez les confirmations, accompagnants (+1), préférences alimentaires et messages sans relances manuelles.
                </p>

                {/* HIGH-FIDELITY MICRO-UI MOCKUP: Live RSVP Dashboard Widget */}
                <div className="mt-5 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-3 shadow-inner">
                  {/* Gauge header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-happy-ink-500 uppercase tracking-wider">
                      Taux de confirmation
                    </span>
                    <span className="text-xs font-black text-emerald-600">
                      {Math.round((simulatedRsvpCount / 200) * 100)}% ({simulatedRsvpCount}/200)
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full bg-amber-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-500 rounded-full"
                      style={{ width: `${(simulatedRsvpCount / 200) * 100}%` }}
                    />
                  </div>

                  {/* Live RSVP notification pill */}
                  <div className="mt-2.5 rounded-xl bg-white p-2 border border-amber-200/60 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-happy-ink-900">
                          Marc Traoré (+2)
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                        Confirmé
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[9px] text-happy-ink-500">
                      <span>🍗 Poulet braisé • Table 02</span>
                      <span className="text-happy-ink-400">Il y a 2 min</span>
                    </div>
                  </div>

                  {/* Interactive Button to Simulate RSVP */}
                  <button
                    type="button"
                    onClick={() => {
                      setSimulatedRsvpCount((c) => (c < 200 ? c + 1 : 188));
                      setSimulatedRsvpAdded(true);
                      setTimeout(() => setSimulatedRsvpAdded(false), 2000);
                    }}
                    className="mt-2 w-full py-1 text-center text-[10px] font-extrabold text-amber-800 bg-white hover:bg-amber-100/80 border border-amber-200 rounded-lg transition-colors"
                  >
                    {simulatedRsvpAdded ? "🎉 +1 Invité ajouté en direct !" : "⚡ Simuler une confirmation (+1)"}
                  </button>
                </div>

                {/* Key Benefits List */}
                <div className="mt-4 space-y-1.5 text-xs text-happy-ink-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>Relances WhatsApp automatiques et bienveillantes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>Gestion des menus & allergies pour le traiteur</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Link */}
              <div className="mt-6 pt-4 border-t border-happy-ink-100">
                <Link
                  href="/dashboard/guests"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 group-hover:translate-x-0.5 transition-all"
                >
                  <span>Voir le tableau de bord invités</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 4: Check-in QR fluide */}
            <div className="group relative rounded-3xl border border-blue-200/70 bg-white p-6 shadow-soft hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-sky-500" />

              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 font-black text-xl shadow-xs group-hover:scale-110 transition-transform">
                    4
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[11px] font-bold text-blue-700">
                    <ShieldCheck className="h-3 w-3" />
                    <span>0.8s / convive</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-happy-ink-900 font-display">
                  Check-in QR fluide
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-happy-ink-600 leading-relaxed">
                  Scannez les invitations à l'entrée avec votre smartphone. Zéro fraude, zéro doublon, entrée VIP instantanée.
                </p>

                {/* HIGH-FIDELITY MICRO-UI MOCKUP: Holographic QR Pass Ticket with Animated Laser Beam */}
                <div className="mt-5 rounded-2xl border border-blue-100 bg-slate-950 p-3 text-white shadow-inner relative overflow-hidden">
                  {/* Laser Scan Beam */}
                  <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#22d3ee] animate-scan-beam z-10 pointer-events-none" />

                  {/* Ticket Header */}
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/10 text-[9px] font-bold">
                    <span className="text-amber-400 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      HAPPY PASS VIP
                    </span>
                    <span className="font-mono text-white/50">#HP-8892</span>
                  </div>

                  {/* QR Code and Check-in Result */}
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center shadow-xs">
                      <QrCode className="h-full w-full text-slate-950" />
                    </div>
                    <div className="min-w-0">
                      <div className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 border border-emerald-400/40 px-1.5 py-0.5 text-[9px] font-black text-emerald-300">
                        <Check className="h-2.5 w-2.5" />
                        <span>ACCÈS VIP VALIDÉ</span>
                      </div>
                      <p className="text-[10px] font-bold text-white mt-1 truncate">
                        Marc Traoré (+2)
                      </p>
                      <p className="text-[8px] text-white/60">
                        Table 02 • Sofitel Hôtel Ivoire
                      </p>
                    </div>
                  </div>

                  {/* Interactive Button to Simulate Scan */}
                  <button
                    type="button"
                    onClick={() => {
                      setSimulatedScanSuccess(true);
                      setTimeout(() => setSimulatedScanSuccess(false), 2000);
                    }}
                    className="mt-2.5 w-full py-1 text-center text-[10px] font-extrabold text-cyan-300 bg-white/10 hover:bg-white/20 border border-cyan-400/30 rounded-lg transition-colors"
                  >
                    {simulatedScanSuccess ? "⚡ Bip ! QR Code vérifié (0.8s)" : "📱 Simuler un scan d'entrée"}
                  </button>
                </div>

                {/* Key Benefits List */}
                <div className="mt-4 space-y-1.5 text-xs text-happy-ink-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>Zéro fraude • Anti-doublon crypté inviolable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>Fonctionne même avec faible connexion 3G/4G</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Link */}
              <div className="mt-6 pt-4 border-t border-happy-ink-100">
                <Link
                  href="/e/ange-anniversaire-30"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 group-hover:translate-x-0.5 transition-all"
                >
                  <span>Tester le pass en direct</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Callout Banner */}
          <div className="mt-14 rounded-3xl bg-gradient-to-r from-happy-ink-950 via-happy-ink-900 to-happy-ink-950 p-6 sm:p-8 text-white shadow-xl border border-happy-ink-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Prêt à passer au niveau supérieur ?</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold font-display text-white">
                Configurez votre événement en moins de 3 minutes chrono.
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Rejoignez plus de 15 000 organisateurs qui ont dit adieu au stress des listes papier et aux invités égarés.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <Link href="/dashboard/events/new" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto font-bold bg-happy-coral-500 hover:bg-happy-coral-600 shadow-glow text-white border-none"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Créer mon événement
                </Button>
              </Link>
              <Link href="/templates" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto text-white bg-white/10 hover:bg-white/20 border-white/20"
                >
                  Explorer les modèles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DEDICATED WHATSAPP SHOWCASE (#whatsapp) */}
      <section id="whatsapp" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-happy-ink-100">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="whatsapp">
                <MessageCircle className="h-3.5 w-3.5 mr-1" />
                Intégration WhatsApp Native
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-black text-happy-ink-900 font-display leading-tight">
                99% de vos invités sont sur WhatsApp. Touchez-les là où ils sont.
              </h2>
              <p className="text-sm sm:text-base text-happy-ink-600 leading-relaxed">
                Finies les invitations perdues dans les boîtes mail ou les cartons papier égarés. Vos convives reçoivent un carton digital élégant avec un lien direct pour confirmer en 10 secondes.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-happy-ink-700">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Envoi en 1 clic sans télécharger d'application</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Relances automatiques et bienveillantes pour les invités sans réponse</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Mise à jour instantanée de votre tableau de bord dès qu'un invité répond</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/dashboard/events/new">
                  <Button variant="whatsapp" size="lg" className="font-bold shadow-soft">
                    Créer mon invitation WhatsApp
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Chat Simulation Card */}
            <div className="rounded-3xl border border-emerald-200 bg-[#EFEAE2] p-4 sm:p-6 shadow-xl relative">
              <div className="flex items-center gap-3 pb-3 border-b border-emerald-200/60 mb-4 bg-white/70 backdrop-blur-md p-3 rounded-2xl">
                <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  HE
                </div>
                <div>
                  <p className="text-xs font-bold text-happy-ink-900">HAPPY EVENTS • Invitation</p>
                  <p className="text-[10px] text-emerald-700 font-medium">En ligne</p>
                </div>
              </div>

              {/* Chat Message Bubble */}
              <div className="rounded-2xl rounded-tl-none bg-white p-4 shadow-sm text-xs text-happy-ink-800 space-y-2 max-w-[90%]">
                <p className="font-bold text-emerald-800">
                  ✨ Invitation Exclusive — 30 Ans d'Ange
                </p>
                <p className="text-happy-ink-600">
                  Marc et Carine, vous êtes chaleureusement conviés à célébrer ce moment d'exception au Sofitel Hôtel Ivoire !
                </p>
                <div className="p-2.5 rounded-xl bg-happy-sand-100 border border-happy-ink-200/60 text-[11px] font-mono text-happy-coral-600">
                  👉 happyevents.ci/e/ange-anniversaire-30
                </div>
                <div className="flex items-center justify-between text-[10px] text-happy-ink-400 pt-1">
                  <span>14:32</span>
                  <span className="text-blue-500 font-bold">✓✓ Lu</span>
                </div>
              </div>

              {/* Interactive RSVP Action in Chat */}
              <div className="mt-4 rounded-2xl bg-white/95 p-3.5 shadow-md border border-emerald-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-happy-ink-900">Réponse de Marc Konan :</span>
                  <Badge variant="confirmed">Confirmé (+1)</Badge>
                </div>
                <p className="text-[11px] text-emerald-800 mt-1">
                  « Nous serons là avec joie ! Billet QR reçu. »
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DEDICATED QR CHECK-IN SHOWCASE (#checkin) */}
      <section id="checkin" className="py-20 px-4 sm:px-6 lg:px-8 bg-happy-sand-50/70 border-b border-happy-ink-100">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Interactive Scanner Mockup */}
            <div className="rounded-3xl border border-happy-ink-200 bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-happy-ink-100">
                <span className="text-xs font-bold uppercase tracking-wider text-happy-ink-800 flex items-center gap-1.5">
                  <Camera className="h-4 w-4 text-happy-coral-500" />
                  Scanner Mobile HAPPY CHECK-IN
                </span>
                <Badge variant="confirmed">Caméra Active</Badge>
              </div>

              {/* Viewfinder simulation */}
              <div className="relative rounded-2xl bg-happy-ink-950 p-6 flex flex-col items-center justify-center text-center min-h-[220px] overflow-hidden">
                <div className="h-32 w-32 border-2 border-dashed border-emerald-400 rounded-2xl flex items-center justify-center p-2 relative animate-pulse">
                  <QrCode className="h-24 w-24 text-white/90" />
                </div>
                <p className="text-[11px] text-white/80 mt-3 font-mono">
                  Alignez le QR code dans le cadre
                </p>
              </div>

              {/* Scan Trigger Button */}
              <Button
                variant="primary"
                className="w-full text-xs font-bold"
                onClick={() => {
                  setSimulatedCheckinToast(true);
                  setTimeout(() => setSimulatedCheckinToast(false), 3500);
                }}
              >
                Tester un scan en direct (Simulation)
              </Button>

              {simulatedCheckinToast && (
                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs animate-fadeIn flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">Billet Valide : Marc-Antoine Konan (+1)</p>
                    <p className="text-[10px]">Accès Hall Principal & VIP Lounge accordé.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Explanations */}
            <div className="space-y-6">
              <Badge variant="vip">
                <Shield className="h-3.5 w-3.5 mr-1" />
                Sécurité & Anti-Fraude
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-black text-happy-ink-900 font-display leading-tight">
                Contrôlez les entrées avec n'importe quel smartphone. Zéro fraude.
              </h2>
              <p className="text-sm sm:text-base text-happy-ink-600 leading-relaxed">
                Pas besoin de louer de terminaux coûteux. Vous et vos agents de sécurité utilisez simplement vos propres téléphones pour valider les billets numériques en 1.2 seconde.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-happy-ink-700">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Blocage instantané des doublons et billets déjà scannés</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Gestion des agents multiples avec synchronisation en temps réel</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Mode hors-ligne en cas de réseau instable le jour J</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/dashboard/checkin">
                  <Button variant="secondary" size="lg" className="font-bold">
                    Découvrir le scanner d'entrée
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PRICING SECTION (#pricing) */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-happy-coral-600">
              Tarifs clairs & transparents
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-happy-ink-900 font-display">
              Un forfait adapté à chaque type de célébration
            </h2>
            <p className="mt-3 text-sm sm:text-base text-happy-ink-600">
              Paiement unique par événement ou abonnement pour organisateurs réguliers. Compatible Wave, Orange Money et MoMo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Plan 1: Découverte */}
            <div className="rounded-3xl border border-happy-ink-200 bg-white p-7 shadow-soft flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <h3 className="text-xl font-bold text-happy-ink-900 font-display">
                  Découverte
                </h3>
                <p className="text-xs text-happy-ink-500 mt-1">
                  Idéal pour un petit dîner ou baptême intime.
                </p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-black text-happy-ink-900 font-display">
                    Gratuit
                  </span>
                  <span className="text-xs text-happy-ink-400 ml-2">/ événement</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-happy-ink-700">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Jusqu'à 30 invités</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Page publique d'événement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Partage WhatsApp standard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Suivi des réponses RSVP</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Link href="/dashboard/events/new?plan=free">
                  <Button variant="secondary" className="w-full">
                    Commencer gratuitement
                  </Button>
                </Link>
              </div>
            </div>

            {/* Plan 2: Célébration (Recommandé avec pulse glow) */}
            <div className="relative rounded-3xl border-2 border-happy-coral-500 bg-happy-sand-50/70 p-7 shadow-xl flex flex-col justify-between animate-pulse-glow">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-happy-coral-500 px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-soft">
                  Le plus populaire
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-happy-ink-900 font-display">
                  Célébration
                </h3>
                <p className="text-xs text-happy-ink-500 mt-1">
                  Parfait pour anniversaires, mariages et fêtes familiales.
                </p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-black text-happy-ink-900 font-display">
                    15 000 FCFA
                  </span>
                  <span className="text-xs text-happy-ink-400 ml-2">/ événement</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-happy-ink-700">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-happy-coral-600 shrink-0" />
                    <span className="font-semibold">Jusqu'à 250 invités</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-happy-coral-600 shrink-0" />
                    <span>QR Codes uniques anti-fraude</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-happy-coral-600 shrink-0" />
                    <span>Scanner d'entrée pour 3 agents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-happy-coral-600 shrink-0" />
                    <span>Relances WhatsApp assistées</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-happy-coral-600 shrink-0" />
                    <span>Modèles premium Happy Studio</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Link href="/dashboard/events/new?plan=celebration">
                  <Button variant="primary" className="w-full shadow-glow btn-shimmer font-bold">
                    Choisir Célébration
                  </Button>
                </Link>
              </div>
            </div>

            {/* Plan 3: Prestige & Pro */}
            <div className="rounded-3xl border border-amber-300 bg-white p-7 shadow-soft flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-happy-ink-900 font-display">
                    Prestige & Pro
                  </h3>
                  <Badge variant="vip">VIP</Badge>
                </div>
                <p className="text-xs text-happy-ink-500 mt-1">
                  Grands mariages, dots royales, galas et organisateurs.
                </p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-black text-happy-ink-900 font-display">
                    45 000 FCFA
                  </span>
                  <span className="text-xs text-happy-ink-400 ml-2">/ événement</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-happy-ink-700">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span className="font-semibold">Invités illimités</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Agents de check-in illimités</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Placement de tables & groupes VIP</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>HAPPY AI Wedding Planner illimité</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Support dédié WhatsApp 7j/7</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Link href="/dashboard/events/new?plan=prestige">
                  <Button variant="gold" className="w-full font-bold">
                    Choisir Prestige
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ SECTION (#faq) */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-happy-sand-50/70 border-t border-happy-ink-100">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-happy-ink-900 font-display">
              Questions Fréquentes
            </h2>
            <p className="mt-2 text-sm text-happy-ink-500">
              Tout ce que vous devez savoir pour organiser sereinement votre célébration.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-happy-ink-200 bg-white overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-happy-ink-900 hover:text-happy-coral-600"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-happy-coral-500" : "text-happy-ink-400"
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-happy-ink-600 leading-relaxed border-t border-happy-sand-200 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-happy-coral-500 via-happy-coral-600 to-amber-600 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-4xl space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight leading-tight">
            Prêt à transformer l'organisation de votre événement ?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
            Rejoignez les hôtes et familles qui ont dit adieu au stress des listes papier et des relances interminables.
          </p>
          <div className="pt-2">
            <Link href="/dashboard/events/new">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-happy-coral-600 hover:bg-happy-sand-100 shadow-xl text-base px-8 h-14 btn-shimmer font-bold"
              >
                Créer mon premier événement gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
