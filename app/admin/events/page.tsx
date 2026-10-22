"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Search,
  ExternalLink,
  MapPin,
  Clock,
  Users,
  QrCode,
  Sparkles,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/admin/events");
      const json = await res.json();
      if (json.success) {
        setEvents(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.venue && e.venue.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.owner && e.owner.name && e.owner.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.owner && e.owner.email && e.owner.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-happy-ink-800">
        <div>
          <h1 className="text-2xl font-black font-display text-white">
            Supervision de Tous les Événements du SaaS
          </h1>
          <p className="text-xs text-happy-ink-400 mt-1">
            Consultez les cérémonies organisées, leurs taux de présence et accédez aux pass publics en direct.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchEvents}
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          className="text-xs bg-happy-ink-900 border-happy-ink-700 text-white self-start sm:self-auto"
        >
          Actualiser
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Rechercher par titre, lieu ou organisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 rounded-2xl border border-happy-ink-800 bg-happy-ink-900/60 pl-10 pr-4 text-xs text-white placeholder:text-happy-ink-500 focus:border-happy-coral-500 focus:outline-none"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-happy-ink-500" />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {["ALL", "PUBLISHED", "DRAFT", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? "bg-happy-coral-500 text-white"
                  : "bg-happy-ink-900 text-happy-ink-400 hover:text-white"
              }`}
            >
              {st === "ALL" ? "Tous" : st === "PUBLISHED" ? "Publiés" : st === "DRAFT" ? "Brouillons" : "Terminés"}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-happy-ink-400">
          Chargement des événements de la plateforme...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center text-xs text-happy-ink-400 rounded-3xl border border-happy-ink-800 bg-happy-ink-900/30">
          Aucun événement trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => {
            const stats = evt.stats || {};
            return (
              <div
                key={evt.id}
                className="rounded-3xl border border-happy-ink-800 bg-happy-ink-900/50 p-5 backdrop-blur-xl flex flex-col justify-between hover:border-happy-ink-700 transition-all group"
              >
                <div>
                  {/* Top Bar: Event Type & Status Badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-happy-ink-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {evt.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        evt.status === "PUBLISHED"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                          : evt.status === "DRAFT"
                          ? "bg-amber-950 text-amber-400 border border-amber-500/30"
                          : "bg-happy-ink-800 text-happy-ink-400"
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>

                  {/* Title & Organizer */}
                  <div className="mt-3">
                    <h3 className="text-base font-bold text-white group-hover:text-happy-coral-400 transition-colors">
                      {evt.name}
                    </h3>
                    <p className="text-xs text-happy-ink-400 mt-1 flex items-center gap-1.5">
                      <span>Organisé par :</span>
                      <strong className="text-happy-ink-200">
                        {evt.owner?.name || evt.owner?.email || "Inconnu"}
                      </strong>
                    </p>
                  </div>

                  {/* Date & Venue */}
                  <div className="mt-4 space-y-1.5 text-xs text-happy-ink-300">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-happy-coral-400 shrink-0" />
                      <span>{new Date(evt.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long" })} • {evt.startTime || "19:00"}</span>
                    </div>
                    {evt.venue && (
                      <div className="flex items-center gap-2 text-happy-ink-400">
                        <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    )}
                  </div>

                  {/* Metrics Pills */}
                  <div className="mt-4 pt-3 border-t border-happy-ink-800/80 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-happy-ink-950/70 p-2 border border-happy-ink-800/60">
                      <p className="text-[10px] text-happy-ink-400 uppercase font-bold">Invités</p>
                      <p className="text-sm font-black text-white">{stats.totalGuests || 0}</p>
                    </div>
                    <div className="rounded-xl bg-happy-ink-950/70 p-2 border border-happy-ink-800/60">
                      <p className="text-[10px] text-emerald-400 uppercase font-bold">Confirmés</p>
                      <p className="text-sm font-black text-emerald-400">{stats.confirmedGuests || 0}</p>
                    </div>
                    <div className="rounded-xl bg-happy-ink-950/70 p-2 border border-happy-ink-800/60">
                      <p className="text-[10px] text-happy-coral-400 uppercase font-bold">Scannés</p>
                      <p className="text-sm font-black text-happy-coral-400">{stats.checkedInCount || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Link to Public Pass */}
                <div className="mt-4 pt-3 border-t border-happy-ink-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-happy-ink-500 font-mono">
                    /{evt.slug}
                  </span>
                  <Link
                    href={`/e/${evt.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-happy-coral-400 hover:text-happy-coral-300"
                  >
                    <span>Pass Public</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
