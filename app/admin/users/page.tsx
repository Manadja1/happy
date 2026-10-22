"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  UserCheck,
  Calendar,
  Trash2,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [actionMsg, setActionMsg] = useState("");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (json.success) {
        setUsers(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (userId: string, currentRole: string) => {
    setIsUpdating(userId);
    const newRole = currentRole === "ADMIN" ? "OWNER" : "ADMIN";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMsg(`Rôle modifié : ${newRole}`);
        fetchUsers();
        setTimeout(() => setActionMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`Supprimer définitivement l'utilisateur « ${name} » et tous ses événements ?`)) {
      return;
    }
    setIsUpdating(userId);
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setActionMsg(`Utilisateur supprimé.`);
        fetchUsers();
        setTimeout(() => setActionMsg(""), 3000);
      } else {
        alert(json.error?.message || "Impossible de supprimer cet utilisateur.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.phone && u.phone.includes(searchQuery));
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-happy-ink-800">
        <div>
          <h1 className="text-2xl font-black font-display text-white">
            Annuaire des Organisateurs & Rôles
          </h1>
          <p className="text-xs text-happy-ink-400 mt-1">
            Gérez tous les comptes inscrits sur HAPPY EVENTS et attribuez les privilèges d&apos;administration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchUsers}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            className="text-xs bg-happy-ink-900 border-happy-ink-700 text-white"
          >
            Actualiser
          </Button>
        </div>
      </div>

      {/* Action Notification */}
      {actionMsg && (
        <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 rounded-2xl border border-happy-ink-800 bg-happy-ink-900/60 pl-10 pr-4 text-xs text-white placeholder:text-happy-ink-500 focus:border-happy-coral-500 focus:outline-none"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-happy-ink-500" />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {["ALL", "ADMIN", "OWNER"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                roleFilter === role
                  ? "bg-happy-coral-500 text-white"
                  : "bg-happy-ink-900 text-happy-ink-400 hover:text-white"
              }`}
            >
              {role === "ALL" ? "Tous" : role === "ADMIN" ? "Administrateurs" : "Organisateurs"}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl border border-happy-ink-800 bg-happy-ink-900/40 overflow-hidden backdrop-blur-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-happy-ink-400">
            Chargement de la liste des organisateurs...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-happy-ink-400">
            Aucun utilisateur ne correspond à votre recherche.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-happy-ink-950/60 border-b border-happy-ink-800 text-[11px] font-bold uppercase tracking-wider text-happy-ink-400">
                <tr>
                  <th className="py-3.5 px-4">Utilisateur</th>
                  <th className="py-3.5 px-4">Coordonnées</th>
                  <th className="py-3.5 px-4">Rôle</th>
                  <th className="py-3.5 px-4">Événements</th>
                  <th className="py-3.5 px-4">Inscrit le</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-happy-ink-800/60 text-happy-ink-300">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-happy-ink-800/30 transition-colors">
                    {/* User Profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-happy-ink-800 border border-happy-ink-700 flex items-center justify-center font-bold text-xs text-white shrink-0 overflow-hidden">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name} className="h-full w-full object-cover" />
                          ) : (
                            u.name?.[0] || u.email[0].toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{u.name || "Sans nom"}</p>
                          <p className="text-[10px] text-happy-ink-500 font-mono">ID: {u.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <p className="text-xs text-happy-ink-200 flex items-center gap-1.5">
                          <Mail className="h-3 w-3 text-happy-coral-400" />
                          <span>{u.email}</span>
                        </p>
                        {u.phone && (
                          <p className="text-[11px] text-happy-ink-400 flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-emerald-400" />
                            <span>{u.phone}</span>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3 px-4">
                      {u.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-[10px] font-bold text-red-400">
                          <ShieldAlert className="h-3 w-3" />
                          ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-happy-ink-800 border border-happy-ink-700 text-[10px] font-bold text-happy-ink-300">
                          <UserCheck className="h-3 w-3 text-happy-coral-400" />
                          ORGANISATEUR
                        </span>
                      )}
                    </td>

                    {/* Events Count */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-happy-ink-800 text-xs font-bold text-white">
                        <Calendar className="h-3 w-3 text-happy-coral-400" />
                        {u.eventsCount || 0}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-happy-ink-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Role Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleRole(u.id, u.role)}
                          disabled={isUpdating === u.id}
                          className="text-[11px] h-8 px-2.5 text-amber-400 hover:text-amber-300 hover:bg-amber-950/50"
                        >
                          {u.role === "ADMIN" ? "Rétrograder" : "Promouvoir Admin"}
                        </Button>

                        {/* Delete User */}
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name || u.email)}
                          disabled={isUpdating === u.id}
                          className="p-1.5 rounded-lg text-happy-ink-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                          title="Supprimer l'utilisateur"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
