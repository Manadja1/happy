"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  X,
  QrCode,
  Check,
  Star,
  Smartphone,
  Calendar,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();

  // Streamlined form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Social Auth Modals
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [facebookModalOpen, setFacebookModalOpen] = useState(false);
  const [customFacebookEmail, setCustomFacebookEmail] = useState("");

  // Calculate password strength (0 to 4)
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd) || (pwd.length >= 10 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd))) score += 1;
    return score;
  };

  const pwdScore = getPasswordStrength(password);

  // Direct submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Veuillez renseigner une adresse email valide.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    setIsLoading(true);

    try {
      const derivedName =
        fullName.trim() ||
        email
          .split("@")[0]
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: derivedName,
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSuccessMsg("Compte créé avec succès ! Préparation de votre espace...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 700);
      } else {
        setErrorMsg(json.error?.message || "Une erreur est survenue lors de l'inscription.");
      }
    } catch (err: any) {
      setErrorMsg("Erreur réseau : " + (err.message || "Impossible de contacter le serveur"));
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Social Sign-in
  const handleSocialAuth = async (
    provider: "google" | "facebook",
    userProfile: { name: string; email: string; avatar?: string }
  ) => {
    setLoadingProvider(provider);
    setErrorMsg("");
    setSuccessMsg("");
    setGoogleModalOpen(false);
    setFacebookModalOpen(false);

    try {
      const res = await fetch("/api/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          email: userProfile.email,
          name: userProfile.name,
          avatar: userProfile.avatar,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSuccessMsg(
          `Connexion réussie avec ${provider === "google" ? "Google" : "Facebook"} ! Bienvenue ${json.data?.name || ""}...`
        );
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 600);
      } else {
        setErrorMsg(json.error?.message || "Erreur lors de l'authentification sociale.");
      }
    } catch (err: any) {
      setErrorMsg("Erreur réseau : " + (err.message || "Connexion impossible"));
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-gradient-to-br from-[#FCFBF8] via-[#FAF6F0] to-[#F5ECE1]/60 px-4 py-8 sm:px-6 lg:px-12 flex items-center justify-center">
      {/* Ambient background glows with subtle modern diffusion */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-happy-coral-200/40 via-amber-200/30 to-transparent blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[550px] w-[550px] rounded-full bg-gradient-to-tl from-happy-coral-300/30 via-rose-200/20 to-transparent blur-3xl opacity-60" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-radial from-amber-100/30 to-transparent blur-3xl" />

      {/* Main Container: 2-Column Showcase on Desktop, Fluid & Centered on Mobile */}
      <div className="relative z-10 w-full max-w-6xl mx-auto py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* =========================================================================
              LEFT COLUMN: LUXURY SHOWCASE & VALUE PROPOSITION (Desktop view)
             ========================================================================= */}
          <div className="hidden lg:flex lg:col-span-6 flex-col space-y-8 pr-2">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-happy-coral-200/60 shadow-sm backdrop-blur-md self-start">
              <span className="flex h-2 w-2 rounded-full bg-happy-coral-500 animate-ping" />
              <span className="text-xs font-bold text-happy-ink-800">
                L&apos;expérience événementielle VIP en Côte d&apos;Ivoire
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-black text-happy-ink-950 font-display tracking-tight leading-[1.15]">
                Vos plus beaux événements,{" "}
                <span className="bg-gradient-to-r from-happy-coral-600 via-happy-coral-500 to-amber-600 bg-clip-text text-transparent">
                  zéro stress.
                </span>
              </h1>
              <p className="text-base text-happy-ink-600 leading-relaxed max-w-lg">
                Fini les cartons papier égarés et les invités bloqués à l&apos;entrée. 
                Générez des pass QR codes sécurisés, partagez-les en 1 clic sur WhatsApp et scannez les arrivées en direct.
              </p>
            </div>

            {/* PREVIEW: Interactive Floating VIP Pass Card */}
            <div className="relative group">
              {/* Soft colorful backdrop shadow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-happy-coral-500/25 via-amber-500/20 to-happy-coral-500/10 blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative rounded-3xl border border-white/80 bg-white/90 backdrop-blur-xl p-6 shadow-[0_20px_45px_-10px_rgba(15,23,42,0.12)]">
                {/* VIP Pass Header */}
                <div className="flex items-center justify-between pb-4 border-b border-happy-sand-200/70">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-xs">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                        PASS D&apos;INVITATION OFFICIEL
                      </p>
                      <h3 className="text-sm font-bold text-happy-ink-900">
                        Mariage Princier Marc & Aminata
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Confirmé VIP
                  </span>
                </div>

                {/* Pass Details Body */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-happy-ink-700">
                      <Calendar className="h-3.5 w-3.5 text-happy-coral-500 shrink-0" />
                      <span>Samedi 14 Décembre • 19:30</span>
                    </div>
                    <div className="flex items-center gap-2 text-happy-ink-700">
                      <MapPin className="h-3.5 w-3.5 text-happy-coral-500 shrink-0" />
                      <span>Sofitel Hôtel Ivoire, Abidjan</span>
                    </div>
                    <div className="flex items-center gap-2 text-happy-ink-600 text-[11px]">
                      <span className="font-semibold text-happy-ink-900">Table d&apos;Honneur N°1</span>
                      <span>• 2 Personnes</span>
                    </div>
                  </div>

                  {/* High-tech QR Code Preview */}
                  <div className="h-20 w-20 shrink-0 rounded-2xl bg-happy-ink-900 p-2 flex flex-col items-center justify-center text-white shadow-md relative overflow-hidden group/qr">
                    <QrCode className="h-12 w-12 text-white" />
                    <span className="text-[8px] font-mono tracking-tighter text-amber-400 mt-0.5">
                      #VIP-8902
                    </span>
                  </div>
                </div>

                {/* Floating micro badges */}
                <div className="pt-3 border-t border-happy-sand-200/70 flex items-center justify-between text-[11px] font-semibold text-happy-ink-600">
                  <span className="flex items-center gap-1 text-happy-coral-600">
                    <Smartphone className="h-3.5 w-3.5" />
                    Pass envoyé via WhatsApp
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Check-in &lt; 1 seconde
                  </span>
                </div>
              </div>
            </div>

            {/* Social Proof & Trust */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                />
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-happy-coral-500 ring-2 ring-white text-white font-bold text-xs shadow-sm">
                  +1.2k
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-xs font-black text-happy-ink-900">5.0</span>
                </div>
                <p className="text-xs text-happy-ink-600 font-medium">
                  Plus de <strong>1 200 événements</strong> réussis en Côte d&apos;Ivoire
                </p>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: ULTRA-ÉPURÉ, MODERN REGISTRATION CARD
             ========================================================================= */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            {/* The Master Glassmorphic Card */}
            <div className="relative rounded-3xl bg-white/95 backdrop-blur-2xl p-7 sm:p-9 border border-white/90 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12),0_8px_20px_-6px_rgba(224,90,71,0.08)] transition-all">
              
              {/* Card Header */}
              <div className="text-center mb-6">
                <Link href="/" className="inline-flex items-center gap-2 group mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-happy-coral-500 to-amber-500 text-white shadow-soft group-hover:scale-105 transition-transform duration-200">
                    <Sparkles className="h-5 w-5 fill-white/20" />
                  </div>
                </Link>

                <h2 className="text-2xl sm:text-3xl font-black text-happy-ink-950 font-display tracking-tight">
                  Créer un compte
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-happy-ink-600">
                  Accédez à votre espace organisateur en moins de 10 secondes.
                </p>
              </div>

              {/* Feedback Notifications */}
              {successMsg && (
                <div className="mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center gap-2.5 text-xs font-bold text-emerald-800 animate-fadeIn">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-5 rounded-2xl bg-red-50 border border-red-200 p-3.5 flex items-start gap-2.5 text-xs font-bold text-red-800 animate-fadeIn">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. HERO GOOGLE 1-CLICK AUTHENTICATION */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setGoogleModalOpen(true)}
                  disabled={isLoading || loadingProvider !== null}
                  className="w-full h-12 rounded-2xl border border-happy-ink-200/90 bg-white hover:bg-happy-sand-50/70 hover:border-happy-ink-300 hover:shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-3 px-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-sm font-bold text-happy-ink-900">
                    {loadingProvider === "google" ? "Connexion Google en cours..." : "Continuer avec Google"}
                  </span>
                  <span className="ml-auto text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 tracking-wider">
                    1-Clic
                  </span>
                </button>

                {/* Secondary Quick Connections: Facebook & Quick Demo */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFacebookModalOpen(true)}
                    disabled={isLoading || loadingProvider !== null}
                    className="h-10 rounded-xl border border-happy-ink-200/80 bg-white hover:bg-blue-50/50 hover:border-blue-200 transition-all flex items-center justify-center gap-2 text-xs font-bold text-happy-ink-800 shadow-2xs"
                  >
                    <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        const res = await fetch("/api/auth/login", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ isDemo: true }),
                        });
                        const json = await res.json();
                        if (json.success) {
                          setSuccessMsg("Connexion démo réussie ! Redirection...");
                          setTimeout(() => {
                            router.push("/dashboard");
                            router.refresh();
                          }, 400);
                        }
                      } catch {
                        setErrorMsg("Erreur connexion démo");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading || loadingProvider !== null}
                    className="h-10 rounded-xl border border-amber-200/90 bg-amber-50/50 hover:bg-amber-100/70 transition-all flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900 shadow-2xs"
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-600" />
                    <span>Compte Démo</span>
                  </button>
                </div>
              </div>

              {/* Minimal Divider */}
              <div className="my-5 relative flex items-center">
                <div className="flex-grow border-t border-happy-ink-100" />
                <span className="mx-3 text-[11px] font-bold uppercase tracking-wider text-happy-ink-400">
                  Ou par email
                </span>
                <div className="flex-grow border-t border-happy-ink-100" />
              </div>

              {/* 2. ÉPURÉ REGISTRATION FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-happy-ink-700">
                    Nom & Prénom <span className="text-happy-ink-400 font-normal lowercase">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ex: Marc Konan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-11 w-full rounded-xl border border-happy-ink-200/90 bg-happy-sand-50/60 pl-10 pr-3.5 text-sm text-happy-ink-900 placeholder:text-happy-ink-400 focus:border-happy-coral-500 focus:bg-white focus:ring-4 focus:ring-happy-coral-500/10 focus:outline-none transition-all"
                    />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-happy-ink-400" />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-happy-ink-700">
                    Adresse email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="nom@exemple.ci"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 w-full rounded-xl border border-happy-ink-200/90 bg-happy-sand-50/60 pl-10 pr-3.5 text-sm text-happy-ink-900 placeholder:text-happy-ink-400 focus:border-happy-coral-500 focus:bg-white focus:ring-4 focus:ring-happy-coral-500/10 focus:outline-none transition-all"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-happy-ink-400" />
                  </div>
                </div>

                {/* Password with Eye Toggle & Dynamic Strength Indicator */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-happy-ink-700">
                      Mot de passe
                    </label>
                    {password && (
                      <span className="text-[10px] font-bold text-happy-ink-500">
                        {pwdScore <= 1 && "Trop court"}
                        {pwdScore === 2 && "Moyen"}
                        {pwdScore === 3 && "Bon"}
                        {pwdScore === 4 && "Très sécurisé"}
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="6 caractères minimum"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 w-full rounded-xl border border-happy-ink-200/90 bg-happy-sand-50/60 pl-10 pr-10 text-sm text-happy-ink-900 placeholder:text-happy-ink-400 focus:border-happy-coral-500 focus:bg-white focus:ring-4 focus:ring-happy-coral-500/10 focus:outline-none transition-all"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-happy-ink-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-happy-ink-400 hover:text-happy-ink-700 focus:outline-none"
                      aria-label="Afficher le mot de passe"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Micro Password Strength Meter */}
                  {password.length > 0 && (
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      <div className={`h-1 rounded-full transition-all duration-300 ${pwdScore >= 1 ? "bg-amber-400" : "bg-happy-sand-200"}`} />
                      <div className={`h-1 rounded-full transition-all duration-300 ${pwdScore >= 2 ? "bg-amber-500" : "bg-happy-sand-200"}`} />
                      <div className={`h-1 rounded-full transition-all duration-300 ${pwdScore >= 3 ? "bg-emerald-400" : "bg-happy-sand-200"}`} />
                      <div className={`h-1 rounded-full transition-all duration-300 ${pwdScore >= 4 ? "bg-emerald-500" : "bg-happy-sand-200"}`} />
                    </div>
                  )}
                </div>

                {/* Hero Gradient Submit Button with Soft Glow Shadow */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-12 text-sm mt-3 font-black rounded-xl bg-gradient-to-r from-happy-coral-500 via-happy-coral-600 to-amber-500 hover:opacity-95 shadow-[0_10px_25px_-5px_rgba(224,90,71,0.4)] active:scale-[0.99] transition-all"
                  disabled={isLoading || loadingProvider !== null}
                  rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" /> : undefined}
                >
                  {isLoading ? "Création de votre compte..." : "Commencer gratuitement"}
                </Button>
              </form>

              {/* Login Switch */}
              <div className="mt-5 pt-4 border-t border-happy-sand-200/70 text-center text-xs text-happy-ink-600">
                Vous avez déjà un compte ?{" "}
                <Link
                  href="/login"
                  className="font-bold text-happy-coral-600 hover:text-happy-coral-700 hover:underline"
                >
                  Se connecter
                </Link>
              </div>
            </div>

            {/* Security Badges */}
            <div className="mt-5 flex items-center justify-center gap-4 text-[11px] font-medium text-happy-ink-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Données chiffrées & isolées
              </span>
              <span>•</span>
              <span>Sans carte bancaire</span>
              <span>•</span>
              <span>Activation 1-clic</span>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          MODAL: INTERACTIVE GOOGLE AUTHENTICATION
         ========================================================================= */}
      {googleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-happy-ink-100 p-6 shadow-2xl animate-scaleUp">
            {/* Google Brand Header */}
            <div className="flex items-center justify-between pb-3 border-b border-happy-ink-100">
              <div className="flex items-center gap-2.5">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-sm font-bold text-happy-ink-900">Se connecter avec Google</span>
              </div>
              <button
                type="button"
                onClick={() => setGoogleModalOpen(false)}
                className="rounded-lg p-1 text-happy-ink-400 hover:text-happy-ink-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-happy-ink-500 mt-3 mb-4">
              Choisissez un compte Google pour continuer sur <strong className="text-happy-ink-900">HAPPY EVENTS</strong> :
            </p>

            {/* Quick 1-Click Suggested Google Accounts */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  handleSocialAuth("google", {
                    name: "Marc Konan",
                    email: "marc.konan@gmail.com",
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                  })
                }
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-happy-ink-100 hover:bg-happy-sand-50 transition-colors text-left"
              >
                <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  M
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-happy-ink-900 truncate">Marc Konan</p>
                  <p className="text-[11px] text-happy-ink-500 truncate">marc.konan@gmail.com</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSocialAuth("google", {
                    name: "Aminata Diallo",
                    email: "aminata.diallo@gmail.com",
                    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                  })
                }
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-happy-ink-100 hover:bg-happy-sand-50 transition-colors text-left"
              >
                <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-happy-ink-900 truncate">Aminata Diallo</p>
                  <p className="text-[11px] text-happy-ink-500 truncate">aminata.diallo@gmail.com</p>
                </div>
              </button>
            </div>

            {/* Input for custom Google email */}
            <div className="mt-4 pt-3 border-t border-happy-sand-200">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-happy-ink-500 mb-1.5">
                Ou utiliser une autre adresse Google :
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (customGoogleEmail.trim()) {
                    handleSocialAuth("google", {
                      name: customGoogleEmail.split("@")[0].replace(/[._-]/g, " "),
                      email: customGoogleEmail.trim().toLowerCase(),
                    });
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="votre.compte@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="flex-1 h-10 rounded-xl border border-happy-ink-200 bg-white px-3 text-xs text-happy-ink-900 placeholder:text-happy-ink-400 focus:border-happy-coral-500 focus:outline-none"
                  required
                />
                <Button type="submit" variant="primary" size="sm" className="h-10 text-xs px-3">
                  Continuer
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: INTERACTIVE FACEBOOK AUTHENTICATION
         ========================================================================= */}
      {facebookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-happy-ink-100 p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-happy-ink-100">
              <div className="flex items-center gap-2.5">
                <svg className="h-5 w-5 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm font-bold text-happy-ink-900">Connexion avec Facebook</span>
              </div>
              <button
                type="button"
                onClick={() => setFacebookModalOpen(false)}
                className="rounded-lg p-1 text-happy-ink-400 hover:text-happy-ink-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-happy-ink-500 mt-3 mb-4">
              Autorisez <strong className="text-happy-ink-900">HAPPY EVENTS</strong> à accéder à votre profil Facebook :
            </p>

            <button
              type="button"
              onClick={() =>
                handleSocialAuth("facebook", {
                  name: "Marc Konan",
                  email: "marc.konan.fb@facebook.ci",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                })
              }
              className="w-full flex items-center gap-3 p-3 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 transition-colors text-left"
            >
              <div className="h-9 w-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-sm shrink-0">
                f
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-happy-ink-900 truncate">Continuer en tant que Marc Konan</p>
                <p className="text-[11px] text-blue-700 truncate">Compte Facebook vérifié</p>
              </div>
            </button>

            <div className="mt-4 pt-3 border-t border-happy-sand-200">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-happy-ink-500 mb-1.5">
                Ou avec votre email Facebook :
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (customFacebookEmail.trim()) {
                    handleSocialAuth("facebook", {
                      name: customFacebookEmail.split("@")[0].replace(/[._-]/g, " "),
                      email: customFacebookEmail.trim().toLowerCase(),
                    });
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="contact@facebook.com"
                  value={customFacebookEmail}
                  onChange={(e) => setCustomFacebookEmail(e.target.value)}
                  className="flex-1 h-10 rounded-xl border border-happy-ink-200 bg-white px-3 text-xs text-happy-ink-900 placeholder:text-happy-ink-400 focus:border-happy-coral-500 focus:outline-none"
                  required
                />
                <Button type="submit" variant="secondary" size="sm" className="h-10 text-xs px-3">
                  Valider
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
