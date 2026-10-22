"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  User,
  Shield,
  CreditCard,
  Globe,
  Bell,
  CheckCircle2,
  Save,
  QrCode,
  Smartphone,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("CI");
  const [currency, setCurrency] = useState("XOF");
  const [strictQr, setStrictQr] = useState(true);
  const [notifyDuplicates, setNotifyDuplicates] = useState(true);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  React.useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.user) {
          setName(json.data.user.name || "");
          setEmail(json.data.user.email || "");
          setWhatsapp(json.data.user.phone || "");
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: whatsapp,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Erreur lors de l'enregistrement");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur de connexion");
      setTimeout(() => setErrorMsg(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {saved && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-white shadow-xl animate-fadeIn flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="h-4 w-4" />
          <span>Paramètres enregistrés avec succès !</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-rose-600 px-5 py-3 text-white shadow-xl animate-fadeIn flex items-center gap-2 text-xs font-bold">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-happy-ink-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-happy-ink-900 font-display flex items-center gap-3">
            <Settings className="h-7 w-7 text-happy-coral-500" />
            <span>Paramètres & Sécurité</span>
          </h1>
          <p className="text-xs sm:text-sm text-happy-ink-600 mt-1">
            Gérez vos coordonnées organisateur, paramètres WhatsApp, devises et sécurité QR Code.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => handleSave()}
          disabled={isSaving}
          className="shadow-glow"
          leftIcon={<Save className="h-4 w-4" />}
        >
          {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Profil Organisateur */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-happy-coral-500" />
                <span>Profil de l'Organisateur</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nom complet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    label="Adresse Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Input
                  label="Numéro WhatsApp certifié pour les envois"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  helperText="Ce numéro apparaîtra comme expéditeur des cartons numériques et relances."
                />
              </form>
            </CardContent>
          </Card>

          {/* 2. Région & Devise */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-600" />
                <span>Région & Devise</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-happy-ink-700 mb-1.5">
                    Pays principal
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-2xl border border-happy-ink-200 bg-white px-3 py-2 text-xs font-medium text-happy-ink-900 focus:border-happy-coral-500 focus:outline-none"
                  >
                    <option value="CI">🇨🇮 Côte d'Ivoire (+225)</option>
                    <option value="SN">🇸🇳 Sénégal (+221)</option>
                    <option value="BJ">🇧🇯 Bénin (+229)</option>
                    <option value="TG">🇹🇬 Togo (+228)</option>
                    <option value="CM">🇨🇲 Cameroun (+237)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-happy-ink-700 mb-1.5">
                    Devise d'affichage
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-2xl border border-happy-ink-200 bg-white px-3 py-2 text-xs font-medium text-happy-ink-900 focus:border-happy-coral-500 focus:outline-none"
                  >
                    <option value="XOF">FCFA (XOF / XAF)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar ($)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Sécurité QR Code & Entrées */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-happy-coral-500" />
                <span>Sécurité du Contrôle d'Accès QR</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-happy-sand-50 border border-happy-ink-100">
                <div>
                  <p className="font-bold text-happy-ink-900">Blocage strict anti-doublon</p>
                  <p className="text-happy-ink-500 mt-0.5">
                    Un QR code déjà validé est immédiatement signalé en rouge à l'entrée.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={strictQr}
                  onChange={(e) => setStrictQr(e.target.checked)}
                  className="h-4 w-4 rounded border-happy-ink-300 text-happy-coral-500 focus:ring-happy-coral-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-happy-sand-50 border border-happy-ink-100">
                <div>
                  <p className="font-bold text-happy-ink-900">Notification en cas de tentative de fraude</p>
                  <p className="text-happy-ink-500 mt-0.5">
                    Recevez une alerte sonore et visuelle si un invité présente une invitation dupliquée.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyDuplicates}
                  onChange={(e) => setNotifyDuplicates(e.target.checked)}
                  className="h-4 w-4 rounded border-happy-ink-300 text-happy-coral-500 focus:ring-happy-coral-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Payment methods & Pro status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-amber-600" />
                <span>Moyens de Paiement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <p className="text-happy-ink-600">
                Paiements mobiles intégrés et sécurisés pour vos forfaits HAPPY EVENTS.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-happy-ink-200 bg-white">
                  <span className="font-bold text-happy-ink-900">🌊 Wave Mobile Money</span>
                  <Badge variant="confirmed">Connecté</Badge>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-happy-ink-200 bg-white">
                  <span className="font-bold text-happy-ink-900">🟠 Orange Money</span>
                  <Badge variant="confirmed">Connecté</Badge>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-happy-ink-200 bg-white">
                  <span className="font-bold text-happy-ink-900">🟡 MTN Mobile Money</span>
                  <Badge variant="confirmed">Connecté</Badge>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-happy-ink-200 bg-white">
                  <span className="font-bold text-happy-ink-900">💳 Cartes Visa & Mastercard</span>
                  <Badge variant="confirmed">Actif</Badge>
                </div>
              </div>

              <div className="pt-3 border-t border-happy-ink-100">
                <Link href="/pricing">
                  <Button variant="secondary" size="sm" className="w-full text-xs">
                    Gérer mon forfait
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
