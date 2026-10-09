"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  MessageCircle,
  TrendingUp,
  PieChart,
  Calendar,
  Sparkles,
  Share2,
  Utensils,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";

export default function RsvpAnalyticsPage() {
  const [reminderSent, setReminderSent] = useState(false);

  const handleSendReminder = () => {
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 4000);
  };

  const recentResponses = [
    {
      id: "resp_1",
      name: "Marc-Antoine Konan",
      status: "CONFIRMED" as const,
      plusOne: 1,
      time: "Il y a 15 minutes",
      dietary: "Sans porc",
      message: "Avec une immense joie d'être parmi vous !",
    },
    {
      id: "resp_2",
      name: "Aïcha Traoré",
      status: "CONFIRMED" as const,
      plusOne: 0,
      time: "Il y a 1 heure",
      dietary: "Aucun",
      message: "Joyeux anniversaire d'avance mon frère !",
    },
    {
      id: "resp_3",
      name: "Éric Bamba",
      status: "DECLINED" as const,
      plusOne: 0,
      time: "Hier",
      dietary: "-",
      message: "En mission à Dakar, de tout cœur avec vous.",
    },
    {
      id: "resp_4",
      name: "Clarisse N'Guessan",
      status: "CONFIRMED" as const,
      plusOne: 1,
      time: "Hier",
      dietary: "Standard",
      message: "Hâte de danser !",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {reminderSent && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-white shadow-xl animate-fadeIn flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="h-4 w-4" />
          <span>Relance WhatsApp envoyée avec succès aux 8 invités en attente !</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-happy-ink-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-happy-ink-900 font-display flex items-center gap-3">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            <span>Suivi Analytique des RSVP</span>
          </h1>
          <p className="text-xs sm:text-sm text-happy-ink-600 mt-1">
            Visualisez les réponses en direct, les régimes alimentaires et l'état des relances WhatsApp.
          </p>
        </div>

        <Button
          variant="whatsapp"
          size="sm"
          onClick={handleSendReminder}
          className="shadow-soft"
          leftIcon={<MessageCircle className="h-4 w-4" />}
        >
          Relancer les 8 sans réponse
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Taux de confirmation"
          value="88%"
          description="81 / 92 invités"
          trend={{ value: 14, isPositive: true }}
          icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          title="Confirmés"
          value="81"
          description="+14 accompagnants (+1)"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          title="En attente"
          value="8"
          description="Relances actives"
          icon={<Clock className="h-5 w-5 text-amber-600" />}
        />
        <StatCard
          title="Déclinés"
          value="3"
          description="Motif renseigné"
          icon={<XCircle className="h-5 w-5 text-rose-500" />}
        />
      </div>

      {/* Grid: Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent RSVP Stream */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Dernières réponses reçues en direct</CardTitle>
                <Badge variant="confirmed" dot>Flux temps réel</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentResponses.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-happy-ink-100 bg-happy-sand-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-happy-ink-900">{item.name}</span>
                        {item.plusOne > 0 && (
                          <span className="rounded-md bg-happy-sand-200 px-1.5 py-0.5 text-[10px] font-bold text-happy-ink-700">
                            +{item.plusOne}
                          </span>
                        )}
                        {item.status === "CONFIRMED" ? (
                          <Badge variant="confirmed">Confirmé</Badge>
                        ) : (
                          <Badge variant="declined">Décliné</Badge>
                        )}
                      </div>
                      <p className="text-xs text-happy-ink-600 italic mt-1">« {item.message} »</p>
                      <div className="flex items-center gap-3 text-[11px] text-happy-ink-400 mt-2">
                        <span>{item.time}</span>
                        <span>•</span>
                        <span>Régime : {item.dietary}</span>
                      </div>
                    </div>

                    <div className="self-end sm:self-center">
                      <Link href="/dashboard/guests">
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          Voir fiche
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Dietary & Groups Breakdown */}
        <div className="space-y-6">
          {/* Dietary preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-happy-coral-500" />
                  <span>Régimes pour le Traiteur</span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-happy-ink-800 mb-1">
                  <span>Standard / Tout mangeur</span>
                  <span>68 (84%)</span>
                </div>
                <div className="h-2 rounded-full bg-happy-sand-200 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[84%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-happy-ink-800 mb-1">
                  <span>Sans Porc</span>
                  <span>9 (11%)</span>
                </div>
                <div className="h-2 rounded-full bg-happy-sand-200 overflow-hidden">
                  <div className="h-full bg-amber-500 w-[11%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-happy-ink-800 mb-1">
                  <span>Végétarien / Végétalien</span>
                  <span>4 (5%)</span>
                </div>
                <div className="h-2 rounded-full bg-happy-sand-200 overflow-hidden">
                  <div className="h-full bg-blue-500 w-[5%]" />
                </div>
              </div>

              <div className="pt-3 border-t border-happy-ink-100">
                <Link href="/dashboard/guests">
                  <Button variant="secondary" size="sm" className="w-full text-xs">
                    Exporter fiche traiteur
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Group Confirmation Ratio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Taux de réponse par groupe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs text-happy-ink-700">
              <div className="flex justify-between items-center p-2 rounded-xl bg-happy-sand-50">
                <span className="font-semibold">Famille proche</span>
                <span className="font-bold text-emerald-700">95% (19/20)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-happy-sand-50">
                <span className="font-semibold">Amis d'enfance</span>
                <span className="font-bold text-emerald-700">92% (35/38)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-happy-sand-50">
                <span className="font-semibold">Collègues</span>
                <span className="font-bold text-amber-700">77% (17/22)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-happy-sand-50">
                <span className="font-semibold">VIP & Partenaires</span>
                <span className="font-bold text-emerald-700">83% (10/12)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
