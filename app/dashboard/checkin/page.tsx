"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  QrCode,
  Scan,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  Check,
  ShieldCheck,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ScanRecord {
  id: string;
  name: string;
  ticketCode: string;
  time: string;
  status: "VALID" | "DUPLICATE" | "INVALID";
  group: string;
  plusOne: number;
}

export default function CheckinPage() {
  const [tokenInput, setTokenInput] = useState("");
  const [simulatedScan, setSimulatedScan] = useState<ScanRecord | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [scansList, setScansList] = useState<ScanRecord[]>([
    {
      id: "scan_1",
      name: "Marc-Antoine Konan",
      ticketCode: "tok_ange_konan_01",
      time: "20:15",
      status: "VALID",
      group: "Famille proche",
      plusOne: 1,
    },
    {
      id: "scan_2",
      name: "Aïcha Traoré",
      ticketCode: "tok_ange_traore_02",
      time: "20:45",
      status: "VALID",
      group: "Amis d'enfance",
      plusOne: 0,
    },
  ]);

  const handleValidateToken = async (tokenToTest?: string) => {
    const targetToken = tokenToTest || tokenInput.trim();
    if (!targetToken) return;
    setIsVerifying(true);
    setDuplicateWarning(null);

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrToken: targetToken,
          agentId: "agent_reception_01",
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const guest = json.data.guest;
        const newRecord: ScanRecord = {
          id: "scan_" + Date.now(),
          name: `${guest.firstName} ${guest.lastName}`,
          ticketCode: guest.qrToken,
          time: "À l'instant",
          status: "VALID",
          group: guest.group || "Invités",
          plusOne: guest.plusOneCount || 0,
        };
        setSimulatedScan(newRecord);
        setScansList((prev) => [newRecord, ...prev]);
        setTokenInput("");
      } else {
        const isDuplicate = json.error?.code === "ALREADY_CHECKED_IN" || json.error?.message?.includes("ALREADY");
        if (isDuplicate) {
          const guest = json.guest;
          const dupRecord: ScanRecord = {
            id: "scan_dup_" + Date.now(),
            name: guest ? `${guest.firstName} ${guest.lastName}` : "Billet réutilisé",
            ticketCode: targetToken,
            time: "À l'instant",
            status: "DUPLICATE",
            group: guest?.group || "Doublon",
            plusOne: guest?.plusOneCount || 0,
          };
          setDuplicateWarning(json);
          setScansList((prev) => [dupRecord, ...prev]);
        } else {
          alert(json.error?.message || "QR Code non reconnu dans la base des invités");
        }
      }
    } catch (err: any) {
      alert("Erreur de connexion : " + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSimulateScan = () => {
    handleValidateToken("tok_ange_toure_03");
  };

  return (
    <div className="flex flex-col space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-happy-ink-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-happy-ink-900 font-display flex items-center gap-3">
            <QrCode className="h-7 w-7 text-happy-coral-500" />
            <span>Contrôle des Entrées (QR Check-in)</span>
          </h1>
          <p className="text-xs sm:text-sm text-happy-ink-600 mt-1">
            Scannez les invitations à l'entrée avec votre smartphone ou effectuez une recherche manuelle.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="confirmed" dot>
            Scanner actif (Agent 1)
          </Badge>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSimulateScan}
            className="shadow-glow"
            leftIcon={<Scan className="h-4 w-4" />}
          >
            Simuler un scan QR
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-happy-ink-200 bg-white p-5 shadow-soft">
          <span className="text-xs font-bold text-happy-ink-500 uppercase tracking-wider">
            Total Invités Entrés
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-happy-ink-900 font-display">
              76
            </span>
            <span className="text-xs text-happy-ink-400 font-semibold">
              / 92 confirmés
            </span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-happy-sand-200 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[82%]" />
          </div>
          <span className="text-[11px] text-emerald-700 font-bold mt-2 block">
            82.6% de présence enregistrée
          </span>
        </div>

        <div className="rounded-2xl border border-happy-ink-200 bg-white p-5 shadow-soft">
          <span className="text-xs font-bold text-happy-ink-500 uppercase tracking-wider">
            Vitesse de scan moyenne
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-happy-coral-600 font-display">
              1.2 s
            </span>
            <span className="text-xs text-happy-ink-400">/ invité</span>
          </div>
          <p className="text-[11px] text-happy-ink-500 mt-3">
            Fluidité garantie • Zéro file d'attente à l'entrée
          </p>
        </div>

        <div className="rounded-2xl border border-happy-ink-200 bg-white p-5 shadow-soft">
          <span className="text-xs font-bold text-happy-ink-500 uppercase tracking-wider">
            Tentatives de doublon
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 font-display">
              1
            </span>
            <span className="text-xs text-rose-500 font-semibold">bloquée</span>
          </div>
          <p className="text-[11px] text-happy-ink-500 mt-3">
            Anti-fraude actif : le billet déjà utilisé a été rejeté
          </p>
        </div>
      </div>

      {/* Duplicate Fraud Alert Banner */}
      {duplicateWarning && (
        <div className="rounded-3xl border-2 border-rose-500 bg-rose-50/90 p-6 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-soft">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="declined">ALERTE FRAUDE : DOUBLON REJETÉ</Badge>
                  <span className="text-xs font-mono text-rose-800 font-bold">
                    Billet déjà scanné
                  </span>
                </div>
                <h3 className="text-xl font-black text-rose-950 mt-1">
                  {duplicateWarning.guest ? `${duplicateWarning.guest.firstName} ${duplicateWarning.guest.lastName}` : "Invité déjà entré"}
                </h3>
                <p className="text-xs text-rose-700">
                  {duplicateWarning.error?.message || "Ce QR code a déjà été utilisé pour entrer. Accès refusé."}
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDuplicateWarning(null)}
              className="bg-white text-rose-800 border-rose-200"
            >
              Ignorer l'alerte
            </Button>
          </div>
        </div>
      )}

      {/* Simulated Live Scan Banner (when triggered) */}
      {simulatedScan && (
        <div className="rounded-3xl border-2 border-emerald-500 bg-emerald-50/80 p-6 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-soft">
                <Check className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="confirmed">ENTRÉE VALIDÉE</Badge>
                  <span className="text-xs font-mono text-emerald-800 font-bold">
                    {simulatedScan.ticketCode}
                  </span>
                </div>
                <h3 className="text-xl font-black text-happy-ink-900 mt-1">
                  {simulatedScan.name}
                </h3>
                <p className="text-xs text-emerald-700">
                  Groupe : {simulatedScan.group} • Accompagnants autorisés : +
                  {simulatedScan.plusOne}
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSimulatedScan(null)}
              className="bg-white text-emerald-800"
            >
              Fermer l'alerte
            </Button>
          </div>
        </div>
      )}

      {/* Scan Camera Area & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Camera Viewport Simulation */}
        <div className="lg:col-span-5 rounded-3xl border border-happy-ink-200 bg-white p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-happy-ink-700 flex items-center gap-2">
              <Camera className="h-4 w-4 text-happy-coral-500" />
              Caméra du smartphone
            </span>
            <span className="text-[11px] font-bold text-emerald-600">● En ligne</span>
          </div>

          {/* Camera Frame */}
          <div className="relative h-64 w-full rounded-2xl bg-happy-ink-950 flex flex-col items-center justify-center overflow-hidden border border-happy-ink-800">
            {/* Viewfinder brackets */}
            <div className="relative h-44 w-44 rounded-2xl border-2 border-dashed border-emerald-400/80 flex items-center justify-center">
              <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-emerald-400" />

              {/* Scanning laser line animation */}
              <div className="h-0.5 w-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            </div>

            <p className="text-[11px] text-white/75 mt-4">
              Pointez l'appareil photo vers le QR code invité
            </p>
          </div>

          {/* Manual Token Verification Tool */}
          <div className="space-y-2 pt-2 border-t border-happy-ink-100">
            <label className="block text-xs font-bold text-happy-ink-700">
              Saisie manuelle du token QR code
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: tok_ange_toure_03"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="text-xs"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleValidateToken()}
                disabled={isVerifying || !tokenInput.trim()}
                className="shrink-0"
              >
                {isVerifying ? "..." : "Valider"}
              </Button>
            </div>

            {/* Quick Demo Token Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
              <span className="text-happy-ink-400 font-semibold self-center">Test direct :</span>
              <button
                type="button"
                onClick={() => handleValidateToken("tok_ange_toure_03")}
                className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold hover:bg-emerald-100"
              >
                Dr. Touré (Valide)
              </button>
              <button
                type="button"
                onClick={() => handleValidateToken("tok_ange_konan_01")}
                className="px-2 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-bold hover:bg-rose-100"
              >
                Konan (Doublon)
              </button>
            </div>
          </div>
        </div>

        {/* Recent Scans Table */}
        <div className="lg:col-span-7 rounded-3xl border border-happy-ink-200 bg-white p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-happy-ink-100">
            <h3 className="text-base font-bold text-happy-ink-900 font-display">
              Journal des entrées en temps réel
            </h3>
            <span className="text-xs font-semibold text-happy-ink-500">
              {scansList.length} scans enregistrés
            </span>
          </div>

          <div className="space-y-2.5">
            {scansList.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-happy-ink-100 hover:bg-happy-sand-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold ${
                      scan.status === "VALID"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {scan.status === "VALID" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-happy-ink-900">
                      {scan.name}
                    </h4>
                    <p className="text-[11px] text-happy-ink-500">
                      {scan.group} • {scan.time}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <Badge
                    variant={scan.status === "VALID" ? "confirmed" : "declined"}
                  >
                    {scan.status === "VALID" ? "Entrée validée" : "Doublon bloqué"}
                  </Badge>
                  <p className="text-[10px] font-mono text-happy-ink-400 mt-1">
                    {scan.ticketCode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
