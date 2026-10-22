"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  Sparkles,
  Heart,
  Shirt,
  MessageCircle,
  Gift,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  QrCode,
  Download,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import QRCode from "qrcode";

export default function PublicEventPage({
  params,
}: {
  params: { slug: string };
}) {
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "declined">("attending");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [plusOneCount, setPlusOneCount] = useState(0);
  const [dietary, setDietary] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [createdQrToken, setCreatedQrToken] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  React.useEffect(() => {
    if (createdQrToken && typeof window !== "undefined") {
      const payload = `${window.location.origin}/dashboard/checkin?token=${createdQrToken}`;
      QRCode.toDataURL(payload, {
        width: 280,
        margin: 1.5,
        color: {
          dark: "#1A1A1A",
          light: "#FFFFFF",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch(() => {});
    }
  }, [createdQrToken]);

  const handleDownloadPass = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `pass-entree-${params.slug}-${createdQrToken || "invite"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Pass officiel téléchargé avec succès !");
  };

  // Event State with initial defaults
  const [eventData, setEventData] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (params.slug) {
      fetch(`/api/public/events/${params.slug}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setEventData(json.data);
          } else {
            setNotFound(true);
          }
        })
        .catch(() => {
          setNotFound(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [params.slug]);

  // Combined Presentation Data
  const event = {
    title: eventData?.name || "Anniversaire d'Ange — 30 Ans",
    host: "Ange Koffi",
    type: eventData?.type === "WEDDING" ? "Mariage Civil & Religieux" : eventData?.type === "DOT" ? "Dot Traditionnelle" : "Anniversaire VIP",
    date: eventData?.date
      ? new Date(eventData.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      : "Samedi 26 Septembre 2026",
    time: eventData?.startTime ? `${eventData.startTime} - ${eventData.endTime || "Tard"}` : "19h30 - 04h00",
    venue: eventData?.venue || "Sofitel Abidjan Hôtel Ivoire — Salle Chandelier",
    address: eventData?.address || "Boulevard Hassan II, Cocody, Abidjan, Côte d'Ivoire",
    dressCode: "Chic & Élégant avec une touche d'Or 🌟",
    description:
      eventData?.description ||
      "Trente ans, c'est une étape inoubliable ! J'ai l'immense joie de vous convier pour une soirée festive d'exception. Cocktail dînatoire, musique live et célébration jusqu'au bout de la nuit.",
    coverImage: eventData?.coverImage || "/images/hero-birthday.jpg",
    schedule: [
      { time: eventData?.startTime || "19h30", label: "Accueil des invités & Cocktail de bienvenue" },
      { time: "20h30", label: "Dîner gastronomique & Prestations artistiques" },
      { time: "22h30", label: "Gâteau & Champagne des festivités" },
      { time: "23h00", label: "Soirée dansante avec DJ" },
    ],
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Vous êtes invité(e) à ${event.title} ! Confirmez votre présence ici :`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Lien de l'événement copié dans le presse-papier !");
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: params.slug,
          fullName: guestName,
          phone: guestPhone,
          status: rsvpStatus === "attending" ? "CONFIRMED" : "DECLINED",
          plusOneCount: Number(plusOneCount),
          dietaryPreference: dietary,
          message,
        }),
      });

      const json = await res.json();
      if (json.success) {
        if (json.data?.qrToken) {
          setCreatedQrToken(json.data.qrToken);
        }
        setSubmitted(true);
      } else {
        alert(json.error?.message || "Erreur lors de l'enregistrement de votre réponse");
      }
    } catch (err: any) {
      alert("Erreur de connexion : " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-100 text-rose-600 mb-4 shadow-soft">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-black text-happy-ink-900 font-display">
          Événement introuvable
        </h1>
        <p className="mt-2 text-sm text-happy-ink-600 max-w-sm">
          Le lien d&apos;invitation n&apos;existe pas ou l&apos;événement a été retiré.
        </p>
        <Link href="/" className="mt-6">
          <Button variant="primary">
            Retour à l&apos;accueil
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 text-happy-ink-900">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 right-6 z-50 rounded-2xl bg-emerald-600 px-5 py-3 text-white shadow-xl animate-fadeIn flex items-center gap-2 text-xs font-bold">
          <CheckCircle className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Floating App Bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-happy-ink-100 bg-white/80 backdrop-blur-md px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-happy-coral-500 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-happy-ink-900 font-display">
            HAPPY<span className="text-happy-coral-500">EVENTS</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="whatsapp"
            size="sm"
            className="h-8 text-xs px-3"
            onClick={handleShare}
            leftIcon={<Share2 className="h-3.5 w-3.5" />}
          >
            Partager
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="h-8 text-xs px-3 shadow-soft font-bold"
            onClick={() => setRsvpModalOpen(true)}
          >
            RSVP Présence
          </Button>
        </div>
      </div>

      {/* Hero Cover Card */}
      <div className="relative mx-auto max-w-2xl px-4 pt-4 sm:pt-6">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-3xl shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.coverImage}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-happy-ink-950/85 via-happy-ink-950/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <Badge variant="vip" className="mb-2">
              {event.type}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white drop-shadow">
              {event.title}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              Organisé avec amour par {event.host}
            </p>
          </div>
        </div>

        {/* Essential Info Card */}
        <div className="mt-4 rounded-3xl border border-happy-ink-100 bg-white p-5 sm:p-6 shadow-soft space-y-4">
          <div className="flex items-start gap-3 text-sm text-happy-ink-800">
            <Calendar className="h-5 w-5 text-happy-coral-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{event.date}</p>
              <p className="text-xs text-happy-ink-500">{event.time}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-happy-ink-800">
            <MapPin className="h-5 w-5 text-happy-coral-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{event.venue}</p>
              <p className="text-xs text-happy-ink-500">{event.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-happy-ink-800">
            <Shirt className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Dress Code</p>
              <p className="text-xs text-happy-ink-600">{event.dressCode}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 rounded-3xl border border-happy-ink-100 bg-white p-5 sm:p-6 shadow-soft">
          <h2 className="text-base font-bold text-happy-ink-900 font-display mb-2">
            Le Mot de l'Hôte
          </h2>
          <p className="text-xs sm:text-sm text-happy-ink-600 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Schedule */}
        <div className="mt-4 rounded-3xl border border-happy-ink-100 bg-white p-5 sm:p-6 shadow-soft">
          <h2 className="text-base font-bold text-happy-ink-900 font-display mb-3">
            Programme de la Célébration
          </h2>
          <div className="space-y-3">
            {event.schedule.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="font-mono font-bold text-happy-coral-600 w-12 shrink-0">
                  {item.time}
                </span>
                <span className="text-happy-ink-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick CTA Card */}
        <div className="mt-6 p-6 rounded-3xl bg-gradient-to-br from-happy-coral-500 via-happy-coral-600 to-amber-500 text-white text-center shadow-xl space-y-3">
          <h3 className="text-lg font-bold font-display">Serez-vous des nôtres ?</h3>
          <p className="text-xs text-white/90 max-w-sm mx-auto">
            Merci de confirmer votre présence avant le 20 septembre afin de nous permettre de finaliser le traiteur et les places assises.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="w-full bg-white text-happy-coral-600 hover:bg-happy-sand-100 font-bold shadow-soft"
            onClick={() => setRsvpModalOpen(true)}
          >
            Répondre à l'invitation (RSVP)
          </Button>
        </div>
      </div>

      {/* RSVP Modal */}
      <Modal
        isOpen={rsvpModalOpen}
        onClose={() => setRsvpModalOpen(false)}
        title={submitted ? "Votre Billet d'Accès Digital" : "Confirmation de présence (RSVP)"}
        description={
          submitted
            ? "Présentez ce QR Code à l'accueil pour entrer instantanément."
            : "Veuillez remplir vos coordonnées pour recevoir votre badge d'accès QR."
        }
      >
        {!submitted ? (
          <form onSubmit={handleRsvpSubmit} className="space-y-4 mt-2">
            {/* Presence Choice */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRsvpStatus("attending")}
                className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition-all ${
                  rsvpStatus === "attending"
                    ? "bg-emerald-600 text-white shadow-soft"
                    : "bg-happy-sand-100 text-happy-ink-700 hover:bg-happy-sand-200"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                Je serai présent(e)
              </button>
              <button
                type="button"
                onClick={() => setRsvpStatus("declined")}
                className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition-all ${
                  rsvpStatus === "declined"
                    ? "bg-rose-600 text-white shadow-soft"
                    : "bg-happy-sand-100 text-happy-ink-700 hover:bg-happy-sand-200"
                }`}
              >
                <AlertCircle className="h-4 w-4" />
                Je ne pourrai pas
              </button>
            </div>

            <Input
              label="Nom & Prénom"
              placeholder="Ex : Kouassi Jean"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />

            <Input
              label="Numéro WhatsApp"
              placeholder="+225 07 00 00 00 00"
              required
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
            />

            {rsvpStatus === "attending" && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-happy-ink-700 mb-1">
                    Accompagnant (+1)
                  </label>
                  <select
                    className="h-11 w-full rounded-xl border border-happy-ink-200 bg-white px-3 text-sm text-happy-ink-900 focus:border-happy-coral-500 focus:outline-none focus:ring-2 focus:ring-happy-coral-500/20"
                    value={plusOneCount}
                    onChange={(e) => setPlusOneCount(Number(e.target.value))}
                  >
                    <option value={0}>Je viens seul(e)</option>
                    <option value={1}>Je viens accompagné(e) (+1)</option>
                  </select>
                </div>

                <Input
                  label="Préférence alimentaire (optionnel)"
                  placeholder="Ex : Halal, Sans porc, Végétarien..."
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                />
              </>
            )}

            <Input
              label="Un petit mot pour Ange"
              placeholder="Félicitations, mot d'amitié..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full h-11 font-bold">
                Valider ma réponse
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 space-y-4">
            {rsvpStatus === "attending" ? (
              <div className="space-y-4">
                {/* Virtual Digital Pass */}
                <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] p-5 shadow-xl text-center space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="vip">Billet Confirmé</Badge>
                    <span className="text-[10px] font-mono text-happy-ink-600 font-bold bg-amber-100/80 px-2 py-0.5 rounded-md">
                      {createdQrToken || "PASS-OFFICIEL"}
                    </span>
                  </div>

                  <div className="my-2 p-3 bg-white rounded-2xl border border-amber-200 inline-block shadow-xs">
                    {qrDataUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={qrDataUrl}
                        alt={`Pass QR Code ${createdQrToken}`}
                        className="h-32 w-32 mx-auto rounded-lg object-contain"
                      />
                    ) : (
                      <QrCode className="h-28 w-28 text-happy-ink-900 mx-auto animate-pulse" />
                    )}
                    <span className="text-[10px] font-mono text-happy-ink-600 mt-1.5 block font-bold">
                      Token : {createdQrToken || "tok_securise"}
                    </span>
                    <span className="text-[10px] text-happy-ink-400 block">
                      Valable pour entrée 1 personne {plusOneCount > 0 && "+1 invité"}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-happy-ink-900 font-display">
                      {guestName || "Invité d'Honneur"}
                    </h4>
                    <p className="text-xs text-emerald-700 font-bold mt-0.5">
                      ✓ Présence confirmée • {event.venue}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    variant="whatsapp"
                    size="sm"
                    className="flex-1"
                    onClick={handleDownloadPass}
                    leftIcon={<Download className="h-4 w-4" />}
                  >
                    Télécharger le pass
                  </Button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `J'ai confirmé ma présence à ${event.title} ! Voici le lien de l'événement : ${typeof window !== "undefined" ? window.location.href : ""}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <Button variant="secondary" size="sm" className="w-full" leftIcon={<MessageCircle className="h-4 w-4 text-emerald-600" />}>
                      Partager WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-happy-sand-200 text-happy-ink-600">
                  <Heart className="h-7 w-7 text-happy-coral-500" />
                </div>
                <h4 className="text-lg font-bold text-happy-ink-900 font-display">
                  Merci de votre réponse, {guestName || "cher invité"} !
                </h4>
                <p className="text-xs text-happy-ink-600 max-w-sm mx-auto">
                  Votre message a bien été transmis à Ange. Nous espérons vous revoir lors d'un prochain événement !
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSubmitted(false);
                    setRsvpModalOpen(false);
                  }}
                >
                  Fermer
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
