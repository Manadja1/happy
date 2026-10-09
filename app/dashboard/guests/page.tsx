"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Download,
  MessageCircle,
  CheckCircle2,
  Clock,
  QrCode,
  Sparkles,
  Phone,
  UserCheck,
  UserX,
  X,
  Share2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

interface Guest {
  id: string;
  name: string;
  phone: string;
  group: string;
  isVip: boolean;
  status: "CONFIRMED" | "PENDING" | "DECLINED";
  plusOne: number;
  checkedIn: boolean;
  dietary?: string;
  confirmedAt?: string;
}

const INITIAL_GUESTS: Guest[] = [
  {
    id: "gst_01",
    name: "Marc-Antoine Konan",
    phone: "+225 07 48 19 20 11",
    group: "Famille proche",
    isVip: true,
    status: "CONFIRMED",
    plusOne: 1,
    checkedIn: true,
    dietary: "Sans porc",
    confirmedAt: "Il y a 2h",
  },
  {
    id: "gst_02",
    name: "Aïcha Traoré",
    phone: "+225 05 12 34 56 78",
    group: "Amis d'enfance",
    isVip: false,
    status: "CONFIRMED",
    plusOne: 0,
    checkedIn: true,
    confirmedAt: "Il y a 3h",
  },
  {
    id: "gst_03",
    name: "Dr. Jean-Yves Touré",
    phone: "+225 01 98 76 54 32",
    group: "Collègues",
    isVip: true,
    status: "CONFIRMED",
    plusOne: 1,
    checkedIn: false,
    dietary: "Végétarien",
    confirmedAt: "Hier",
  },
  {
    id: "gst_04",
    name: "Carine Kouamé",
    phone: "+225 07 65 43 21 00",
    group: "Amis",
    isVip: false,
    status: "PENDING",
    plusOne: 0,
    checkedIn: false,
  },
  {
    id: "gst_05",
    name: "Éric Bamba",
    phone: "+225 05 99 88 77 66",
    group: "Promotion HEC",
    isVip: false,
    status: "DECLINED",
    plusOne: 0,
    checkedIn: false,
  },
  {
    id: "gst_06",
    name: "Clarisse & Patrick N'Guessan",
    phone: "+225 07 11 22 33 44",
    group: "VIP & Famille",
    isVip: true,
    status: "CONFIRMED",
    plusOne: 1,
    checkedIn: true,
    confirmedAt: "Il y a 1 jour",
  },
  {
    id: "gst_07",
    name: "Christian Bédié",
    phone: "+225 05 44 33 22 11",
    group: "Amis",
    isVip: false,
    status: "CONFIRMED",
    plusOne: 0,
    checkedIn: false,
    confirmedAt: "Il y a 2 jours",
  },
  {
    id: "gst_08",
    name: "Sarah Diop",
    phone: "+225 07 88 99 00 11",
    group: "Collègues",
    isVip: false,
    status: "CONFIRMED",
    plusOne: 1,
    checkedIn: true,
    confirmedAt: "Il y a 3 jours",
  },
  {
    id: "gst_09",
    name: "Ibrahim Cissé",
    phone: "+225 01 23 45 67 89",
    group: "Partenaires",
    isVip: true,
    status: "PENDING",
    plusOne: 1,
    checkedIn: false,
  },
  {
    id: "gst_10",
    name: "Grace & Franck Yao",
    phone: "+225 07 77 66 55 44",
    group: "Famille proche",
    isVip: false,
    status: "CONFIRMED",
    plusOne: 1,
    checkedIn: false,
    confirmedAt: "Il y a 4 jours",
  },
];

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "CONFIRMED" | "PENDING" | "CHECKEDIN" | "VIP">("ALL");

  // Modal State for Adding Guest
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newGroup, setNewGroup] = useState("Amis");
  const [newPlusOne, setNewPlusOne] = useState(0);
  const [newIsVip, setNewIsVip] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");

  // Modal State for Guest Details
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [eventLink, setEventLink] = useState("https://happyevents.ci/e/ange-anniversaire-30");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setEventLink(`${window.location.origin}/e/ange-anniversaire-30`);
    }
  }, []);

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const createdGuest: Guest = {
      id: "gst_" + Date.now(),
      name: newName,
      phone: newPhone || "+225 -- -- -- --",
      group: newGroup,
      isVip: newIsVip,
      status: "PENDING",
      plusOne: Number(newPlusOne),
      checkedIn: false,
    };

    setGuests([createdGuest, ...guests]);
    setNewName("");
    setNewPhone("");
    setNewPlusOne(0);
    setNewIsVip(false);
    setAddModalOpen(false);

    setNotificationMsg(`Invité "${createdGuest.name}" ajouté avec succès !`);
    setTimeout(() => setNotificationMsg(""), 3500);
  };

  const handleExportCSV = () => {
    const headers = "Nom,Telephone,Groupe,VIP,Statut,Accompagnant,Arrive_Checkin\n";
    const rows = guests
      .map(
        (g) =>
          `"${g.name}","${g.phone}","${g.group}","${g.isVip ? "Oui" : "Non"}","${g.status}","+${g.plusOne}","${
            g.checkedIn ? "Oui" : "Non"
          }"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `happy-events-invites-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotificationMsg("Fichier CSV des invités exporté avec succès !");
    setTimeout(() => setNotificationMsg(""), 3500);
  };

  const toggleCheckIn = (id: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, checkedIn: !g.checkedIn } : g))
    );
  };

  const filteredGuests = guests.filter((g) => {
    const matchesTab =
      activeTab === "ALL"
        ? true
        : activeTab === "CONFIRMED"
        ? g.status === "CONFIRMED"
        : activeTab === "PENDING"
        ? g.status === "PENDING"
        : activeTab === "CHECKEDIN"
        ? g.checkedIn
        : g.isVip;

    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.phone.includes(search) ||
      g.group.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const totalConfirmed = guests.filter((g) => g.status === "CONFIRMED").length;
  const totalPending = guests.filter((g) => g.status === "PENDING").length;
  const totalCheckedIn = guests.filter((g) => g.checkedIn).length;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-white shadow-xl animate-fadeIn flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="h-4 w-4" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-happy-ink-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-happy-ink-900 font-display flex items-center gap-3">
            <Users className="h-7 w-7 text-happy-coral-500" />
            <span>Gestion des Invités (Guests)</span>
          </h1>
          <p className="text-xs sm:text-sm text-happy-ink-600 mt-1">
            Gérez vos invitations, relances WhatsApp et le contrôle des entrées en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Exporter CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            className="shadow-glow"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Ajouter un invité
          </Button>
        </div>
      </div>

      {/* Stats Quick Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-happy-ink-200 bg-white p-4 shadow-2xs">
          <p className="text-xs font-semibold text-happy-ink-500">Total Invités</p>
          <p className="text-2xl font-black text-happy-ink-900 mt-1">{guests.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-2xs">
          <p className="text-xs font-semibold text-emerald-800">Confirmés (RSVP)</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{totalConfirmed}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-2xs">
          <p className="text-xs font-semibold text-amber-800">En attente</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{totalPending}</p>
        </div>
        <div className="rounded-2xl border border-happy-coral-200 bg-happy-coral-50/40 p-4 shadow-2xs">
          <p className="text-xs font-semibold text-happy-coral-800">Arrivés (Check-in)</p>
          <p className="text-2xl font-black text-happy-coral-700 mt-1">{totalCheckedIn}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap rounded-2xl bg-happy-sand-100 p-1 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "ALL"
                ? "bg-white text-happy-ink-900 shadow-xs"
                : "text-happy-ink-600 hover:text-happy-ink-900"
            }`}
          >
            Tous ({guests.length})
          </button>
          <button
            onClick={() => setActiveTab("CONFIRMED")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "CONFIRMED"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-happy-ink-600 hover:text-happy-ink-900"
            }`}
          >
            Confirmés ({totalConfirmed})
          </button>
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "PENDING"
                ? "bg-white text-amber-700 shadow-xs"
                : "text-happy-ink-600 hover:text-happy-ink-900"
            }`}
          >
            En attente ({totalPending})
          </button>
          <button
            onClick={() => setActiveTab("CHECKEDIN")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "CHECKEDIN"
                ? "bg-white text-happy-coral-600 shadow-xs"
                : "text-happy-ink-600 hover:text-happy-ink-900"
            }`}
          >
            Arrivés ({totalCheckedIn})
          </button>
          <button
            onClick={() => setActiveTab("VIP")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "VIP"
                ? "bg-white text-amber-800 shadow-xs"
                : "text-happy-ink-600 hover:text-happy-ink-900"
            }`}
          >
            VIP ({guests.filter((g) => g.isVip).length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-happy-ink-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, tél ou groupe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-happy-ink-200 bg-white pl-10 pr-4 py-2 text-xs text-happy-ink-900 placeholder-happy-ink-400 focus:border-happy-coral-500 focus:outline-none focus:ring-2 focus:ring-happy-coral-500/20"
          />
        </div>
      </div>

      {/* Guests Table Card */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-happy-sand-100 text-happy-ink-600 uppercase font-bold border-b border-happy-ink-200/80">
              <tr>
                <th className="p-4">Invité</th>
                <th className="p-4">Téléphone</th>
                <th className="p-4">Groupe</th>
                <th className="p-4">Statut RSVP</th>
                <th className="p-4">Check-in Entrée</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-happy-ink-100">
              {filteredGuests.map((guest) => (
                <tr
                  key={guest.id}
                  className="hover:bg-happy-sand-50/60 transition-colors"
                >
                  {/* Name & Avatar */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={guest.name} isVip={guest.isVip} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-happy-ink-900 text-sm">
                            {guest.name}
                          </span>
                          {guest.plusOne > 0 && (
                            <span className="rounded-md bg-happy-sand-200 px-1.5 py-0.5 text-[10px] font-bold text-happy-ink-700">
                              +{guest.plusOne}
                            </span>
                          )}
                        </div>
                        {guest.dietary && (
                          <span className="text-[10px] text-amber-700 font-medium">
                            Régime : {guest.dietary}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="p-4 font-mono text-happy-ink-600">{guest.phone}</td>

                  {/* Group */}
                  <td className="p-4">
                    <span className="rounded-lg bg-happy-sand-100 border border-happy-sand-200 px-2.5 py-1 font-semibold text-happy-ink-700">
                      {guest.group}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    {guest.status === "CONFIRMED" ? (
                      <Badge variant="confirmed">Confirmé</Badge>
                    ) : guest.status === "PENDING" ? (
                      <Badge variant="pending">En attente</Badge>
                    ) : (
                      <Badge variant="declined">Décliné</Badge>
                    )}
                  </td>

                  {/* Checkin Toggle */}
                  <td className="p-4">
                    <button
                      onClick={() => toggleCheckIn(guest.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                        guest.checkedIn
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-happy-sand-100 text-happy-ink-500 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      <CheckCircle2
                        className={`h-3.5 w-3.5 ${
                          guest.checkedIn ? "text-emerald-600" : "text-happy-ink-400"
                        }`}
                      />
                      <span>{guest.checkedIn ? "Arrivé" : "Marquer présent"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right space-x-2">
                    {guest.status === "PENDING" && (
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `Bonjour ${guest.name}, confirmez votre présence à l'événement HAPPY EVENTS ici : ${eventLink}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 hover:bg-emerald-100 transition-colors font-semibold"
                        title="Relancer sur WhatsApp"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Relance</span>
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedGuest(guest)}
                      className="rounded-xl border border-happy-ink-200 px-2.5 py-1 text-happy-ink-700 hover:bg-happy-sand-100 transition-colors font-semibold"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Guest Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Ajouter un nouvel invité"
        description="Renseignez les coordonnées de l'invité pour lui attribuer un billet QR et lui envoyer l'invitation."
      >
        <form onSubmit={handleAddGuest} className="space-y-4 pt-2">
          <Input
            label="Nom & Prénom"
            placeholder="Ex: Kouamé Jean-Marc"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />

          <Input
            label="Numéro WhatsApp"
            placeholder="+225 07 00 00 00 00"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-happy-ink-700 mb-1.5">
                Groupe / Catégorie
              </label>
              <select
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                className="w-full rounded-2xl border border-happy-ink-200 bg-white px-3 py-2 text-xs font-medium text-happy-ink-900 focus:border-happy-coral-500 focus:outline-none"
              >
                <option value="Famille proche">Famille proche</option>
                <option value="Amis">Amis</option>
                <option value="Collègues">Collègues</option>
                <option value="VIP & Partenaires">VIP & Partenaires</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-happy-ink-700 mb-1.5">
                Accompagnant (+1)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={newPlusOne}
                onChange={(e) => setNewPlusOne(Number(e.target.value))}
                className="w-full rounded-2xl border border-happy-ink-200 bg-white px-3 py-2 text-xs font-medium text-happy-ink-900 focus:border-happy-coral-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="vipCheck"
              checked={newIsVip}
              onChange={(e) => setNewIsVip(e.target.checked)}
              className="h-4 w-4 rounded border-happy-ink-300 text-happy-coral-500 focus:ring-happy-coral-500"
            />
            <label htmlFor="vipCheck" className="text-xs font-bold text-happy-ink-800">
              Invité VIP (accès carré réservé)
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setAddModalOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              Ajouter l'invité
            </Button>
          </div>
        </form>
      </Modal>

      {/* Guest Details Modal */}
      {selectedGuest && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedGuest(null)}
          title={`Fiche Invité : ${selectedGuest.name}`}
        >
          <div className="space-y-4 pt-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-happy-sand-100">
              <span className="font-bold text-happy-ink-600">Statut :</span>
              {selectedGuest.status === "CONFIRMED" ? (
                <Badge variant="confirmed">Confirmé</Badge>
              ) : selectedGuest.status === "PENDING" ? (
                <Badge variant="pending">En attente</Badge>
              ) : (
                <Badge variant="declined">Décliné</Badge>
              )}
            </div>

            <div className="space-y-2 text-happy-ink-800">
              <p><strong>Téléphone :</strong> {selectedGuest.phone}</p>
              <p><strong>Groupe :</strong> {selectedGuest.group}</p>
              <p><strong>Accompagnants :</strong> +{selectedGuest.plusOne}</p>
              <p><strong>Statut VIP :</strong> {selectedGuest.isVip ? "Oui 👑" : "Standard"}</p>
              <p><strong>Entrée enregistrée :</strong> {selectedGuest.checkedIn ? "Oui (Scanné) ✓" : "Non encore arrivé"}</p>
              {selectedGuest.dietary && (
                <p><strong>Régime particulier :</strong> {selectedGuest.dietary}</p>
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Bonjour ${selectedGuest.name}, voici votre invitation : ${eventLink}`
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="whatsapp" size="sm" leftIcon={<MessageCircle className="h-4 w-4" />}>
                  WhatsApp
                </Button>
              </a>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedGuest(null)}
              >
                Fermer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
