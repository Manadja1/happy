"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Eye,
  Check,
  Share2,
  QrCode,
  Calendar,
  MapPin,
  Clock,
  Heart,
  Search,
  Filter,
  Palette,
  Smartphone,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CategoryType =
  | "ALL"
  | "WEDDING"
  | "BIRTHDAY"
  | "BAPTISM"
  | "BABY_SHOWER"
  | "CORPORATE"
  | "GRADUATION";

interface TemplateItem {
  id: string;
  name: string;
  category: CategoryType;
  categoryLabel: string;
  tag?: string;
  description: string;
  palette: { name: string; hex: string }[];
  accentGradient: string;
  bgGradient: string;
  textColor: string;
  borderColor: string;
  badgeVariant: "vip" | "confirmed" | "pending" | "declined" | "whatsapp";
  sampleTitle: string;
  sampleSubtitle: string;
  sampleDate: string;
  sampleLocation: string;
  sampleMessage: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "classic-gold",
    name: "Or Impérial & Ivoire",
    category: "WEDDING",
    categoryLabel: "Mariages & Dots",
    tag: "Le plus populaire",
    description:
      "L'élégance intemporelle pour grands mariages et célébrations raffinées. Cadre doré ciselé et typographie majestueuse.",
    palette: [
      { name: "Or Impérial", hex: "#D97706" },
      { name: "Sable Chaud", hex: "#FAF8F5" },
      { name: "Midnight Slate", hex: "#0F172A" },
    ],
    accentGradient: "from-amber-400 via-amber-500 to-amber-600",
    bgGradient: "from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1]",
    textColor: "text-amber-950",
    borderColor: "border-amber-300",
    badgeVariant: "vip",
    sampleTitle: "Marc & Aminata",
    sampleSubtitle: "Célébration de notre Union Sacrée",
    sampleDate: "Samedi 17 Octobre 2026 • 15:00",
    sampleLocation: "Cathédrale Saint-Paul & Sofitel Ivoire, Abidjan",
    sampleMessage:
      "Deux cœurs, deux familles réunies dans la joie. Nous avons l'immense honneur de vous convier à célébrer notre amour.",
  },
  {
    id: "wax-chic",
    name: "Wax Royal & Kente Moderne",
    category: "WEDDING",
    categoryLabel: "Mariages & Dots",
    tag: "Tradition & Fierté",
    description:
      "Idéal pour dot traditionnelle, fiançailles coutumières et fêtes culturelles. Motifs géométriques aux teintes chaudes d'Afrique.",
    palette: [
      { name: "Terracotta", hex: "#E05A47" },
      { name: "Or Soleil", hex: "#F59E0B" },
      { name: "Bleu Indigo", hex: "#1E3A8A" },
    ],
    accentGradient: "from-happy-coral-500 via-amber-500 to-rose-600",
    bgGradient: "from-rose-50/60 via-amber-50/50 to-orange-50/70",
    textColor: "text-happy-ink-950",
    borderColor: "border-happy-coral-300",
    badgeVariant: "vip",
    sampleTitle: "Koffi & Estelle",
    sampleSubtitle: "Célébration de la Dot Traditionnelle",
    sampleDate: "Dimanche 8 Novembre 2026 • 11:30",
    sampleLocation: "Résidence Les Baobabs, Cocody Ambassades",
    sampleMessage:
      "Dans le respect de nos traditions et la communion de nos lignées, nous vous invitons à sceller notre alliance.",
  },
  {
    id: "midnight-sparkle",
    name: "Midnight Sparkle & Champagne",
    category: "BIRTHDAY",
    categoryLabel: "Anniversaires",
    tag: "Soirée VIP",
    description:
      "Pour anniversaires 30, 40, 50 ans, jubilés et soirées privées haut de gamme. Fond noir profond avec poussière d'étoiles dorées.",
    palette: [
      { name: "Noir Minuit", hex: "#070B14" },
      { name: "Or Champagne", hex: "#FDE68A" },
      { name: "Ambre Vif", hex: "#F59E0B" },
    ],
    accentGradient: "from-amber-300 via-yellow-400 to-amber-500",
    bgGradient: "from-[#0F172A] via-[#1E293B] to-[#090D16]",
    textColor: "text-white",
    borderColor: "border-amber-400/40",
    badgeVariant: "vip",
    sampleTitle: "Ange fête ses 30 ans",
    sampleSubtitle: "Une nuit inoubliable sous les étoiles",
    sampleDate: "Samedi 26 Septembre 2026 • 20:00",
    sampleLocation: "Rooftop Le Palm Club, Abidjan Plateau",
    sampleMessage:
      "30 ans d'aventures, de rires et de souvenirs partagés ! Venez trinquer à ce nouveau chapitre d'une nuit mémorable.",
  },
  {
    id: "tropical-luxury",
    name: "Tropical Chic & Émeraude",
    category: "BIRTHDAY",
    categoryLabel: "Anniversaires",
    tag: "Vibrant",
    description:
      "Ambiance festive exotique, pool party chic ou barbecue lounge. Nuances de vert émeraude, feuilles de monstera et accents or.",
    palette: [
      { name: "Émeraude Profond", hex: "#065F46" },
      { name: "Vert Menthe", hex: "#A7F3D0" },
      { name: "Or Tropical", hex: "#F59E0B" },
    ],
    accentGradient: "from-emerald-500 via-teal-500 to-amber-400",
    bgGradient: "from-emerald-900 via-teal-900 to-slate-900",
    textColor: "text-white",
    borderColor: "border-emerald-400/40",
    badgeVariant: "confirmed",
    sampleTitle: "Sara & Friends • 25 ans",
    sampleSubtitle: "Cocktail Tropical & Sunset Vibes",
    sampleDate: "Samedi 14 Novembre 2026 • 16:30",
    sampleLocation: "Villa Sunset Bay, Assinie Mafia",
    sampleMessage:
      "Piscine, bonne musique, cocktails frais et couchers de soleil. Préparez vos plus beaux sourires !",
  },
  {
    id: "celestial-pure",
    name: "Douceur Céleste & Or Doux",
    category: "BAPTISM",
    categoryLabel: "Baptêmes & Communions",
    tag: "Pureté",
    description:
      "Pour baptêmes, communions et dédicaces d'enfants. Nuances de blanc immaculé, lin chaud, bleu pastel et légers filigranes dorés.",
    palette: [
      { name: "Bleu Céleste", hex: "#93C5FD" },
      { name: "Or Satiné", hex: "#FBBF24" },
      { name: "Lin Chaud", hex: "#FAF8F5" },
    ],
    accentGradient: "from-sky-400 via-blue-400 to-amber-300",
    bgGradient: "from-[#F0F7FF] via-[#F8FAFC] to-[#EFF6FF]",
    textColor: "text-slate-900",
    borderColor: "border-sky-200",
    badgeVariant: "pending",
    sampleTitle: "Baptême de Raphaël",
    sampleSubtitle: "Entrée dans la lumière divine",
    sampleDate: "Dimanche 4 Octobre 2026 • 10:30",
    sampleLocation: "Paroisse Sainte Cécile, Vallon Cocody",
    sampleMessage:
      "Nous bénissons le ciel pour ce précieux trésor. Venez entourer Raphaël de vos bénédictions et prières fraternelles.",
  },
  {
    id: "pastel-romance",
    name: "Pastel Romance & Fleurs Délicates",
    category: "BABY_SHOWER",
    categoryLabel: "Baby Showers",
    tag: "Chaleureux",
    description:
      "Ambiance douce, poudrée et réconfortante pour célébrer l'arrivée imminente de bébé. Rose poudré, pêche douce et écru chaleureux.",
    palette: [
      { name: "Rose Poudré", hex: "#F472B6" },
      { name: "Pêche Douce", hex: "#FDBA74" },
      { name: "Crème Vanille", hex: "#FFFBEB" },
    ],
    accentGradient: "from-rose-400 via-pink-400 to-amber-300",
    bgGradient: "from-pink-50/70 via-rose-50/40 to-amber-50/50",
    textColor: "text-slate-900",
    borderColor: "border-pink-200",
    badgeVariant: "vip",
    sampleTitle: "Baby Shower de Chloé",
    sampleSubtitle: "Un petit prince arrive bientôt",
    sampleDate: "Samedi 21 Novembre 2026 • 15:00",
    sampleLocation: "Salon de Thé Le Jardin Fleuri, Zone 4",
    sampleMessage:
      "Jeux, délices gourmands et cadeaux de bienvenue pour gâter la future maman avant le grand jour.",
  },
  {
    id: "prestige-gala",
    name: "Prestige Gala & Corporate Black",
    category: "CORPORATE",
    categoryLabel: "Gala & Entreprise",
    tag: "Business & Prestige",
    description:
      "Pour dîners de gala annuels, remises de prix et cocktails d'affaires d'envergure. Rigueur typographique et distinction internationale.",
    palette: [
      { name: "Noir Carbone", hex: "#0F172A" },
      { name: "Or Brossé", hex: "#D97706" },
      { name: "Argent Métal", hex: "#E2E8F0" },
    ],
    accentGradient: "from-amber-400 via-amber-500 to-slate-200",
    bgGradient: "from-slate-900 via-slate-800 to-slate-950",
    textColor: "text-white",
    borderColor: "border-amber-400/30",
    badgeVariant: "vip",
    sampleTitle: "Gala Annuel de l'Excellence 2026",
    sampleSubtitle: "Célébration des 10 ans du Groupe",
    sampleDate: "Vendredi 11 Décembre 2026 • 19:30",
    sampleLocation: "Grand Amphithéâtre CRRAE-UMOA, Plateau",
    sampleMessage:
      "Une soirée prestigieuse pour honorer nos partenaires stratégiques, nos collaborateurs et nos réalisations de l'année.",
  },
  {
    id: "academic-success",
    name: "Succès Académique & Lauriers",
    category: "GRADUATION",
    categoryLabel: "Remises de diplômes",
    tag: "Fierté",
    description:
      "Pour fêter les diplômes d'ingénieur, master, doctorat ou baccalauréat. Toque d'académie, lauriers dorés et bleu roi triomphant.",
    palette: [
      { name: "Bleu Roi", hex: "#1D4ED8" },
      { name: "Or Victoire", hex: "#F59E0B" },
      { name: "Blanc Pur", hex: "#FFFFFF" },
    ],
    accentGradient: "from-blue-600 via-indigo-600 to-amber-500",
    bgGradient: "from-blue-50/60 via-indigo-50/40 to-amber-50/30",
    textColor: "text-slate-900",
    borderColor: "border-blue-200",
    badgeVariant: "confirmed",
    sampleTitle: "Félicitations Dr. Yannick !",
    sampleSubtitle: "Soutenance & Réception de Doctorat",
    sampleDate: "Samedi 28 Novembre 2026 • 17:00",
    sampleLocation: "Espace Événementiel Palm Beach, Biétry",
    sampleMessage:
      "Des années de persévérance couronnées de succès ! Venez lever vos verres avec nous pour fêter cet accomplissement.",
  },
];

