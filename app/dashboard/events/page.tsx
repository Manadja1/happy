"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Sparkles,
  Plus,
  Users,
  CheckCircle2,
  QrCode,
  ExternalLink,
  MoreVertical,
  Clock,
  MapPin,
  Search,
  Share2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventItem {
  id: string;
  name: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  slug: string;
  image: string;
  status: "ACTIVE" | "UPCOMING" | "PAST" | "DRAFT";
  guestsCount: number;
  confirmedCount: number;
  checkinCount: number;
}

const INITIAL_EVENTS: EventItem[] = [
  {
    id: "evt_01",
    name: "Anniversaire d'Ange — 30 Ans",
    type: "Anniversaire VIP",
    date: "Samedi 26 Septembre 2026",
    time: "19h30 - 04h00",
    venue: "Sofitel Hôtel Ivoire, Abidjan",
    slug: "ange-anniversaire-30",
    image: "/images/hero-birthday.jpg",
    status: "ACTIVE",
    guestsCount: 92,
    confirmedCount: 81,
    checkinCount: 47,
  },
  {
    id: "evt_02",
    name: "Mariage Traditionnel & Dot (Koffi & Estelle)",
    type: "Mariage & Dot Coutumière",
    date: "Dimanche 8 Novembre 2026",
    time: "11h30 - 18h00",
    venue: "Résidence Les Baobabs, Cocody",
    slug: "mariage-koffi-estelle",
    image: "/images/hero-tradition.jpg",
    status: "UPCOMING",
    guestsCount: 150,
    confirmedCount: 144,
    checkinCount: 0,
  },
  {
    id: "evt_03",
    name: "Gala Prestige Tech & Banking Awards",
    type: "Gala d'Entreprise",
    date: "Vendredi 11 Décembre 2026",
    time: "19h30 - 23h30",
    venue: "CRRAE-UMOA, Plateau",
    slug: "gala-prestige-awards",
    image: "/images/hero-gala.jpg",
    status: "UPCOMING",
    guestsCount: 320,
    confirmedCount: 291,
    checkinCount: 0,
  },
  {
    id: "evt_04",
    name: "Mariage Marc & Aminata",
    type: "Mariage Royal",
    date: "Samedi 17 Octobre 2026",
    time: "15h00 - 02h00",
    venue: "Sofitel Hôtel Ivoire, Abidjan",
    slug: "mariage-marc-aminata",
    image: "/images/hero-wedding.jpg",
    status: "DRAFT",
    guestsCount: 188,
    confirmedCount: 176,
    checkinCount: 0,
  },
];

