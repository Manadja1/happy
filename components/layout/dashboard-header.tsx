"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Calendar,
  Check,
  Menu,
  X,
  User,
  LayoutDashboard,
  Users,
  CheckCircle2,
  QrCode,
  Bot,
  Settings,
  LogOut,
  Crown,
  PlusCircle,
  Phone,
  Mail,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DashboardHeader() {
  const pathname = usePathname();
  const [eventSwitcherOpen, setEventSwitcherOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Listen to open-dashboard-drawer events triggered by MobileBottomNav
  useEffect(() => {
    const handleOpenDrawer = () => setMobileDrawerOpen(true);
    window.addEventListener("open-dashboard-drawer", handleOpenDrawer);
    return () => window.removeEventListener("open-dashboard-drawer", handleOpenDrawer);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
    setProfileOpen(false);
    setEventSwitcherOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  // Dynamic session & events state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [activeEventId, setActiveEventId] = useState<string>("");

  useEffect(() => {
    // Fetch active user session
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.user) {
          setCurrentUser(json.data.user);
        } else {
          // Unauthenticated -> redirect to login
          window.location.href = "/login";
        }
      })
      .catch(() => {});

    // Fetch user events
    fetch("/api/events")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          const mapped = json.data.map((e: any) => ({
            id: e.id,
            name: e.name,
            date: e.date
              ? new Date(e.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
              : "Date à venir",
            slug: e.slug,
            venue: e.venue || "Abidjan",
          }));
          setEventsList(mapped);

          if (mapped.length > 0) {
            const stored = typeof window !== "undefined" ? localStorage.getItem("happy_active_event_id") : null;
            const initial = stored && mapped.some((m: any) => m.id === stored) ? stored : mapped[0].id;
            setActiveEventId(initial);
          } else {
            setActiveEventId("");
          }
        }
      })
      .catch(() => {});
  }, []);

  const currentEvent = eventsList.find((e) => e.id === activeEventId) || eventsList[0] || {
    id: "evt_30ans_ange",
    name: "Mon Événement",
    date: "Date à venir",
    slug: "ange-anniversaire-30",
  };

  const otherEvents = eventsList.filter((e) => e.id !== currentEvent.id);

  const handleSelectEvent = (id: string) => {
    setActiveEventId(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("happy_active_event_id", id);
      window.dispatchEvent(new CustomEvent("active-event-changed", { detail: { eventId: id } }));
    }
    setEventSwitcherOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    window.location.href = "/login";
  };

  // Full Navigation List (Parity with desktop sidebar)
  const navItems = [
    {
      label: "Vue d'ensemble",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Mes Événements",
      href: "/dashboard/events",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Happy Studio",
      href: "/dashboard/studio",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      label: "Invités (Guests)",
      href: "/dashboard/guests",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Suivi RSVP",
      href: "/dashboard/rsvp",
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    {
      label: "Check-in (QR Code)",
      href: "/dashboard/checkin",
      icon: <QrCode className="h-5 w-5" />,
    },
    {
      label: "Happy AI (Assistant & Boissons)",
      href: "/dashboard/ai",
      icon: <Bot className="h-5 w-5" />,
      badge: "Assistant",
      highlight: true,
    },
    {
      label: "Paramètres & Sécurité",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-happy-ink-100 bg-white/95 backdrop-blur-md px-3 sm:px-6 lg:px-8">
        {/* Left Side: Mobile Menu Button + Event Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Hamburger Drawer Trigger */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-happy-sand-100 text-happy-ink-800 hover:bg-happy-sand-200 transition-colors"
            aria-label="Ouvrir le menu complet"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Event Switcher */}
          <div className="relative">
            <button
              onClick={() => setEventSwitcherOpen(!eventSwitcherOpen)}
              className="flex items-center gap-2 rounded-xl border border-happy-ink-200/80 bg-happy-sand-100/60 px-2.5 sm:px-3 py-1.5 text-left hover:bg-happy-sand-100 transition-colors"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-happy-coral-100 text-happy-coral-600">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-happy-ink-900 truncate max-w-[130px] sm:max-w-[240px]">
                  {currentEvent.name}
                </span>
                <span className="text-[10px] text-happy-ink-500 truncate hidden xs:inline">
                  {currentEvent.date}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-happy-ink-400 ml-0.5 shrink-0" />
            </button>

            {/* Event Switcher Dropdown */}
            {eventSwitcherOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setEventSwitcherOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-happy-ink-100 bg-white p-2 shadow-xl animate-fadeIn z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-happy-ink-400">
                    Événement actif
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-happy-coral-50 p-2.5 text-happy-coral-700">
                    <div>
                      <p className="text-xs font-bold">{currentEvent.name}</p>
                      <p className="text-[10px] text-happy-coral-600">{currentEvent.date}</p>
                    </div>
                    <Check className="h-4 w-4 text-happy-coral-600" />
                  </div>

                  <div className="mt-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-happy-ink-400">
                    Autres événements
                  </div>
                  {otherEvents.map((evt) => (
                    <button
                      key={evt.id}
                      onClick={() => handleSelectEvent(evt.id)}
                      className="w-full text-left rounded-xl p-2.5 hover:bg-happy-sand-100 transition-colors"
                    >
                      <p className="text-xs font-semibold text-happy-ink-800 truncate">
                        {evt.name}
                      </p>
                      <p className="text-[10px] text-happy-ink-400">{evt.date}</p>
                    </button>
                  ))}

                  <div className="mt-2 border-t border-happy-ink-100 pt-2">
                    <Link
                      href="/dashboard/events/new"
                      onClick={() => setEventSwitcherOpen(false)}
                      className="flex items-center gap-2 rounded-xl p-2 text-xs font-bold text-happy-coral-600 hover:bg-happy-coral-50"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Créer un nouvel événement</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Guided Tour, Public Page, Notifications, Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Guided Tour Quick Trigger */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-guided-tour"))}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-happy-coral-50 border border-happy-coral-200/80 text-xs font-bold text-happy-coral-700 hover:bg-happy-coral-100 transition-colors"
          >
            <Compass className="h-3.5 w-3.5 text-happy-coral-500" />
            <span>Visite guidée</span>
          </button>

          {/* Public Page Quick Button */}
          <Link
            href={`/e/${currentEvent.slug}`}
            target="_blank"
            className="hidden sm:inline-flex"
          >
            <Button
              variant="secondary"
              size="sm"
              rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
            >
              Page publique
            </Button>
          </Link>

          {/* Notifications Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-happy-sand-100 text-happy-ink-600 hover:bg-happy-sand-200 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-happy-coral-500 animate-pulse" />
            </button>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-happy-ink-100 bg-white p-3 shadow-xl animate-fadeIn z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-happy-ink-100 px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-happy-ink-800">
                      Notifications récentes
                    </span>
                    <span className="rounded-full bg-happy-coral-100 px-2 py-0.5 text-[10px] font-bold text-happy-coral-700">
                      3 nouvelles
                    </span>
                  </div>

                  <div className="mt-2 space-y-2 text-xs">
                    <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <p className="font-bold text-emerald-950">Nouveau RSVP confirmé !</p>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        Marc-Antoine Konan a confirmé sa présence (+1).
                      </p>
                      <span className="text-[10px] text-emerald-600 mt-1 block">Il y a 15 min</span>
                    </div>

                    <div className="p-2 rounded-xl bg-happy-sand-50 border border-happy-ink-100">
                      <p className="font-bold text-happy-ink-900">Billet QR scanné à l'entrée</p>
                      <p className="text-[11px] text-happy-ink-600 mt-0.5">
                        Aïcha Traoré a franchi le check-in VIP.
                      </p>
                      <span className="text-[10px] text-happy-ink-400 mt-1 block">Il y a 1h</span>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100">
                      <p className="font-bold text-amber-950">Rappel automatique suggéré</p>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        8 invités n'ont pas encore répondu sur WhatsApp.
                      </p>
                      <span className="text-[10px] text-amber-600 mt-1 block">Il y a 3h</span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-happy-ink-100 text-center">
                    <Link
                      href="/dashboard/rsvp"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs font-bold text-happy-coral-600 hover:underline"
                    >
                      Voir tous les RSVP et alertes →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Avatar with Interactive Dropdown (Works on Mobile & Desktop) */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 border-l border-happy-ink-200 hover:opacity-90 transition-opacity focus:outline-none"
              aria-label="Profil utilisateur"
            >
              <div className="relative">
                <Avatar
                  name={currentUser?.name || "Organisateur"}
                  size="sm"
                  src={currentUser?.avatar || undefined}
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-happy-ink-900 leading-tight">
                  {currentUser?.name || "Mon Espace"}
                </span>
                <span className="text-[10px] text-happy-ink-500 font-medium leading-tight">
                  {currentUser?.role === "ADMIN" ? "Administrateur" : "Organisateur"}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-happy-ink-400 hidden sm:block" />
            </button>

            {/* Profile Popover Menu */}
            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-happy-ink-100 bg-white p-3 shadow-xl animate-fadeIn z-50">
                  {/* User Profile Header Card */}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-happy-sand-100 to-amber-50/50 border border-happy-sand-200">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={currentUser?.name || "Organisateur"}
                        size="md"
                        src={currentUser?.avatar || undefined}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-happy-ink-900 truncate">
                            {currentUser?.name || "Organisateur"}
                          </p>
                          <span className="rounded-full bg-happy-coral-100 text-happy-coral-700 px-1.5 py-0.2 text-[9px] font-bold">
                            Hôte
                          </span>
                        </div>
                        <p className="text-[11px] text-happy-ink-500 truncate">
                          {currentUser?.email || ""}
                        </p>
                        {currentUser?.phone && (
                          <p className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                            <Phone className="h-2.5 w-2.5" /> {currentUser.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile Menu Links */}
                  <div className="mt-2 space-y-1 text-xs">
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl p-2.5 font-semibold text-happy-ink-800 hover:bg-happy-sand-100 transition-colors"
                    >
                      <User className="h-4 w-4 text-happy-coral-500" />
                      <span>Mon Profil & Paramètres</span>
                    </Link>
                    <Link
                      href="/dashboard/events"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl p-2.5 font-semibold text-happy-ink-800 hover:bg-happy-sand-100 transition-colors"
                    >
                      <Calendar className="h-4 w-4 text-amber-500" />
                      <span>Tous mes événements</span>
                    </Link>
                    <Link
                      href="/pricing"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl p-2.5 font-semibold text-amber-800 hover:bg-amber-50 transition-colors"
                    >
                      <Crown className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span>Forfaits & Offre Pro</span>
                    </Link>

                    {currentUser?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl p-2.5 font-bold text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4 text-red-600" />
                        <span>Super-Admin Back-Office</span>
                      </Link>
                    )}
                  </div>

                  {/* Logout link */}
                  <div className="mt-2 pt-2 border-t border-happy-ink-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 rounded-xl p-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* FULL MOBILE DRAWER / SLIDE-OVER NAVIGATION (Garantit que TOUT est accessible sur mobile) */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-happy-ink-950/60 backdrop-blur-xs animate-fadeIn"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-5/6 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-fadeIn z-50">
            <div className="p-5 space-y-5">
              {/* Drawer Header with Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-happy-ink-100">
                <Link
                  href="/"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-happy-coral-500 to-amber-500 text-white shadow-soft">
                    <Sparkles className="h-4 w-4 fill-white/20" />
                  </div>
                  <span className="text-base font-black tracking-tight text-happy-ink-900 font-display">
                    HAPPY<span className="text-happy-coral-500">EVENTS</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="h-8 w-8 rounded-lg bg-happy-sand-100 text-happy-ink-700 flex items-center justify-center hover:bg-happy-sand-200"
                  aria-label="Fermer le menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Prominent User Profile Card on Mobile */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-happy-sand-100 via-[#FFF9F5] to-amber-50 border border-happy-sand-200">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={currentUser?.name || "Organisateur"}
                    size="md"
                    src={currentUser?.avatar || undefined}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black text-happy-ink-900 truncate">
                        {currentUser?.name || "Organisateur"}
                      </h4>
                      <span className="rounded-full bg-happy-coral-100 text-happy-coral-800 px-1.5 py-0.5 text-[9px] font-bold">
                        Hôte
                      </span>
                    </div>
                    <p className="text-[11px] text-happy-ink-500 truncate">
                      {currentUser?.email || ""}
                    </p>
                    <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                      ✓ Espace Organisateur
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-happy-sand-200/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-happy-ink-500">Événement actif :</span>
                  <span className="font-bold text-happy-ink-900 truncate max-w-[160px]">
                    {currentEvent.name}
                  </span>
                </div>
              </div>

              {/* Quick New Event Button */}
              <Link
                href="/dashboard/events/new"
                onClick={() => setMobileDrawerOpen(false)}
                className="block"
              >
                <Button
                  variant="primary"
                  className="w-full text-xs h-10 shadow-glow font-bold"
                  leftIcon={<PlusCircle className="h-4 w-4" />}
                >
                  Nouvel Événement
                </Button>
              </Link>

              {/* Navigation Items (All 8 pages guaranteed accessible) */}
              <nav className="space-y-1">
                <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-happy-ink-400">
                  Navigation Organisateur
                </p>
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all",
                        isActive
                          ? "bg-happy-coral-50 text-happy-coral-600 font-bold"
                          : "text-happy-ink-700 hover:bg-happy-sand-100"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            isActive ? "text-happy-coral-600" : "text-happy-ink-400"
                          )}
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            item.highlight
                              ? "bg-amber-100 text-amber-800"
                              : "bg-happy-sand-200 text-happy-ink-700"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Public Page link */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    window.dispatchEvent(new CustomEvent("open-guided-tour"));
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-happy-coral-50 hover:bg-happy-coral-100 border border-happy-coral-200/60 text-xs font-bold text-happy-coral-700"
                >
                  <span className="flex items-center gap-2">
                    <Compass className="h-4 w-4 text-happy-coral-500" />
                    Visite guidée interactive
                  </span>
                  <Sparkles className="h-3.5 w-3.5 text-happy-coral-500" />
                </button>
                <Link
                  href={`/e/${currentEvent.slug}`}
                  target="_blank"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-happy-sand-100 hover:bg-happy-sand-200 text-xs font-bold text-happy-ink-800"
                >
                  <span>Voir la page publique des invités</span>
                  <ExternalLink className="h-3.5 w-3.5 text-happy-coral-500" />
                </Link>
              </div>

              {currentUser?.role === "ADMIN" && (
                <div className="pt-1">
                  <Link
                    href="/admin"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-bold text-red-700 border border-red-200"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-red-600" />
                      Super-Admin Back-Office
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-red-600" />
                  </Link>
                </div>
              )}
            </div>

            {/* Bottom Upgrade Callout & Logout */}
            <div className="p-5 border-t border-happy-ink-100 bg-happy-sand-50/60 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <Crown className="h-4 w-4 text-amber-600 fill-amber-500" />
                  HAPPY EVENTS PRO
                </span>
                <Link
                  href="/pricing"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="text-happy-coral-600 hover:underline text-[11px]"
                >
                  Tarifs →
                </Link>
              </div>
              <p className="text-[11px] text-happy-ink-500 leading-snug">
                Paiements Mobile Money Wave & Orange Money acceptés.
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 pt-2 text-xs font-semibold text-rose-600 hover:underline"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
