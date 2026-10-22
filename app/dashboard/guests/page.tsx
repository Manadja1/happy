"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Download,
  Upload,
  FileText,
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
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea } from "@/components/ui/input";

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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentEventName, setCurrentEventName] = useState<string>("Mon Événement");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "CONFIRMED" | "PENDING" | "CHECKEDIN" | "VIP">("ALL");
  const [activeEventId, setActiveEventId] = useState<string>("");

  React.useEffect(() => {
    // 1. Fetch user session
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.user) {
          setCurrentUser(json.data.user);
        }
      })
      .catch(() => {});

    // 2. Fetch user events
    fetch("/api/events")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const stored = typeof window !== "undefined" ? localStorage.getItem("happy_active_event_id") : null;
          const target = (stored && json.data.find((e: any) => e.id === stored)) || json.data[0];
          setActiveEventId(target.id);
          setCurrentEventName(target.name);
          setEventLink(`${typeof window !== "undefined" ? window.location.origin : "https://happyevents.ci"}/e/${target.slug}`);

          // 3. Fetch guests for this active event
          fetch(`/api/guests?eventId=${target.id}`)
            .then((r) => r.json())
            .then((gJson) => {
              if (gJson.success && Array.isArray(gJson.data)) {
                const mapped: Guest[] = gJson.data.map((g: any) => ({
                  id: g.id,
                  name: `${g.firstName} ${g.lastName}`.trim(),
                  phone: g.phone || "+225 -- -- -- --",
                  group: g.group || "Invités",
                  isVip: Boolean(g.isVip),
                  status: g.rsvpStatus || "PENDING",
                  plusOne: g.plusOneCount || 0,
                  checkedIn: Boolean(g.checkedIn),
                  confirmedAt: "Récemment",
                }));
                setGuests(mapped);
              }
            })
            .catch(() => {});
        } else if (json.success && Array.isArray(json.data) && json.data.length === 0) {
          setGuests([]);
          setCurrentEventName("Aucun événement");
        }
      })
      .catch(() => {});
  }, []);

  // Modal State for Adding Guest
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newGroup, setNewGroup] = useState("Amis");
  const [newPlusOne, setNewPlusOne] = useState(0);
  const [newIsVip, setNewIsVip] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");

  // Modal State for CSV Import
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // Modal State for Guest Details
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [eventLink, setEventLink] = useState("https://happyevents.ci/e/ange-anniversaire-30");

  // Edit & Delete modal states
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editGroup, setEditGroup] = useState("Amis");
  const [editPlusOne, setEditPlusOne] = useState(0);
  const [editIsVip, setEditIsVip] = useState(false);
  const [editStatus, setEditStatus] = useState<"CONFIRMED" | "PENDING" | "DECLINED">("PENDING");
  const [isUpdating, setIsUpdating] = useState(false);

  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openEditModal = (guest: Guest) => {
    setEditingGuest(guest);
    setEditName(guest.name);
    setEditPhone(guest.phone);
    setEditGroup(guest.group);
    setEditPlusOne(guest.plusOne);
    setEditIsVip(guest.isVip);
    setEditStatus(guest.status);
    setSelectedGuest(null);
  };

  const handleUpdateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest || !editName.trim()) return;
    setIsUpdating(true);

    const parts = editName.trim().split(/\s+/);
    const firstName = parts[0] || "Invité";
    const lastName = parts.slice(1).join(" ") || "";

    try {
      const res = await fetch(`/api/guests/${editingGuest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: activeEventId,
          firstName,
          lastName,
          phone: editPhone.trim(),
          group: editGroup,
          plusOneCount: Number(editPlusOne),
          isVip: editIsVip,
          rsvpStatus: editStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Erreur de mise à jour");
      }

      setGuests((prev) =>
        prev.map((g) =>
          g.id === editingGuest.id
            ? {
                ...g,
                name: editName.trim(),
                phone: editPhone.trim(),
                group: editGroup,
                plusOne: Number(editPlusOne),
                isVip: editIsVip,
                status: editStatus,
              }
            : g
        )
      );

      setNotificationMsg(`Invité "${editName.trim()}" modifié avec succès !`);
      setTimeout(() => setNotificationMsg(""), 3500);
      setEditingGuest(null);
    } catch (err: any) {
      setNotificationMsg(err.message || "Erreur lors de la modification");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteGuest = async () => {
    if (!deletingGuest) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/guests/${deletingGuest.id}?eventId=${activeEventId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Erreur lors de la suppression");
      }

      setGuests((prev) => prev.filter((g) => g.id !== deletingGuest.id));
      setNotificationMsg(`Invité "${deletingGuest.name}" retiré avec succès.`);
      setTimeout(() => setNotificationMsg(""), 3500);
      setDeletingGuest(null);
      setSelectedGuest(null);
    } catch (err: any) {
      setNotificationMsg(err.message || "Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const loadGuests = React.useCallback((eventId: string) => {
    fetch(`/api/guests?eventId=${eventId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const apiGuests: Guest[] = json.data.map((g: any) => ({
            id: g.id,
            name: `${g.firstName} ${g.lastName}`.trim(),
            phone: g.phone || "+225 -- -- -- --",
            group: g.group || "Invités",
            isVip: Boolean(g.isVip),
            status: g.rsvpStatus || "PENDING",
            plusOne: g.plusOneCount || 0,
            checkedIn: Boolean(g.checkedIn),
            dietary: g.dietaryPreference || undefined,
          }));
          setGuests(apiGuests);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const evtId = params.get("eventId") || localStorage.getItem("happy_active_event_id") || "evt_30ans_ange";
      setActiveEventId(evtId);
      setEventLink(`${window.location.origin}/e/ange-anniversaire-30`);
      loadGuests(evtId);
    }
  }, [loadGuests]);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const parts = newName.trim().split(/\s+/);
    const firstName = parts[0] || "Invité";
    const lastName = parts.slice(1).join(" ") || "";

    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: activeEventId,
          firstName,
          lastName,
          phone: newPhone.trim() || undefined,
          group: newGroup,
          isVip: newIsVip,
          plusOneAllowed: Number(newPlusOne) > 0,
          plusOneCount: Number(newPlusOne),
          rsvpStatus: "PENDING",
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const createdGuest: Guest = {
          id: json.data.id,
          name: `${json.data.firstName} ${json.data.lastName}`.trim(),
          phone: json.data.phone || newPhone || "+225 -- -- -- --",
          group: json.data.group || newGroup,
          isVip: json.data.isVip,
          status: json.data.rsvpStatus || "PENDING",
          plusOne: json.data.plusOneCount || Number(newPlusOne),
          checkedIn: false,
        };
        setGuests((prev) => [createdGuest, ...prev]);
        setNotificationMsg(`Invité "${createdGuest.name}" ajouté avec succès !`);
      } else {
        alert(json.error?.message || "Erreur lors de l'ajout de l'invité");
      }
    } catch (err: any) {
      alert("Erreur de connexion : " + err.message);
    } finally {
      setNewName("");
      setNewPhone("");
      setNewPlusOne(0);
      setNewIsVip(false);
      setAddModalOpen(false);
      setTimeout(() => setNotificationMsg(""), 3500);
    }
  };

  const handleImportCSV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;
    setIsImporting(true);

    try {
      const res = await fetch("/api/guests/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: activeEventId,
          csvText,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setNotificationMsg(
          `Importation réussie : ${json.data.importedCount} invité(s) ajouté(s) à la liste !`
        );
        loadGuests(activeEventId);
        setImportModalOpen(false);
        setCsvText("");
      } else {
        alert(json.error?.message || "Erreur lors de l'importation");
      }
    } catch (err: any) {
      alert("Erreur réseau : " + err.message);
    } finally {
      setIsImporting(false);
      setTimeout(() => setNotificationMsg(""), 4000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setCsvText(content);
      }
    };
    reader.readAsText(file);
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

  const toggleCheckIn = async (id: string) => {
    const target = guests.find((g) => g.id === id);
    if (!target) return;
    const newChecked = !target.checkedIn;
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, checkedIn: newChecked } : g))
    );

    try {
      await fetch(`/api/guests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: activeEventId,
          checkedIn: newChecked,
        }),
      });
    } catch {}
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
            onClick={() => setImportModalOpen(true)}
            leftIcon={<Upload className="h-4 w-4 text-happy-coral-500" />}
          >
            Importer CSV
          </Button>
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

      {/* 0. ORGANIZER PROFILE & EVENT CONTEXT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-gradient-to-r from-happy-sand-100 via-white to-amber-50/60 border border-happy-ink-100 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Avatar
              name={currentUser?.name || "Organisateur"}
              size="lg"
              src={currentUser?.avatar || undefined}
              isVip={true}
            />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-xs">
              ✓
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-black text-happy-ink-900 truncate">
                {currentUser?.name || "Organisateur"}
              </h2>
              <span className="rounded-full bg-happy-coral-100 text-happy-coral-700 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide shrink-0">
                Organisateur Principal
              </span>
            </div>
            <p className="text-xs text-happy-ink-500 mt-0.5 flex items-center gap-2 flex-wrap">
              <span className="truncate">{currentUser?.email || "Email non renseigné"}</span>
              {currentUser?.phone && (
                <>
                  <span className="hidden xs:inline">•</span>
                  <span className="font-mono text-happy-ink-700 font-semibold shrink-0">{currentUser.phone}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-happy-ink-100">
          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-happy-ink-400 block">
              Événement en cours
            </span>
            <span className="text-xs font-bold text-happy-coral-600 truncate block">
              {currentEventName}
            </span>
          </div>
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="sm" className="text-xs text-happy-ink-600">
              Modifier
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Quick Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-happy-ink-200 bg-white p-3.5 sm:p-4 shadow-2xs">
          <p className="text-xs font-semibold text-happy-ink-500">Total Invités</p>
          <p className="text-xl sm:text-2xl font-black text-happy-ink-900 mt-1">{guests.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3.5 sm:p-4 shadow-2xs">
          <p className="text-xs font-semibold text-emerald-800">Confirmés (RSVP)</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">{totalConfirmed}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-3.5 sm:p-4 shadow-2xs">
          <p className="text-xs font-semibold text-amber-800">En attente</p>
          <p className="text-xl sm:text-2xl font-black text-amber-700 mt-1">{totalPending}</p>
        </div>
        <div className="rounded-2xl border border-happy-coral-200 bg-happy-coral-50/40 p-3.5 sm:p-4 shadow-2xs">
          <p className="text-xs font-semibold text-happy-coral-800">Arrivés (Check-in)</p>
          <p className="text-xl sm:text-2xl font-black text-happy-coral-700 mt-1">{totalCheckedIn}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills with Horizontal Scrolling on Mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none rounded-2xl bg-happy-sand-100 p-1 w-full sm:w-auto pb-1 sm:pb-1">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "ALL"
                ? "bg-white text-happy-ink-900 shadow-xs"
                : "text-happy-ink-600 hover:text-happy-ink-900"
            }`}
          >
            Tous ({guests.length})
          </button>
          <button
            onClick={() => setActiveTab("CONFIRMED")}
            className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "CONFIRMED"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-happy-ink-600 hover:text-happy-ink-900"
            }`}
          >
            Confirmés ({totalConfirmed})
          </button>
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "PENDING"
                ? "bg-white text-amber-700 shadow-xs"
                : "text-happy-ink-600 hover:text-happy-ink-900"
            }`}
          >
            En attente ({totalPending})
          </button>
          <button
            onClick={() => setActiveTab("CHECKEDIN")}
            className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === "CHECKEDIN"
                ? "bg-white text-happy-coral-600 shadow-xs"
                : "text-happy-ink-600 hover:text-happy-ink-900"
            }`}
          >
            Arrivés ({totalCheckedIn})
          </button>
          <button
            onClick={() => setActiveTab("VIP")}
            className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
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

      {/* Guests Container Card */}
      <Card>
        {/* DESKTOP TABLE VIEW (Visible md and up) */}
        <div className="hidden md:block overflow-x-auto">
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
                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                    {guest.status === "PENDING" && (
                      <a
                        href={`https://wa.me/${guest.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Bonjour ${guest.name}, confirmez votre présence à l'événement HAPPY EVENTS ici : ${eventLink}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 hover:bg-emerald-100 transition-colors font-semibold"
                        title="Relancer sur WhatsApp"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Relance</span>
                      </a>
                    )}
                    <button
                      onClick={() => openEditModal(guest)}
                      className="rounded-xl border border-happy-ink-200 p-1.5 text-happy-ink-600 hover:text-happy-coral-600 hover:bg-happy-sand-100 transition-colors"
                      title="Modifier cet invité"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingGuest(guest)}
                      className="rounded-xl border border-rose-200 p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                      title="Supprimer cet invité"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
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

        {/* MOBILE CARD VIEW (Block on mobile < md) - Ultra-fluide, ergonomique et lisible */}
        <div className="block md:hidden divide-y divide-happy-ink-100">
          {filteredGuests.length === 0 ? (
            <div className="p-8 text-center text-xs text-happy-ink-500">
              Aucun invité ne correspond à votre recherche.
            </div>
          ) : (
            filteredGuests.map((guest) => (
              <div
                key={guest.id}
                className="p-4 space-y-3 hover:bg-happy-sand-50/50 transition-colors"
              >
                {/* Top row: Avatar, Name, VIP, RSVP Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={guest.name} isVip={guest.isVip} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-happy-ink-900 text-sm truncate">
                          {guest.name}
                        </span>
                        {guest.isVip && (
                          <span className="rounded-full bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[10px] font-black">
                            👑 VIP
                          </span>
                        )}
                        {guest.plusOne > 0 && (
                          <span className="rounded-md bg-happy-sand-200 px-1.5 py-0.2 text-[10px] font-bold text-happy-ink-700">
                            +{guest.plusOne}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-happy-ink-500 font-medium mt-0.5">
                        {guest.group} {guest.confirmedAt && `• ${guest.confirmedAt}`}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    {guest.status === "CONFIRMED" ? (
                      <Badge variant="confirmed">Confirmé</Badge>
                    ) : guest.status === "PENDING" ? (
                      <Badge variant="pending">En attente</Badge>
                    ) : (
                      <Badge variant="declined">Décliné</Badge>
                    )}
                  </div>
                </div>

                {/* Middle row: Phone with 1-Tap Call & 1-Tap WhatsApp */}
                <div className="flex items-center justify-between gap-2 rounded-xl bg-happy-sand-50 p-2.5 border border-happy-ink-100">
                  <div className="flex items-center gap-2 font-mono text-xs text-happy-ink-800 font-semibold truncate">
                    <Phone className="h-3.5 w-3.5 text-happy-ink-500 shrink-0" />
                    <span className="truncate">{guest.phone}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={`tel:${guest.phone.replace(/[^0-9+]/g, "")}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-happy-ink-200 text-happy-ink-700 active:bg-happy-sand-100 shadow-2xs"
                      title="Appeler l'invité"
                      aria-label={`Appeler ${guest.name}`}
                    >
                      <Phone className="h-3.5 w-3.5 text-happy-coral-600" />
                    </a>
                    <a
                      href={`https://wa.me/${guest.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Bonjour ${guest.name}, confirmez votre présence à l'événement HAPPY EVENTS ici : ${eventLink}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white active:bg-emerald-600 shadow-2xs"
                      title="Message WhatsApp"
                      aria-label={`WhatsApp à ${guest.name}`}
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* Dietary Restriction if present */}
                {guest.dietary && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 rounded-lg px-2.5 py-1 border border-amber-200 font-medium">
                    🍽️ Régime : <strong>{guest.dietary}</strong>
                  </div>
                )}

                {/* Bottom row: Touch Check-in toggle + Details modal trigger */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => toggleCheckIn(guest.id)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold transition-all min-h-[40px] ${
                      guest.checkedIn
                        ? "bg-emerald-600 text-white shadow-soft"
                        : "bg-happy-sand-100 text-happy-ink-700 hover:bg-emerald-50 hover:text-emerald-800 border border-happy-ink-200"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{guest.checkedIn ? "Arrivé ✓ (Présent)" : "Marquer présent"}</span>
                  </button>

                  <button
                    onClick={() => setSelectedGuest(guest)}
                    className="rounded-xl border border-happy-ink-200 bg-white py-2 px-3 text-xs font-bold text-happy-ink-700 hover:bg-happy-sand-100 transition-colors shrink-0 min-h-[40px]"
                  >
                    Détails
                  </button>
                </div>
              </div>
            ))
          )}
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

      {/* CSV Import Modal */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Importer une liste d'invités (CSV)"
        description="Copiez-collez vos lignes CSV ou téléversez un fichier avec les colonnes : Nom, Prénom, Téléphone, Groupe, VIP, +1"
      >
        <form onSubmit={handleImportCSV} className="space-y-4 pt-2">
          {/* File Upload Zone */}
          <div className="rounded-2xl border-2 border-dashed border-happy-ink-200 bg-happy-sand-50/60 p-4 text-center hover:bg-happy-sand-100/60 transition-colors">
            <label className="cursor-pointer block">
              <Upload className="mx-auto h-8 w-8 text-happy-coral-500 mb-1" />
              <span className="text-xs font-bold text-happy-ink-800 block">
                Téléverser un fichier .CSV
              </span>
              <span className="text-[10px] text-happy-ink-400 block mt-0.5">
                Format compatible Excel, Numbers, Google Sheets
              </span>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-happy-ink-200" />
            <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-happy-ink-400">
              Ou coller directement le texte CSV
            </span>
            <div className="flex-grow border-t border-happy-ink-200" />
          </div>

          <Textarea
            label="Contenu CSV"
            placeholder={"Nom,Prénom,Téléphone,Groupe,VIP,+1\nKoffi,Marc,+22507001122,Famille,Oui,1\nDiallo,Aminata,+22505112233,Amis,Non,0"}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="font-mono text-xs min-h-[120px]"
          />

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-900 space-y-1">
            <p className="font-bold">Astuce :</p>
            <p>
              Les colonnes sont détectées automatiquement. Vous pouvez exporter depuis Excel ou Google Sheets et coller les données ici.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setImportModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isImporting || !csvText.trim()}
              isLoading={isImporting}
              leftIcon={<Upload className="h-4 w-4" />}
            >
              Lancer l'importation
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

            <div className="pt-4 flex items-center justify-between gap-2 border-t border-happy-ink-100">
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openEditModal(selectedGuest)}
                  leftIcon={<Pencil className="h-3.5 w-3.5" />}
                >
                  Modifier
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingGuest(selectedGuest)}
                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                >
                  Supprimer
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${selectedGuest.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Bonjour ${selectedGuest.name}, voici votre invitation officielle : ${eventLink}`
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
          </div>
        </Modal>
      )}

      {/* Edit Guest Modal */}
      {editingGuest && (
        <Modal
          isOpen={true}
          onClose={() => setEditingGuest(null)}
          title={`Modifier l'invité : ${editingGuest.name}`}
          description="Mettez à jour les coordonnées, le groupe ou le statut RSVP de cet invité."
        >
          <form onSubmit={handleUpdateGuest} className="space-y-4 pt-2">
            <Input
              label="Nom & Prénom"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />

            <Input
              label="Numéro WhatsApp"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-happy-ink-700 mb-1.5">
                  Groupe
                </label>
                <select
                  value={editGroup}
                  onChange={(e) => setEditGroup(e.target.value)}
                  className="w-full rounded-2xl border border-happy-ink-200 bg-white px-3 py-2 text-xs font-medium text-happy-ink-900 focus:border-happy-coral-500 focus:outline-none"
                >
                  <option value="Famille proche">Famille proche</option>
                  <option value="Amis d'enfance">Amis d'enfance</option>
                  <option value="Amis">Amis</option>
                  <option value="Collègues">Collègues</option>
                  <option value="Partenaires">Partenaires</option>
                  <option value="Promotion HEC">Promotion HEC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-happy-ink-700 mb-1.5">
                  Statut RSVP
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full rounded-2xl border border-happy-ink-200 bg-white px-3 py-2 text-xs font-medium text-happy-ink-900 focus:border-happy-coral-500 focus:outline-none"
                >
                  <option value="CONFIRMED">Confirmé</option>
                  <option value="PENDING">En attente</option>
                  <option value="DECLINED">Décliné</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center pt-1">
              <div>
                <label className="block text-xs font-bold text-happy-ink-700 mb-1.5">
                  Accompagnant (+1)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={editPlusOne}
                  onChange={(e) => setEditPlusOne(Number(e.target.value))}
                  className="w-full rounded-2xl border border-happy-ink-200 bg-white px-3 py-2 text-xs font-medium text-happy-ink-900 focus:border-happy-coral-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="editVipCheck"
                  checked={editIsVip}
                  onChange={(e) => setEditIsVip(e.target.checked)}
                  className="h-4 w-4 rounded border-happy-ink-300 text-happy-coral-500 focus:ring-happy-coral-500"
                />
                <label htmlFor="editVipCheck" className="text-xs font-bold text-happy-ink-800">
                  Invité VIP 👑
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-happy-ink-100">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingGuest(null)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isUpdating}
                isLoading={isUpdating}
              >
                {isUpdating ? "Enregistrement..." : "Mettre à jour"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingGuest && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingGuest(null)}
          title="Supprimer cet invité ?"
          description={`Êtes-vous sûr de vouloir retirer "${deletingGuest.name}" de la liste ? Son invitation et son QR code seront révoqués.`}
        >
          <div className="space-y-4 pt-2">
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 leading-relaxed">
              ⚠️ Cette action est irréversible. L'invité ne pourra plus accéder à l'événement ni valider son entrée.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setDeletingGuest(null)}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                onClick={handleDeleteGuest}
                disabled={isDeleting}
                isLoading={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white shadow-soft"
              >
                {isDeleting ? "Suppression..." : "Confirmer la suppression"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
