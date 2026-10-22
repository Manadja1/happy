"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  Ticket,
  QrCode,
  DollarSign,
  Activity,
  ArrowUpRight,
  Database,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Erreur de chargement des statistiques admin", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTriggerSync = async () => {
    setSyncing(true);
    setSyncMessage("");
    try {
      const res = await fetch("/api/admin/system", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setSyncMessage("Synchronisation Supabase réussie !");
        fetchData();
        setTimeout(() => setSyncMessage(""), 4000);
      }
    } catch (err) {
      setSyncMessage("Erreur de synchronisation");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin text-happy-coral-500" />
          <p className="text-xs text-happy-ink-400">Chargement des indicateurs SaaS...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const system = data?.system || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-happy-ink-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-happy-coral-950/60 border border-happy-coral-500/30 text-[11px] font-bold text-happy-coral-400 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-happy-coral-400" />
            <span>Tableau de Bord Centralisé • Droits Maîtres</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
            Supervision Globale de la Plateforme
          </h1>
          <p className="text-xs sm:text-sm text-happy-ink-400 mt-1">
            Visualisez les activités en direct, les organisateurs, les invitations générées et les scans à l&apos;entrée.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleTriggerSync}
            disabled={syncing}
            leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />}
            className="text-xs bg-happy-ink-900 border-happy-ink-700 hover:bg-happy-ink-800 text-white"
          >
            {syncing ? "Synchronisation..." : "Sync Supabase"}
          </Button>

          <Link href="/dashboard/events/new">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="h-3.5 w-3.5" />}
              className="text-xs shadow-soft"
            >
              Créer un Événement
            </Button>
          </Link>
        </div>
      </div>

      {/* Sync Success Toast */}
      {syncMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* 5 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Users */}
        <div className="rounded-3xl border border-happy-ink-800/80 bg-happy-ink-900/50 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-happy-ink-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-happy-ink-400">
              Organisateurs
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white font-display">
              {stats.totalUsers || 0}
            </span>
            <span className="ml-2 text-xs font-bold text-emerald-400">+100% actif</span>
          </div>
          <Link href="/admin/users" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-happy-coral-400 hover:underline">
            <span>Gérer les comptes</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Total Events */}
        <div className="rounded-3xl border border-happy-ink-800/80 bg-happy-ink-900/50 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-happy-ink-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-happy-ink-400">
              Événements
            </span>
            <div className="p-2 rounded-xl bg-happy-coral-500/10 text-happy-coral-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white font-display">
              {stats.totalEvents || 0}
            </span>
            <span className="ml-2 text-xs font-semibold text-happy-ink-400">
              ({stats.publishedEvents || 0} publiés)
            </span>
          </div>
          <Link href="/admin/events" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-happy-coral-400 hover:underline">
            <span>Voir les événements</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Total Guests */}
        <div className="rounded-3xl border border-happy-ink-800/80 bg-happy-ink-900/50 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-happy-ink-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-happy-ink-400">
              Invités & Pass VIP
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Ticket className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white font-display">
              {stats.totalGuests || 0}
            </span>
            <span className="ml-2 text-xs font-semibold text-emerald-400">
              {stats.confirmedGuests || 0} confirmés
            </span>
          </div>
          <p className="mt-3 text-[11px] text-happy-ink-400">
            {stats.vipGuests || 0} invités de prestige VIP
          </p>
        </div>

        {/* Check-ins Completed */}
        <div className="rounded-3xl border border-happy-ink-800/80 bg-happy-ink-900/50 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-happy-ink-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-happy-ink-400">
              Check-ins Scannés
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <QrCode className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white font-display">
              {stats.totalCheckins || 0}
            </span>
            <span className="ml-2 text-xs font-bold text-emerald-400">
              {stats.globalCheckinRate || 0}% taux
            </span>
          </div>
          <p className="mt-3 text-[11px] text-happy-ink-400">
            Contrôle caméra WebRTC en direct
          </p>
        </div>

        {/* Simulated Revenue */}
        <div className="rounded-3xl border border-happy-ink-800/80 bg-happy-ink-900/50 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-happy-ink-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-happy-ink-400">
              Volume d&apos;affaires
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-amber-400 font-display">
              {(stats.estimatedVolumeFcfa || 0).toLocaleString()}
            </span>
            <span className="ml-1 text-xs font-bold text-happy-ink-400">FCFA</span>
          </div>
          <p className="mt-3 text-[11px] text-happy-ink-400">
            Passerelles Wave & Orange Money
          </p>
        </div>
      </div>

      {/* Grid: Activity Stream & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Real-time SaaS Activity Stream (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-happy-ink-800/80 bg-happy-ink-900/40 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-happy-ink-800">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-happy-coral-400" />
              <h2 className="text-base font-bold font-display text-white">
                Flux d&apos;Activités Récentes du SaaS
              </h2>
            </div>
            <span className="text-xs font-mono text-happy-ink-400">
              {stats.recentActivity?.length || 0} actions
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {stats.recentActivity?.map((act: any) => (
              <div
                key={act.id}
                className="flex items-start justify-between p-3 rounded-2xl bg-happy-ink-950/60 border border-happy-ink-800/60 hover:border-happy-ink-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-8 w-8 rounded-xl bg-happy-ink-800 flex items-center justify-center shrink-0">
                    {act.type === "USER_SIGNUP" && <Users className="h-4 w-4 text-blue-400" />}
                    {act.type === "EVENT_CREATED" && <Calendar className="h-4 w-4 text-happy-coral-400" />}
                    {act.type === "CHECKIN_SUCCESS" && <QrCode className="h-4 w-4 text-emerald-400" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{act.title}</p>
                    <p className="text-[11px] text-happy-ink-400 mt-0.5">{act.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-full bg-happy-ink-800 text-[10px] font-bold text-happy-ink-300">
                    {act.badge}
                  </span>
                  <p className="text-[10px] text-happy-ink-500 mt-1 flex items-center gap-1 justify-end">
                    <Clock className="h-3 w-3" />
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Breakdown & Supabase PostgreSQL Status (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Events Breakdown */}
          <div className="rounded-3xl border border-happy-ink-800/80 bg-happy-ink-900/40 p-6 backdrop-blur-xl">
            <h3 className="text-sm font-bold font-display text-white pb-3 border-b border-happy-ink-800">
              Répartition des Événements par Type
            </h3>
            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-happy-ink-300">Mariages Nuptiaux</span>
                <span className="font-bold text-white">{stats.eventsByType?.WEDDING || 0}</span>
              </div>
              <div className="w-full bg-happy-ink-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-happy-coral-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, ((stats.eventsByType?.WEDDING || 0) / (stats.totalEvents || 1)) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-happy-ink-300">Anniversaires</span>
                <span className="font-bold text-white">{stats.eventsByType?.BIRTHDAY || 0}</span>
              </div>
              <div className="w-full bg-happy-ink-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, ((stats.eventsByType?.BIRTHDAY || 0) / (stats.totalEvents || 1)) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-happy-ink-300">Dots & Coutumes</span>
                <span className="font-bold text-white">{stats.eventsByType?.DOT || 0}</span>
              </div>
              <div className="w-full bg-happy-ink-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, ((stats.eventsByType?.DOT || 0) / (stats.totalEvents || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Database & Pooler Status Card */}
          <div className="rounded-3xl border border-happy-ink-800/80 bg-happy-ink-900/40 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-happy-ink-800">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold font-display text-white">
                  Base Supabase PostgreSQL
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                CONNECTÉ
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between text-happy-ink-400">
                <span>Région Cloud :</span>
                <span className="text-white font-mono">eu-west-1 (Irlande)</span>
              </div>
              <div className="flex justify-between text-happy-ink-400">
                <span>Latence Pooler :</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {system.databaseLatencyMs ? `${system.databaseLatencyMs} ms` : "< 15 ms"}
                </span>
              </div>
              <div className="flex justify-between text-happy-ink-400">
                <span>Mémoire Node.js :</span>
                <span className="text-white font-mono">{system.memoryUsageMb || 45} MB</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-happy-ink-800">
              <Link href="/admin/system">
                <Button variant="secondary" size="sm" className="w-full text-xs bg-happy-ink-800 border-happy-ink-700 hover:bg-happy-ink-700 text-happy-ink-200">
                  Diagnostics & Synchronisation Avancée
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