export default function EventsListPage() {
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "UPCOMING" | "PAST">("ALL");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const apiEvents: EventItem[] = json.data.map((e: any) => {
            const formattedDate = e.date
              ? new Date(e.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Date à venir";

            const typeLabel =
              e.type === "WEDDING"
                ? "Mariage Royal"
                : e.type === "BIRTHDAY"
                ? "Anniversaire VIP"
                : e.type === "DOT"
                ? "Dot Coutumière"
                : e.type === "CORPORATE"
                ? "Gala d'Entreprise"
                : "Célébration";

            const defaultImg =
              e.type === "WEDDING"
                ? "/images/hero-wedding.jpg"
                : e.type === "DOT"
                ? "/images/hero-tradition.jpg"
                : e.type === "CORPORATE"
                ? "/images/hero-gala.jpg"
                : "/images/hero-birthday.jpg";

            return {
              id: e.id,
              name: e.name,
              type: typeLabel,
              date: formattedDate,
              time: e.startTime ? `${e.startTime} - ${e.endTime || "Tard"}` : "19h30 - 04h00",
              venue: e.venue || "Abidjan, Côte d'Ivoire",
              slug: e.slug,
              image: e.coverImage || defaultImg,
              status: e.status === "PUBLISHED" ? "ACTIVE" : e.status === "DRAFT" ? "DRAFT" : "UPCOMING",
              guestsCount: e.stats?.totalGuests ?? 0,
              confirmedCount: e.stats?.confirmedGuests ?? 0,
              checkinCount: e.stats?.checkedInCount ?? 0,
            };
          });

          // Merge with INITIAL_EVENTS for sample presentation if user has few events
          const existingIds = new Set(apiEvents.map((a) => a.slug));
          const complementary = INITIAL_EVENTS.filter((init) => !existingIds.has(init.slug));
          setEvents([...apiEvents, ...complementary]);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filteredEvents = events.filter((evt) => {
    const matchesFilter =
      filter === "ALL"
        ? true
        : filter === "ACTIVE"
        ? evt.status === "ACTIVE"
        : filter === "UPCOMING"
        ? evt.status === "UPCOMING" || evt.status === "DRAFT"
        : evt.status === "PAST";
    const matchesSearch =
      evt.name.toLowerCase().includes(search.toLowerCase()) ||
      evt.venue.toLowerCase().includes(search.toLowerCase()) ||
      evt.type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-happy-ink-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-happy-ink-900 font-display flex items-center gap-3">
            <Calendar className="h-7 w-7 text-happy-coral-500" />
            <span>Mes Événements</span>
          </h1>
          <p className="text-xs sm:text-sm text-happy-ink-600 mt-1">
            Gérez tous vos événements en cours, passés et en préparation depuis un seul endroit.
          </p>
        </div>

        <Link href="/dashboard/events/new">
          <Button
            variant="primary"
            className="shadow-glow"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Créer un événement
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex rounded-2xl bg-happy-sand-100 p-1 w-full sm:w-auto">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              filter === "ALL"
                ? "bg-white text-happy-ink-900 shadow-xs"
                : "text-happy-ink-600 hover:text-happy-ink-900"
            }`}
          >
            Tous ({INITIAL_EVENTS.length})
          </button>
          <button
            onClick={() => setFilter("ACTIVE")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              filter === "ACTIVE"
                ? "bg-white text-happy-coral-600 shadow-xs"
                : "text-happy-ink-600 hover:text-happy-ink-900"
            }`}
          >
            En direct (1)
          </button>
          <button
            onClick={() => setFilter("UPCOMING")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              filter === "UPCOMING"
                ? "bg-white text-amber-700 shadow-xs"
                : "text-happy-ink-600 hover:text-happy-ink-900"
            }`}
          >
            À venir ({INITIAL_EVENTS.filter((e) => e.status !== "ACTIVE" && e.status !== "PAST").length})
          </button>
          <button
            onClick={() => setFilter("PAST")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              filter === "PAST"
                ? "bg-white text-happy-ink-900 shadow-xs"
                : "text-happy-ink-600 hover:text-happy-ink-900"
            }`}
          >
            Terminés (0)
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-happy-ink-400" />
          <input
            type="text"
            placeholder="Rechercher un événement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-happy-ink-200 bg-white pl-10 pr-4 py-2 text-xs text-happy-ink-900 placeholder-happy-ink-400 focus:border-happy-coral-500 focus:outline-none focus:ring-2 focus:ring-happy-coral-500/20"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((evt) => {
          const confirmationPercent = Math.round((evt.confirmedCount / evt.guestsCount) * 100);

          return (
            <Card
              key={evt.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Event Cover Photo Header */}
                <div className="relative h-44 w-full overflow-hidden bg-happy-ink-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={evt.image}
                    alt={evt.name}
                    className="h-full w-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-happy-ink-950 via-happy-ink-950/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <Badge variant={evt.status === "ACTIVE" ? "vip" : "confirmed"}>
                      {evt.type}
                    </Badge>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md ${
                        evt.status === "ACTIVE"
                          ? "bg-emerald-500 text-white shadow-soft"
                          : evt.status === "UPCOMING"
                          ? "bg-amber-500/90 text-white"
                          : "bg-white/80 text-happy-ink-800"
                      }`}
                    >
                      {evt.status === "ACTIVE"
                        ? "● En cours"
                        : evt.status === "UPCOMING"
                        ? "À venir"
                        : "Brouillon"}
                    </span>
                  </div>

                  {/* Event Title on Photo */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h2 className="text-xl font-black font-display tracking-tight text-white drop-shadow-md">
                      {evt.name}
                    </h2>
                  </div>
                </div>

                {/* Details Section */}
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-1.5 text-xs text-happy-ink-600">
                    <p className="flex items-center gap-2 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-happy-coral-500 shrink-0" />
                      <span>{evt.date} • {evt.time}</span>
                    </p>
                    <p className="flex items-center gap-2 text-happy-ink-500">
                      <MapPin className="h-3.5 w-3.5 text-happy-coral-500 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </p>
                  </div>

                  {/* Stats Bar */}
                  <div className="rounded-2xl bg-happy-sand-50 p-3.5 border border-happy-sand-200">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-happy-ink-800 flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-happy-ink-500" />
                        {evt.confirmedCount} / {evt.guestsCount} Confirmés
                      </span>
                      <span className="text-emerald-700 font-extrabold">
                        {confirmationPercent}%
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-happy-ink-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${confirmationPercent}%` }}
                      />
                    </div>
                    {evt.status === "ACTIVE" && (
                      <p className="mt-2 text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                        <QrCode className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{evt.checkinCount} entrées scannées à ce jour</span>
                      </p>
                    )}
                  </div>
                </CardContent>
              </div>

              {/* Action Buttons Bar */}
              <div className="px-5 pb-5 pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-happy-ink-100">
                <div className="flex items-center gap-2">
                  <Link href={`/e/${evt.slug}`} target="_blank">
                    <Button variant="ghost" size="sm" className="h-8 text-xs px-2.5">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Page publique
                    </Button>
                  </Link>
                  <Link href="/dashboard/studio">
                    <Button variant="secondary" size="sm" className="h-8 text-xs px-2.5">
                      Studio
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <Link href="/dashboard/guests">
                    <Button variant="primary" size="sm" className="h-8 text-xs px-3">
                      Invités & RSVP
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
