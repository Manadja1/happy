"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Zap,
  Crown,
  Smile,
  QrCode,
  MessageCircle,
  Users,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const plans = [
    {
      id: "free",
      name: "Découverte",
      tagline: "Pour les réunions intimes & petits comités",
      price: "0 FCFA",
      period: "Gratuit à vie",
      highlight: false,
      badge: null,
      features: [
        "Jusqu'à 30 invités",
        "Page publique d'invitation",
        "Partage WhatsApp standard",
        "Suivi des RSVP en temps réel",
        "1 organisateur",
        "Support standard par email",
      ],
      ctaText: "Commencer gratuitement",
      ctaVariant: "secondary" as const,
      href: "/dashboard/events/new",
    },
    {
      id: "celebration",
      name: "Célébration",
      tagline: "Le choix parfait pour anniversaires & mariages",
      price: "15 000 FCFA",
      period: "par événement (paiement unique)",
      highlight: true,
      badge: "Le plus populaire",
      features: [
        "Jusqu'à 250 invités",
        "Tout ce qui est inclus dans Découverte",
        "QR Codes individuels anti-doublon",
        "Scanner d'entrée mobile pour 3 agents",
        "Relances WhatsApp pré-remplies en 1 clic",
        "Modèles premium Happy Studio",
        "Gestion des accompagnants (+1)",
        "Export Excel & PDF pour les traiteurs",
        "Support prioritaire WhatsApp",
      ],
      ctaText: "Choisir Célébration",
      ctaVariant: "primary" as const,
      href: "/dashboard/events/new?plan=celebration",
    },
    {
      id: "prestige",
      name: "Prestige & Pro",
      tagline: "Grands mariages, dots royales & organisateurs",
      price: "45 000 FCFA",
      period: "par événement (paiement unique)",
      highlight: false,
      badge: "Prestige VIP",
      features: [
        "Nombre d'invités illimité",
        "Tout ce qui est inclus dans Célébration",
        "Agents de check-in illimités",
        "Placement de tables & gestion des VIPs",
        "HAPPY AI Wedding Planner illimité",
        "Carton d'invitation personnalisé par un designer",
        "Envoi SMS assisté en cas de besoin",
        "Support dédié WhatsApp 7j/7 & jour J",
      ],
      ctaText: "Choisir Prestige",
      ctaVariant: "gold" as const,
      href: "/dashboard/events/new?plan=prestige",
    },
  ];

  const comparisonRows = [
    { feature: "Nombre d'invités max", free: "30", celebration: "250", prestige: "Illimité" },
    { feature: "Carton numérique WhatsApp", free: "Standard", celebration: "Premium", prestige: "Sur-mesure" },
    { feature: "QR Code sécurisé individuel", free: "—", celebration: "✓", prestige: "✓" },
    { feature: "Agents de check-in (scanner)", free: "—", celebration: "3 agents", prestige: "Illimités" },
    { feature: "Gestion des accompagnants (+1)", free: "—", celebration: "✓", prestige: "✓" },
    { feature: "Plan de table & groupes VIP", free: "—", celebration: "—", prestige: "✓" },
    { feature: "Relances WhatsApp intelligentes", free: "—", celebration: "✓", prestige: "✓" },
    { feature: "Export traiteur (PDF/Excel)", free: "—", celebration: "✓", prestige: "✓" },
    { feature: "Assistant HAPPY AI", free: "Basique", celebration: "Complet", prestige: "Illimité & Prioritaire" },
    { feature: "Assistance le Jour J", free: "—", celebration: "WhatsApp prioritaire", prestige: "Support dédié 7j/7" },
  ];

  const faqs = [
    {
      q: "Le paiement est-il un abonnement ou un paiement unique ?",
      a: "C'est un paiement unique par événement. Vous ne payez que lorsque vous avez besoin d'activer les fonctionnalités premium pour votre fête. Aucun prélèvement récurrent surprise.",
    },
    {
      q: "Comment puis-je payer en Côte d'Ivoire et en Afrique de l'Ouest ?",
      a: "Nous acceptons tous les moyens de paiement locaux les plus populaires : Wave Côte d'Ivoire, Orange Money, MTN MoMo, Moov Money, ainsi que les cartes bancaires internationales (Visa, Mastercard).",
    },
    {
      q: "Puis-je commencer gratuitement et passer à un forfait supérieur plus tard ?",
      a: "Tout à fait ! Vous pouvez créer votre événement en mode Découverte, tester les invitations et passer au forfait Célébration ou Prestige au moment où votre liste d'invités s'agrandit.",
    },
    {
      q: "Combien de temps l'espace de mon événement reste-t-il accessible ?",
      a: "Votre événement reste accessible pendant toute sa préparation et jusqu'à 3 mois après la date de votre événement pour vous permettre de récupérer vos statistiques et souvenirs photos.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* 1. HERO BANNER */}
      <section className="relative px-4 pt-14 pb-16 sm:px-6 lg:px-8 bg-gradient-to-b from-happy-sand-100 via-[#FAF8F5] to-white border-b border-happy-ink-100">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-happy-coral-200 bg-white/90 px-4 py-1.5 shadow-soft mb-6">
            <Sparkles className="h-4 w-4 text-happy-coral-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-happy-coral-700">
              Tarification simple • Sans abonnement caché
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-happy-ink-950 font-display leading-tight">
            Investissez dans la sérénité{" "}
            <span className="bg-gradient-to-r from-happy-coral-500 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              de votre grand jour.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-lg text-happy-ink-600 leading-relaxed">
            Paiement unique par célébration. Compatible avec tous les moyens de paiement
            mobiles en Afrique francophone.
          </p>

          {/* Payment Badges */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-happy-ink-700">
            <span className="rounded-xl border border-happy-ink-200 bg-white px-3 py-1.5 shadow-xs flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-500" /> Wave
            </span>
            <span className="rounded-xl border border-happy-ink-200 bg-white px-3 py-1.5 shadow-xs flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-orange-500" /> Orange Money
            </span>
            <span className="rounded-xl border border-happy-ink-200 bg-white px-3 py-1.5 shadow-xs flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-yellow-400" /> MTN MoMo
            </span>
            <span className="rounded-xl border border-happy-ink-200 bg-white px-3 py-1.5 shadow-xs flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-600" /> Moov Money
            </span>
            <span className="rounded-xl border border-happy-ink-200 bg-white px-3 py-1.5 shadow-xs flex items-center gap-1.5">
              💳 Visa / Mastercard
            </span>
          </div>
        </div>
      </section>

      {/* 2. PRICING CARDS */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                plan.highlight
                  ? "border-2 border-happy-coral-500 bg-happy-sand-50/70 shadow-xl ring-4 ring-happy-coral-500/10"
                  : "border border-happy-ink-200 bg-white shadow-soft hover:shadow-lg"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-happy-coral-500 px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-soft">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-black text-happy-ink-900 font-display">
                    {plan.name}
                  </h3>
                  {plan.id === "prestige" && <Badge variant="vip">VIP</Badge>}
                </div>

                <p className="text-xs text-happy-ink-500 min-h-[32px]">
                  {plan.tagline}
                </p>

                <div className="mt-6 mb-6 pb-6 border-b border-happy-ink-100">
                  <div className="text-3xl sm:text-4xl font-black text-happy-ink-900 font-display">
                    {plan.price}
                  </div>
                  <div className="text-xs text-happy-ink-400 mt-1">
                    {plan.period}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-happy-ink-400">
                    Ce qui est inclus :
                  </p>
                  <ul className="space-y-3 text-xs sm:text-sm text-happy-ink-700">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check
                          className={`h-4 w-4 shrink-0 mt-0.5 ${
                            plan.highlight
                              ? "text-happy-coral-600"
                              : plan.id === "prestige"
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }`}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-happy-ink-100">
                <Link href={plan.href}>
                  <Button
                    variant={plan.ctaVariant}
                    className={`w-full ${
                      plan.highlight ? "shadow-glow text-sm h-11" : ""
                    }`}
                  >
                    {plan.ctaText}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. COMPARISON TABLE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-happy-ink-100">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-happy-ink-900 font-display">
              Tableau comparatif détaillé
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-happy-ink-500">
              Comparez les fonctionnalités pour choisir l'offre qui correspond exactement à vos besoins.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-happy-ink-200 shadow-soft">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-happy-sand-100 text-happy-ink-900 font-bold border-b border-happy-ink-200">
                <tr>
                  <th className="p-4 sm:p-5">Fonctionnalité</th>
                  <th className="p-4 sm:p-5 text-center">Découverte</th>
                  <th className="p-4 sm:p-5 text-center bg-happy-coral-50/50 text-happy-coral-700">
                    Célébration
                  </th>
                  <th className="p-4 sm:p-5 text-center">Prestige & Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-happy-ink-100">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-happy-sand-50/50">
                    <td className="p-4 sm:p-5 font-medium text-happy-ink-800">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 text-center text-happy-ink-600">
                      {row.free}
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-happy-coral-700 bg-happy-coral-50/30">
                      {row.celebration}
                    </td>
                    <td className="p-4 sm:p-5 text-center font-semibold text-amber-700">
                      {row.prestige}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-happy-ink-900 font-display">
            Questions sur la tarification
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-happy-ink-500">
            Une question sur nos tarifs ou modes de règlement ? Nous sommes là pour vous aider.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-happy-ink-200 bg-white overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-happy-ink-900 hover:text-happy-coral-600"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-happy-coral-500" : "text-happy-ink-400"
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-happy-ink-600 leading-relaxed border-t border-happy-sand-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-happy-coral-500 via-happy-coral-600 to-amber-600 text-white text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <h3 className="text-2xl sm:text-4xl font-extrabold font-display">
            Prêt à lancer votre célébration ?
          </h3>
          <p className="text-sm text-white/90">
            Commencez gratuitement dès aujourd'hui. Aucune carte bancaire requise.
          </p>
          <div className="pt-2">
            <Link href="/dashboard/events/new">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-happy-coral-600 hover:bg-happy-sand-100 shadow-xl"
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
