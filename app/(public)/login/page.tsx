"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  Zap,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect") || "/dashboard";
  const redirectPath =
    rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") && !rawRedirect.includes("://")
      ? rawRedirect
      : "/dashboard";

  // Login method: Email is primary default
  const [authMode, setAuthMode] = useState<"email" | "whatsapp">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Email form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // WhatsApp form state
  const [phoneCountry, setPhoneCountry] = useState("+225");
  const [phone, setPhone] = useState("");
  const [whatsappPassword, setWhatsappPassword] = useState("");

  // Social Auth Modals
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [facebookModalOpen, setFacebookModalOpen] = useState(false);
  const [customFacebookEmail, setCustomFacebookEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const identifier =
      authMode === "whatsapp" ? `${phoneCountry} ${phone}`.trim() : email.trim();
    const currentPassword = authMode === "whatsapp" ? whatsappPassword : password;

    if (!identifier) {
      setErrorMsg(
        authMode === "whatsapp"
          ? "Veuillez saisir votre numéro WhatsApp."
          : "Veuillez saisir votre adresse email."
      );
      setIsLoading(false);
      return;
    }

    if (!currentPassword) {
      setErrorMsg("Veuillez saisir votre mot de passe.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          password: currentPassword,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSuccessMsg(
          `Connexion réussie ! Bienvenue ${json.data?.name || ""}. Redirection vers votre espace...`
        );
        setTimeout(() => {
          router.push(redirectPath);
          router.refresh();
        }, 600);
      } else {
        setErrorMsg(json.error?.message || "Identifiants invalides. Veuillez réessayer.");
      }
    } catch (err: any) {
      setErrorMsg("Erreur réseau : " + (err.message || "Impossible de contacter le serveur"));
    } finally {
      setIsLoading(false);
    }
  };

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
          router.push(redirectPath);
          router.refresh();
        }, 500);
      } else {
        setErrorMsg(json.error?.message || "Erreur de connexion sociale.");
      }
    } catch (err: any) {
      setErrorMsg("Erreur réseau : " + (err.message || "Connexion impossible"));
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 bg-gradient-to-b from-happy-sand-100 via-[#FAF8F5] to-white relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[500px] rounded-full bg-gradient-to-tr from-happy-coral-200/30 via-amber-200/20 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Brand Icon */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-happy-coral-500 to-amber-500 text-white shadow-soft group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="h-6 w-6 fill-white/20" />
          </div>
        </Link>

        <h1 className="text-3xl sm:text-4xl font-black text-happy-ink-950 font-display tracking-tight">
          Connexion à votre espace
        </h1>
        <p className="mt-2 text-sm text-happy-ink-600">
          Retrouvez tous vos événements, cartons d&apos;invitation et listes d&apos;invités.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="rounded-3xl border border-happy-ink-100 bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-card">
          {/* Success Banner */}
          {successMsg && (
            <div className="mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center gap-2.5 text-xs font-bold text-emerald-800 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-5 rounded-2xl bg-red-50 border border-red-200 p-3.5 flex items-start gap-2.5 text-xs font-bold text-red-800 animate-fadeIn">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. HERO GOOGLE SOCIAL LOGIN */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setGoogleModalOpen(true)}
              disabled={isLoading || loadingProvider !== null}
              className="w-full h-12 rounded-2xl border-2 border-happy-ink-200 bg-white hover:bg-happy-sand-50/80 active:scale-[0.99] transition-all flex items-center justify-center gap-3 px-4 shadow-2xs group relative overflow-hidden"
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
              <span className="ml-auto text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Rapide
              </span>
            </button>

            {/* Secondary Social Login */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFacebookModalOpen(true)}
                disabled={isLoading || loadingProvider !== null}
                className="h-11 rounded-2xl border border-happy-ink-200 bg-white hover:bg-blue-50/50 hover:border-blue-200 transition-colors flex items-center justify-center gap-2 text-xs font-bold text-happy-ink-800 shadow-2xs"
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
                      setSuccessMsg("Connexion démo réussie !");
                      setTimeout(() => {
                        router.push(redirectPath);
                        router.refresh();
                      }, 400);
                    }
                  } catch {
                    setErrorMsg("Erreur démo");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading || loadingProvider !== null}
                className="h-11 rounded-2xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/70 transition-colors flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900 shadow-2xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Compte Démo</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="my-5 relative flex items-center">
            <div className="flex-grow border-t border-happy-ink-100" />
            <span className="mx-3 text-[11px] font-semibold uppercase tracking-wider text-happy-ink-400">
              Ou par identifiants
            </span>
            <div className="flex-grow border-t border-happy-ink-100" />
          </div>

          {/* Method Tabs: Email vs WhatsApp */}
          <div className="flex rounded-2xl bg-happy-sand-100 p-1 mb-4">
            <button
              type="button"
              onClick={() => {
                setAuthMode("email");
                setErrorMsg("");
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === "email"
                  ? "bg-white text-happy-ink-900 shadow-xs"
                  : "text-happy-ink-600 hover:text-happy-ink-900"
              }`}
            >
              <Mail className="h-3.5 w-3.5 text-happy-coral-500" />
              <span>Email</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("whatsapp");
                setErrorMsg("");
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === "whatsapp"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-happy-ink-600 hover:text-happy-ink-900"
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === "email" ? (
              <>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-happy-ink-700">
                    Adresse email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="votre.email@exemple.ci"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 w-full rounded-2xl border border-happy-ink-200 bg-happy-sand-50/50 pl-10 pr-3.5 text-sm text-happy-ink-900 placeholder:text-happy-ink-400 focus:border-happy-coral-500 focus:bg-white focus:ring-2 focus:ring-happy-coral-500/20 focus:outline-none transition-all"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-happy-ink-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-happy-ink-700">
                      Mot de passe
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        alert("Contactez le support pour réinitialiser vos identifiants.")
                      }
                      className="text-xs text-happy-coral-600 hover:underline font-medium"
                    >
                      Oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 w-full rounded-2xl border border-happy-ink-200 bg-happy-sand-50/50 pl-10 pr-10 text-sm text-happy-ink-900 placeholder:text-happy-ink-400 focus:border-happy-coral-500 focus:bg-white focus:ring-2 focus:ring-happy-coral-500/20 focus:outline-none transition-all"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-happy-ink-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-happy-ink-400 hover:text-happy-ink-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-happy-ink-700">
                    Numéro WhatsApp
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={phoneCountry}
                      onChange={(e) => setPhoneCountry(e.target.value)}
                      className="h-11 rounded-2xl border border-happy-ink-200 bg-happy-sand-50 px-3 text-xs font-bold text-happy-ink-800 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="+225">🇨🇮 +225</option>
                      <option value="+221">🇸🇳 +221</option>
                      <option value="+229">🇧🇯 +229</option>
                      <option value="+228">🇹🇬 +228</option>
                      <option value="+237">🇨🇲 +237</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+1">🇺🇸 +1</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="07 00 11 22 33"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="flex-1 h-11 rounded-2xl border border-happy-ink-200 bg-happy-sand-50/50 px-3.5 text-sm text-happy-ink-900 placeholder:text-happy-ink-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-happy-ink-700">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={whatsappPassword}
                      onChange={(e) => setWhatsappPassword(e.target.value)}
                      required
                      className="h-11 w-full rounded-2xl border border-happy-ink-200 bg-happy-sand-50/50 pl-10 pr-10 text-sm text-happy-ink-900 placeholder:text-happy-ink-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-happy-ink-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-happy-ink-400 hover:text-happy-ink-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <Button
              type="submit"
              variant={authMode === "whatsapp" ? "whatsapp" : "primary"}
              className="w-full h-12 text-sm mt-2 shadow-soft font-bold rounded-2xl"
              disabled={isLoading || loadingProvider !== null}
              rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" /> : undefined}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          {/* Switch to Register */}
          <div className="mt-5 pt-4 border-t border-happy-sand-200/80 text-center text-xs text-happy-ink-600">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-bold text-happy-coral-600 hover:text-happy-coral-700 hover:underline"
            >
              Créer un compte gratuitement
            </Link>
          </div>
        </div>
      </div>

      {/* Google Modal */}
      {googleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-happy-ink-100 p-6 shadow-2xl animate-scaleUp">
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
              Sélectionnez un compte Google pour vous connecter à <strong className="text-happy-ink-900">HAPPY EVENTS</strong> :
            </p>

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

            <div className="mt-4 pt-3 border-t border-happy-sand-200">
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
                  Connexion
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Facebook Modal */}
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
              Connexion instantanée via votre compte Facebook vérifié :
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