const CATEGORIES: { id: CategoryType; label: string; count: number }[] = [
  { id: "ALL", label: "Tous les modèles", count: TEMPLATES.length },
  {
    id: "WEDDING",
    label: "Mariages & Dots",
    count: TEMPLATES.filter((t) => t.category === "WEDDING").length,
  },
  {
    id: "BIRTHDAY",
    label: "Anniversaires",
    count: TEMPLATES.filter((t) => t.category === "BIRTHDAY").length,
  },
  {
    id: "BAPTISM",
    label: "Baptêmes",
    count: TEMPLATES.filter((t) => t.category === "BAPTISM").length,
  },
  {
    id: "BABY_SHOWER",
    label: "Baby Showers",
    count: TEMPLATES.filter((t) => t.category === "BABY_SHOWER").length,
  },
  {
    id: "CORPORATE",
    label: "Gala & Entreprise",
    count: TEMPLATES.filter((t) => t.category === "CORPORATE").length,
  },
  {
    id: "GRADUATION",
    label: "Diplômes",
    count: TEMPLATES.filter((t) => t.category === "GRADUATION").length,
  },
];

function TemplatesGalleryContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(
    null
  );

  useEffect(() => {
    if (typeParam) {
      const found = CATEGORIES.find(
        (c) => c.id.toUpperCase() === typeParam.toUpperCase()
      );
      if (found) {
        setSelectedCategory(found.id);
      }
    }
  }, [typeParam]);

  const filteredTemplates = TEMPLATES.filter((item) => {
    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 pt-12 pb-16 sm:px-6 lg:px-8 bg-gradient-to-b from-happy-sand-100 via-[#FAF8F5] to-white border-b border-happy-ink-100">
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-happy-coral-200 bg-white/90 px-4 py-1.5 shadow-soft mb-6">
            <Sparkles className="h-4 w-4 text-happy-coral-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-happy-coral-700">
              HAPPY STUDIO • Modèles Prêts à l'Emploi
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-happy-ink-950 font-display leading-[1.15]">
            Cartons d'invitation numériques{" "}
            <span className="bg-gradient-to-r from-happy-coral-500 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              qui marquent les esprits.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-lg text-happy-ink-600 leading-relaxed">
            Chaque modèle est pensé pour être partagé sur WhatsApp, générer des
            QR codes sécurisés et offrir une expérience mobile luxueuse à vos invités.
          </p>

          {/* Quick Stats / Highlights */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-happy-ink-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Optimisé 100% Smartphone</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>QR Code individuel</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Personnalisable en 3 min</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <section className="sticky top-18 z-30 bg-white/95 backdrop-blur-md border-b border-happy-ink-100 py-3 sm:py-4 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Category Tabs (touch scrollable with edge bleed on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-happy-coral-500 text-white shadow-glow"
                      : "bg-happy-sand-100 text-happy-ink-700 hover:bg-happy-sand-200"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-white text-happy-ink-500"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-happy-ink-400" />
            <input
              type="text"
              placeholder="Rechercher un style, mot-clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-happy-ink-200 bg-happy-sand-50 pl-10 pr-4 py-2 text-xs text-happy-ink-900 placeholder:text-happy-ink-400 focus:border-happy-coral-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-happy-coral-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-happy-ink-400 hover:text-happy-ink-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. TEMPLATES GRID */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        {filteredTemplates.length === 0 ? (
          <div className="rounded-3xl border border-happy-ink-200 bg-white p-12 text-center max-w-md mx-auto my-12">
            <Palette className="mx-auto h-12 w-12 text-happy-ink-300" />
            <h3 className="mt-4 text-base font-bold text-happy-ink-900">
              Aucun modèle trouvé
            </h3>
            <p className="mt-2 text-xs text-happy-ink-500">
              Essayez de modifier votre recherche ou sélectionnez une autre catégorie.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-6"
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchQuery("");
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="group relative rounded-3xl border border-happy-ink-200 bg-white p-5 shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                {/* Visual Card Mockup (Artistic Preview) */}
                <div
                  className={`relative h-64 rounded-2xl p-5 border ${tpl.borderColor} bg-gradient-to-br ${tpl.bgGradient} flex flex-col justify-between overflow-hidden shadow-xs`}
                >
                  {/* Watermark / Subtle overlay pattern */}
                  <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

                  {/* Top Bar inside card preview */}
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-80 font-mono">
                      HAPPY STUDIO
                    </span>
                    {tpl.tag && (
                      <span className="rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-extrabold text-happy-ink-800 shadow-xs">
                        {tpl.tag}
                      </span>
                    )}
                  </div>

                  {/* Center Text inside preview */}
                  <div className="text-center my-auto z-10 space-y-1.5">
                    <h4
                      className={`text-xl font-black font-display tracking-tight ${tpl.textColor}`}
                    >
                      {tpl.sampleTitle}
                    </h4>
                    <p
                      className={`text-[11px] font-medium opacity-85 leading-snug line-clamp-1 ${tpl.textColor}`}
                    >
                      {tpl.sampleSubtitle}
                    </p>
                    <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] font-semibold opacity-80">
                      <Calendar className="h-3 w-3" />
                      <span>{tpl.sampleDate.split("•")[0]}</span>
                    </div>
                  </div>

                  {/* Bottom details inside card preview */}
                  <div className="z-10 flex items-center justify-between border-t border-black/10 pt-3 text-[10px]">
                    <span className="flex items-center gap-1 opacity-75">
                      <QrCode className="h-3 w-3" />
                      <span>QR Anti-doublon</span>
                    </span>
                    <span className="font-bold flex items-center gap-1 text-emerald-600 bg-white/90 px-2 py-0.5 rounded-full shadow-xs">
                      <Check className="h-2.5 w-2.5" />
                      RSVP Actif
                    </span>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-happy-ink-900 font-display">
                      {tpl.name}
                    </h3>
                    <Badge variant={tpl.badgeVariant}>
                      {tpl.categoryLabel}
                    </Badge>
                  </div>

                  <p className="text-xs text-happy-ink-600 leading-relaxed line-clamp-2">
                    {tpl.description}
                  </p>

                  {/* Palette dots */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-happy-ink-400">
                        Teintes :
                      </span>
                      <div className="flex items-center -space-x-1">
                        {tpl.palette.map((color, idx) => (
                          <div
                            key={idx}
                            title={color.name}
                            className="h-4 w-4 rounded-full border-2 border-white shadow-xs"
                            style={{ backgroundColor: color.hex }}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-happy-ink-500">
                      WhatsApp • Story • QR
                    </span>
                  </div>

                  {/* Actions Buttons */}
                  <div className="pt-3 grid grid-cols-2 gap-2 border-t border-happy-ink-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setPreviewTemplate(tpl)}
                      leftIcon={<Eye className="h-3.5 w-3.5" />}
                    >
                      Aperçu
                    </Button>
                    <Link
                      href={`/dashboard/events/new?template=${tpl.id}`}
                      className="w-full"
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full text-xs"
                        rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                      >
                        Utiliser
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. INTERACTIVE SMARTPHONE PREVIEW MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-happy-ink-100 pb-3 sm:pb-4">
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-happy-coral-600">
                  Aperçu Smartphone
                </span>
                <h3 className="text-base sm:text-lg font-black text-happy-ink-900 font-display">
                  {previewTemplate.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="rounded-full p-2 text-happy-ink-400 hover:bg-happy-sand-100 hover:text-happy-ink-700 transition-colors"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: Realistic Smartphone Shell */}
            <div className="my-3 sm:my-4 overflow-y-auto px-1 flex justify-center">
              <div className="w-full max-w-[320px] sm:max-w-sm rounded-[28px] sm:rounded-[32px] border-4 border-happy-ink-800 bg-white shadow-2xl p-3 sm:p-4 relative">
                {/* Speaker pill */}
                <div className="w-14 sm:w-16 h-1 bg-happy-ink-300 rounded-full mx-auto mb-3 sm:mb-4" />

                {/* WhatsApp simulated banner */}
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 mb-4 text-xs text-emerald-900">
                  <Share2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    Prêt pour envoi direct aux invités sur <strong>WhatsApp</strong>
                  </span>
                </div>

                {/* Digital Card Preview Inside Smartphone */}
                <div
                  className={`rounded-2xl p-5 border ${previewTemplate.borderColor} bg-gradient-to-br ${previewTemplate.bgGradient} shadow-md text-center space-y-4`}
                >
                  <Badge variant="vip" className="mx-auto">
                    {previewTemplate.categoryLabel}
                  </Badge>

                  <div className="space-y-1">
                    <h2
                      className={`text-2xl font-black font-display ${previewTemplate.textColor}`}
                    >
                      {previewTemplate.sampleTitle}
                    </h2>
                    <p
                      className={`text-xs font-semibold opacity-85 ${previewTemplate.textColor}`}
                    >
                      {previewTemplate.sampleSubtitle}
                    </p>
                  </div>

                  <p className="text-xs text-happy-ink-700 italic leading-relaxed px-2">
                    « {previewTemplate.sampleMessage} »
                  </p>

                  <div className="rounded-xl bg-white/90 backdrop-blur-xs p-3 text-left space-y-2 text-xs border border-black/5 shadow-xs">
                    <div className="flex items-start gap-2 text-happy-ink-800">
                      <Calendar className="h-4 w-4 text-happy-coral-500 shrink-0 mt-0.5" />
                      <span>{previewTemplate.sampleDate}</span>
                    </div>
                    <div className="flex items-start gap-2 text-happy-ink-800">
                      <MapPin className="h-4 w-4 text-happy-coral-500 shrink-0 mt-0.5" />
                      <span>{previewTemplate.sampleLocation}</span>
                    </div>
                  </div>

                  {/* QR Code Simulation */}
                  <div className="p-3 bg-white rounded-xl border border-happy-ink-100 flex flex-col items-center">
                    <QrCode className="h-16 w-16 text-happy-ink-900" />
                    <span className="text-[10px] font-mono text-happy-ink-400 mt-1">
                      BILLET INDIVIDUEL ANTI-DOUBLON
                    </span>
                  </div>

                  {/* Interactive Button Simulation */}
                  <button className="w-full py-2.5 rounded-xl bg-happy-coral-500 text-white font-bold text-xs shadow-glow">
                    Confirmer ma présence (RSVP)
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-happy-ink-100 pt-4 flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPreviewTemplate(null)}
              >
                Fermer
              </Button>
              <Link
                href={`/dashboard/events/new?template=${previewTemplate.id}`}
                className="flex-1"
              >
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full shadow-glow"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Personnaliser ce modèle
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 5. FOOTER BANNER */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-happy-coral-500 via-happy-coral-600 to-amber-600 text-white text-center mt-auto">
        <div className="mx-auto max-w-3xl space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
            Vous avez un design spécifique ou un faire-part sur mesure ?
          </h3>
          <p className="text-sm text-white/90">
            Notre studio permet d'importer vos propres visuels ou de laisser l'IA
            créer un carton personnalisé selon vos désirs.
          </p>
          <div className="pt-2">
            <Link href="/dashboard/events/new">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-happy-coral-600 hover:bg-happy-sand-100 shadow-xl text-sm"
              >
                Créer un carton sur-mesure
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-happy-coral-500 border-t-transparent" />
            <p className="text-sm font-semibold text-happy-ink-600">
              Chargement des modèles...
            </p>
          </div>
        </div>
      }
    >
      <TemplatesGalleryContent />
    </Suspense>
  );
}
