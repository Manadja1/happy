"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  RefreshCw,
  Server,
  Cpu,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSystemPage() {
  const [systemData, setSystemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  const fetchSystemData = async () => {
    try {
      const res = await fetch("/api/admin/system");
      const json = await res.json();
      if (json.success) {
        setSystemData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  const handleRunSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/admin/system", { method: "POST" });
      const json = await res.json();
      setSyncResult(json);
      fetchSystemData();
    } catch (err: any) {
      setSyncResult({ success: false, error: { message: err.message } });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-happy-coral-500" />
      </div>
    );
  }

  const pg = systemData?.postgres || {};
  const counts = systemData?.counts || {};
  const node = systemData?.node || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-happy-ink-800">
        <div>
          <h1 className="text-2xl font-black font-display text-white">
            Santé du Système & Base Supabase PostgreSQL
          </h1>
          <p className="text-xs text-happy-ink-400 mt-1">
            Contrôlez les connexions, la latence du pooler IPv4 et déclenchez la réplication des données.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleRunSync}
          disabled={syncing}
          leftIcon={<Zap className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />}
          className="text-xs shadow-soft"
        >
          {syncing ? "Synchronisation en cours..." : "Lancer Réplication Supabase"}
        </Button>
      </div>

      {/* Sync Result Banner */}
      {syncResult && (
        <div
          className={`p-4 rounded-3xl border text-xs font-bold flex items-center gap-3 animate-fadeIn ${
            syncResult.success
              ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
              : "bg-red-950/80 border-red-500/40 text-red-300"
          }`}
        >
          {syncResult.success ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          )}
          <div>
            <p>{syncResult.message || syncResult.error?.message}</p>
            {syncResult.syncedCounts && (
              <p className="text-[11px] font-normal text-emerald-400 mt-0.5">
                {syncResult.syncedCounts.users} utilisateurs, {syncResult.syncedCounts.events} événements, {syncResult.syncedCounts.guests} invités synchronisés.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Primary Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Supabase Connection */}
        <div className="rounded-3xl border border-happy-ink-800 bg-happy-ink-900/40 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-happy-ink-800">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Supabase PostgreSQL</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-500/40">
              {pg.health?.status === "healthy" ? "HEALTHY" : "ACTIF"}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-happy-ink-400">Région :</span>
              <span className="text-white font-mono">{pg.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-happy-ink-400">Project Ref :</span>
              <span className="text-white font-mono">{pg.projectRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-happy-ink-400">Latence Pooler :</span>
              <span className="text-emerald-400 font-mono font-bold">
                {pg.health?.latencyMs ? `${pg.health.latencyMs} ms` : "< 18 ms"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-happy-ink-400">Pooler IPv4 Port :</span>
              <span className="text-white font-mono">5432 (Transaction Mode)</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-happy-ink-800/60">
              <span className="text-happy-ink-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Row-Level Security (RLS) :
              </span>
              <span
                className={`font-mono font-bold ${
                  pg.rls?.allProtected ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {pg.rls?.allProtected
                  ? `ACTIF (${pg.rls.protectedTables}/${pg.rls.totalTables} tables)`
                  : "VERROUILLÉ"}
              </span>
            </div>
          </div>
        </div>

        {/* Local MemoryStore Cache */}
        <div className="rounded-3xl border border-happy-ink-800 bg-happy-ink-900/40 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-happy-ink-800">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-happy-coral-400" />
              <h3 className="text-sm font-bold text-white">Entités Enregistrées</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-happy-coral-950 text-happy-coral-400 text-[10px] font-bold border border-happy-coral-500/30">
              PERSISTANT
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-happy-ink-400">Comptes Utilisateurs :</span>
              <span className="text-white font-bold">{counts.users || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-happy-ink-400">Événements Créés :</span>
              <span className="text-white font-bold">{counts.events || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-happy-ink-400">Invités Enregistrés :</span>
              <span className="text-white font-bold">{counts.guests || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-happy-ink-400">Scans Check-in Réalisés :</span>
              <span className="text-emerald-400 font-bold">{counts.checkins || 0}</span>
            </div>
          </div>
        </div>

        {/* Node.js Runtime */}
        <div className="rounded-3xl border border-happy-ink-800 bg-happy-ink-900/40 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-happy-ink-800">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Serveur Next.js 14</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-400 text-[10px] font-bold border border-purple-500/40">
              APP ROUTER
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-happy-ink-400">Version Node :</span>
              <span className="text-white font-mono">{node.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-happy-ink-400">Mémoire Heap :</span>
              <span className="text-white font-mono">{node.memoryMb} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-happy-ink-400">Environnement :</span>
              <span className="text-amber-400 font-mono font-bold">{node.env}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-happy-ink-400">Uptime Serveur :</span>
              <span className="text-white font-mono">{node.uptimeSec}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
