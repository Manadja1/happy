"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Calendar,
  Check,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const [eventSwitcherOpen, setEventSwitcherOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Mock current active event
  const currentEvent = {
    id: "evt_ange_01",
    name: "Anniversaire d'Ange — 30 Ans",
    date: "26 Septembre 2026",
    slug: "ange-anniversaire-30",
    venue: "Sofitel Hôtel Ivoire, Abidjan",
  };

  const otherEvents = [
    {
      id: "evt_mariage_02",
      name: "Mariage Traditionnel & Dot (Koffi & Awa)",
      date: "14 Novembre 2026",
      slug: "mariage-koffi-awa",
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-happy-ink-100 bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-8">
      {/* Event Switcher */}
      <div className="relative">
        <button
          onClick={() => setEventSwitcherOpen(!eventSwitcherOpen)}
          className="flex items-center gap-2.5 rounded-xl border border-happy-ink-200/80 bg-happy-sand-100/60 px-3 py-1.5 text-left hover:bg-happy-sand-100 transition-colors"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-happy-coral-100 text-happy-coral-600">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-happy-ink-900 truncate max-w-[180px] sm:max-w-[260px]">
              {currentEvent.name}
            </span>
            <span className="text-[10px] text-happy-ink-500">
              {currentEvent.date}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-happy-ink-400 ml-1" />
        </button>

        {/* Dropdown menu */}
        {eventSwitcherOpen && (
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
                onClick={() => setEventSwitcherOpen(false)}
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
        )}
      </div>

      {/* Right controls: View Public Page, Notifications, Profile */}
      <div className="flex items-center gap-3">
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
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-happy-coral-500 animate-pulse" />
          </button>

          {notificationsOpen && (
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
          )}
        </div>

        {/* User Profile avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-happy-ink-200">
          <Avatar
            name="Ange Koffi"
            size="sm"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          />
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-happy-ink-900">
              Ange Koffi
            </span>
            <span className="text-[10px] text-happy-ink-400 font-medium">
              Organisateur
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
