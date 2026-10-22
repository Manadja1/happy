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
  const [activeEventId, setActiveEventId] = useState("evt_30ans_ange");
  const [activeSlug, setActiveSlug] = useState("ange-anniversaire-30");
  const [stats, setStats] = useState({
    totalGuests: 92,
    confirmedGuests: 81,
    pendingGuests: 8,
    declinedGuests: 3,
    totalAttendees: 95,
    checkedInCount: 47,
    responseRate: 88,
    checkinRate: 58,
  });

  const [responses, setResponses] = useState<any[]>([
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
      dietary: "Standard",
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
  ]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const evtId = params.get("eventId") || localStorage.getItem("happy_active_event_id") || "evt_30ans_ange";
      setActiveEventId(evtId);

      // Load real stats
      fetch(`/api/events/${evtId}/stats`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success && json.data) {
            setStats(json.data);
          }
        })
        .catch(() => {});

      // Load guests for responses
      fetch(`/api/guests?eventId=${evtId}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const answered = json.data
              .filter((g: any) => g.rsvpStatus === "CONFIRMED" || g.rsvpStatus === "DECLINED")
              .map((g: any) => ({
                id: g.id,
                name: `${g.firstName} ${g.lastName}`.trim(),
                status: g.rsvpStatus,
                plusOne: g.plusOneCount || 0,
                time: "Récemment",
                dietary: g.dietaryPreference || "Standard",
                message: g.rsvpStatus === "CONFIRMED" ? "Présence confirmée" : "Ne peut pas venir",
              }));
            if (answered.length > 0) {
              setResponses(answered);
            }
          }
        })
        .catch(() => {});

      // Fetch event slug
      fetch(`/api/events/${evtId}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success && json.data?.slug) {
            setActiveSlug(json.data.slug);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleSendReminder = () => {
    setReminderSent(true);
    const origin = typeof window !== "undefined" ? window.location.origin : "https://happyevents.ci";
    const link = `${origin}/e/${activeSlug}`;
    const msg = `Bonjour ! Petit rappel amical : merci de confirmer votre présence sur votre carton d'invitation : ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    setTimeout(() => setReminderSent(false), 4000);
  };

  const recentResponses = responses;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {reminderSent && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-white shadow-xl animate-fadeIn flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="h-4 w-4" />
          <span>Relance WhatsApp ouverte pour les {stats.pendingGuests} invité(s) en attente !</span>
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
            Visualisez les réponses en direct, les régimes alimentaires et l&apos;état des relances WhatsApp.
          </p>
        </div>

        <Button
          variant="whatsapp"
          size="sm"
          onClick={handleSendReminder}
          className="shadow-soft"
          leftIcon={<MessageCircle className="h-4 w-4" />}
        >
          Relancer les {stats.pendingGuests} sans réponse
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Taux de confirmation"
          value={`${stats.responseRate}%`}
          description={`${stats.confirmedGuests} / ${stats.totalGuests} invités`}
          trend={{ value: 14, isPositive: true }}
          icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          title="Confirmés"
          value={stats.confirmedGuests}
          description={`${stats.totalAttendees} personnes attendues`}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          title="En attente"
          value={stats.pendingGuests}
          description="Relances actives"
          icon={<Clock className="h-5 w-5 text-amber-600" />}
        />
        <StatCard
          title="Déclinés"
          value={stats.declinedGuests}
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
