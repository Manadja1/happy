"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  QrCode,
  Share2,
  Sparkles,
  Plus,
  ExternalLink,
  MessageCircle,
  Calendar,
  MapPin,
  Filter,
  Check,
  Copy,
  Download,
  Wine,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

export default function DashboardOverviewPage() {
  const [activeGuestTab, setActiveGuestTab] = useState("all");
  const [toastMsg, setToastMsg] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [addGuestModalOpen, setAddGuestModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any | null>(null);

  // Form fields for adding guest
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newGroup, setNewGroup] = useState("Amis");
  const [newPlusOne, setNewPlusOne] = useState(0);
  const [newIsVip, setNewIsVip] = useState(false);

  // Mock Active Event Data
  const event = {
    name: "Anniversaire d'Ange — 30 Ans",
    date: "Samedi 26 Septembre 2026",
    time: "19h30 - 04h00",
    venue: "Sofitel Hôtel Ivoire, Salle Chandelier, Abidjan",
    slug: "ange-anniversaire-30",
    status: "PUBLISHED" as const,
  };

  // Mock Guests List (as State)
  const [guests, setGuests] = useState([
    {
      id: "gst_01",
      name: "Marc-Antoine Konan",
      phone: "+225 07 48 19 20 11",
      group: "Famille proche",
      isVip: true,
      status: "CONFIRMED" as const,
      plusOne: 1,
      checkedIn: true,
      time: "Il y a 2h",
    },
    {
      id: "gst_02",
      name: "Aïcha Traoré",
      phone: "+225 05 12 34 56 78",
      group: "Amis d'enfance",
      isVip: false,
      status: "CONFIRMED" as const,
      plusOne: 0,
      checkedIn: true,
      time: "Il y a 3h",
    },
    {
      id: "gst_03",
      name: "Dr. Jean-Yves Touré",
      phone: "+225 01 98 76 54 32",
      group: "Collègues",
      isVip: true,
      status: "CONFIRMED" as const,
      plusOne: 1,
      checkedIn: false,
      time: "Hier",
    },
    {
      id: "gst_04",
      name: "Carine Kouamé",
      phone: "+225 07 65 43 21 00",
      group: "Amis",
      isVip: false,
      status: "PENDING" as const,
      plusOne: 0,
      checkedIn: false,
      time: "Il y a 2 jours",
    },
    {
      id: "gst_05",
      name: "Éric Bamba",
      phone: "+225 05 99 88 77 66",
      group: "Promotion HEC",
      isVip: false,
      status: "DECLINED" as const,
      plusOne: 0,
      checkedIn: false,
      time: "Il y a 3 jours",
    },
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newGuest = {
      id: "gst_" + Date.now(),
      name: newName,
      phone: newPhone || "+225 07 00 00 00",
      group: newGroup,
      isVip: newIsVip,
      status: "PENDING" as const,
      plusOne: Number(newPlusOne),
      checkedIn: false,
      time: "À l'instant",
    };

    setGuests((prev) => [newGuest, ...prev]);
    setNewName("");
    setNewPhone("");
    setNewPlusOne(0);
    setNewIsVip(false);
    setAddGuestModalOpen(false);
    showToast(`Invité "${newGuest.name}" ajouté avec succès !`);
  };

  const [shareUrl, setShareUrl] = useState("https://happyevents.ci/e/ange-anniversaire-30");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/e/${event.slug}`);
    }
  }, [event.slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    showToast("Lien de l'invitation copié dans le presse-papier !");
  };

  const filteredGuests = guests.filter((g) => {
    if (activeGuestTab === "confirmed") return g.status === "CONFIRMED";
    if (activeGuestTab === "pending") return g.status === "PENDING";
    if (activeGuestTab === "checkedin") return g.checkedIn;
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-white shadow-xl animate-fadeIn flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. TOP EVENT BANNER & QUICK ACTIONS */}
      <div className="relative overflow-hidden rounded-3xl border border-happy-coral-100 bg-gradient-to-r from-happy-coral-500 via-happy-coral-600 to-amber-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="vip" className="bg-white/20 text-white border-white/30">
                Événement en direct
              </Badge>
              <Badge variant="confirmed" className="bg-emerald-500/30 text-emerald-100 border-emerald-400/40">
                Publié
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight">
              {event.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {event.date} • {event.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {event.venue}
              </span>
            </div>
          </div>

          {/* Quick Buttons on Banner */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="whatsapp"
              size="md"
              onClick={() => setShareModalOpen(true)}
              className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-soft"
              leftIcon={<MessageCircle className="h-4 w-4 text-emerald-600" />}
            >
              Partager WhatsApp
            </Button>
            <Link href={`/e/${event.slug}`} target="_blank">
              <Button
                variant="secondary"
                size="md"
                className="bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-md"
                rightIcon={<ExternalLink className="h-4 w-4" />}
              >
                Voir la page publique
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Invités"
          value={92}
          description="Sur 100 prévus"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Confirmés (RSVP)"
          value={81}
          description="Taux de réponse 88%"
          trend={{ value: 12, isPositive: true }}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          title="En attente"
          value={8}
          description="Relances programmées"
          icon={<Clock className="h-5 w-5 text-amber-600" />}
        />
        <StatCard
          title="Entrées Check-in"
          value="47 / 81"
          description="58% des invités arrivés"
          icon={<QrCode className="h-5 w-5 text-happy-coral-600" />}
        />
      </div>

      {/* 3. MAIN SECTION: GUEST MANAGEMENT QUICK VIEW & CHECKLIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Guests tracking table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-happy-ink-900 font-display">
                Suivi des Invités & Présences
              </h2>
              <p className="text-xs text-happy-ink-500">
                Liste des réponses et contrôle des accès en temps réel
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setAddGuestModalOpen(true)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Ajouter un invité
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <Tabs
            tabs={[
              { id: "all", label: "Tous", count: guests.length },
              { id: "confirmed", label: "Confirmés", count: guests.filter((g) => g.status === "CONFIRMED").length },
              { id: "pending", label: "En attente", count: guests.filter((g) => g.status === "PENDING").length },
              { id: "checkedin", label: "Arrivés (Check-in)", count: guests.filter((g) => g.checkedIn).length },
            ]}
            activeTab={activeGuestTab}
            onChange={setActiveGuestTab}
          />

          {/* Guests Table / List Card */}
          <Card>
            <div className="divide-y divide-happy-ink-100">
              {filteredGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between p-4 hover:bg-happy-sand-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={guest.name} isVip={guest.isVip} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-happy-ink-900">
                          {guest.name}
                        </span>
                        {guest.plusOne > 0 && (
                          <span className="rounded-md bg-happy-sand-200 px-1.5 py-0.5 text-[10px] font-bold text-happy-ink-700">
                            +{guest.plusOne}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-happy-ink-500 mt-0.5">
                        <span>{guest.phone}</span>
                        <span>•</span>
                        <span>{guest.group}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {guest.checkedIn ? (
                      <Badge variant="confirmed" dot>
                        Arrivé
                      </Badge>
                    ) : guest.status === "CONFIRMED" ? (
                      <Badge variant="confirmed">Confirmé</Badge>
                    ) : guest.status === "PENDING" ? (
                      <Badge variant="pending">En attente</Badge>
                    ) : (
                      <Badge variant="declined">Décliné</Badge>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedGuest(guest)}
                      className="h-8 px-2"
                    >
                      Détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-happy-ink-100 text-center">
              <Link href="/dashboard/guests" className="text-xs font-bold text-happy-coral-600 hover:underline">
                Voir tous les 92 invités et exporter la liste →
              </Link>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Quick Tools & Assistant */}
        <div className="space-y-6">
          {/* Happy AI Assistant & Drinks Calculator Featured Card */}
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50/60 via-white to-happy-sand-50/60 shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-happy-coral-500 text-white shadow-xs">
                    <Wine className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-happy-ink-900">
                      Boissons & Traiteur (IA)
                    </CardTitle>
                    <p className="text-[11px] text-amber-800 font-semibold">
                      Estimation pour 100 invités
                    </p>
                  </div>
                </div>
                <Badge variant="vip">Happy AI</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-white border border-amber-200 shadow-2xs">
                  <p className="text-xs font-black text-amber-950">25 btls</p>
                  <p className="text-[10px] text-amber-700 font-medium">Champagne</p>
                </div>
                <div className="p-2 rounded-xl bg-white border border-rose-200 shadow-2xs">
                  <p className="text-xs font-black text-rose-950">34 btls</p>
                  <p className="text-[10px] text-rose-700 font-medium">Vins fins</p>
                </div>
                <div className="p-2 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                  <p className="text-xs font-black text-emerald-950">800 pcs</p>
                  <p className="text-[10px] text-emerald-700 font-medium">Canapés</p>
                </div>
              </div>

              <Link href="/dashboard/ai" className="block">
                <Button
                  variant="secondary"
                  className="w-full text-xs font-bold border-amber-300 text-amber-950 bg-amber-50/60 hover:bg-amber-100"
                  leftIcon={<Bot className="h-4 w-4 text-amber-600" />}
                >
                  Ouvrir l&apos;Assistant Boissons & Planning →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Check-in scanner card */}
          <Card className="border-emerald-200 bg-emerald-50/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-emerald-950 text-base">
                  Contrôle des Entrées
                </CardTitle>
                <QrCode className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                Utilisez l'appareil photo pour scanner les QR codes sur les cartons d'invitation numériques.
              </p>
              <Link href="/dashboard/checkin" className="block">
                <Button
                  variant="whatsapp"
                  className="w-full text-xs"
                  leftIcon={<QrCode className="h-4 w-4" />}
                >
                  Ouvrir le Scanner QR
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Happy Studio teaser */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">HAPPY STUDIO</CardTitle>
                <Sparkles className="h-5 w-5 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-happy-ink-600">
                Personnalisez les couleurs, le texte, la musique et le design de votre invitation.
              </p>
              <Link href="/dashboard/studio" className="block">
                <Button variant="secondary" className="w-full text-xs">
                  Personnaliser l'invitation
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Checklist V1 preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Checklist & Tâches</CardTitle>
                <Link href="/dashboard/ai" className="text-xs font-bold text-happy-coral-600 hover:underline">
                  Voir tout →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-happy-ink-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="line-through text-happy-ink-400">
                  Réservation salle Sofitel
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-happy-ink-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="line-through text-happy-ink-400">
                  Envoi des premières invitations WhatsApp
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-happy-ink-800">
                <div className="h-4 w-4 rounded-full border-2 border-happy-coral-500 shrink-0" />
                <span className="font-semibold">
                  Valider le menu traiteur (J-15)
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-happy-ink-800">
                <div className="h-4 w-4 rounded-full border-2 border-happy-ink-300 shrink-0" />
                <span>Rappel aux 8 invités sans réponse</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Share WhatsApp Modal */}
      {shareModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setShareModalOpen(false)}
          title="Partager l'invitation sur WhatsApp"
          description="Transmettez le lien public de votre événement pour collecter les RSVP immédiatement."
        >
          <div className="space-y-4 pt-2 text-xs">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 leading-relaxed text-happy-ink-800">
              « Bonjour ! Tu es cordialement invité(e) aux 30 ans d&apos;Ange le 26 Septembre au Sofitel Hôtel Ivoire. Valide ta présence et obtiens ton QR Code d&apos;entrée ici : {shareUrl} »
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={handleCopyLink}
                className="flex-1"
                leftIcon={<Copy className="h-4 w-4" />}
              >
                Copier le lien
              </Button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Tu es invité aux 30 ans d'Ange le 26 Septembre au Sofitel Ivoire ! Valide ton invitation ici : ${shareUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1"
              >
                <Button variant="whatsapp" className="w-full" leftIcon={<MessageCircle className="h-4 w-4" />}>
                  Ouvrir WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Guest Modal */}
      {addGuestModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setAddGuestModalOpen(false)}
          title="Ajouter un invité"
          description="Inscrivez un invité pour suivre son statut et générer son billet d'accès."
        >
          <form onSubmit={handleAddGuest} className="space-y-4 pt-2">
            <Input
              label="Nom & Prénom"
              placeholder="Ex: Mireille Kassi"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <Input
              label="Numéro WhatsApp"
              placeholder="+225 07 00 00 00"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-happy-ink-700 mb-1.5">
                  Groupe
                </label>
                <select
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value)}
                  className="w-full rounded-2xl border border-happy-ink-200 bg-white px-3 py-2 text-xs font-medium text-happy-ink-900 focus:border-happy-coral-500 focus:outline-none"
                >
                  <option value="Famille proche">Famille proche</option>
                  <option value="Amis">Amis</option>
                  <option value="Collègues">Collègues</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-happy-ink-700 mb-1.5">
                  Accompagnant (+1)
                </label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={newPlusOne}
                  onChange={(e) => setNewPlusOne(Number(e.target.value))}
                  className="w-full rounded-2xl border border-happy-ink-200 bg-white px-3 py-2 text-xs font-medium text-happy-ink-900 focus:border-happy-coral-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="modalVipCheck"
                checked={newIsVip}
                onChange={(e) => setNewIsVip(e.target.checked)}
                className="h-4 w-4 rounded border-happy-ink-300 text-happy-coral-500"
              />
              <label htmlFor="modalVipCheck" className="text-xs font-bold text-happy-ink-800">
                Invité VIP
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setAddGuestModalOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" variant="primary">
                Enregistrer
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Guest Details Modal */}
      {selectedGuest && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedGuest(null)}
          title={`Détails : ${selectedGuest.name}`}
        >
          <div className="space-y-4 pt-2 text-xs text-happy-ink-800">
            <div className="p-3 rounded-2xl bg-happy-sand-100 flex items-center justify-between">
              <span className="font-bold text-happy-ink-600">Statut RSVP :</span>
              {selectedGuest.status === "CONFIRMED" ? (
                <Badge variant="confirmed">Confirmé</Badge>
              ) : selectedGuest.status === "PENDING" ? (
                <Badge variant="pending">En attente</Badge>
              ) : (
                <Badge variant="declined">Décliné</Badge>
              )}
            </div>

            <div className="space-y-1.5">
              <p><strong>Téléphone :</strong> {selectedGuest.phone}</p>
              <p><strong>Groupe :</strong> {selectedGuest.group}</p>
              <p><strong>Accompagnant :</strong> +{selectedGuest.plusOne}</p>
              <p><strong>Check-in entrée :</strong> {selectedGuest.checkedIn ? "Validé ✓" : "Non arrivé"}</p>
            </div>

            <div className="pt-3 border-t border-happy-ink-100 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedGuest(null)}>
                Fermer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
