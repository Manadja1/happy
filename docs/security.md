# Politique de Sécurité & Contrôle d'Accès — HAPPY EVENTS

## 1. Règle Critique Absolue (#10)

> **Un utilisateur ne doit JAMAIS pouvoir accéder à l'événement d'un autre utilisateur simplement en modifiant un `eventId` ou un `guestId` dans une URL ou une requête.**

### Exemple Formellement Interdit
Un utilisateur connecté avec l'ID `usr_123` ouvre :
`/dashboard/events/evt_999`
Si `evt_999` appartient à `usr_456`, le système doit immédiatement renvoyer une erreur `403 Forbidden` ou `404 Not Found`.

## 2. Pipeline d'Autorisation Serveur Obligatoire

Chaque action sensible (mutation, affichage de données privées, suppression) doit impérativement respecter la chaîne suivante, exécutée exclusivement côté serveur :

```
AUTHENTICATED USER
       ↓
AUTHORIZATION CONTEXT
       ↓
EVENT OWNERSHIP / DELEGATION CHECK
       ↓
INPUT VALIDATION (Zod / Sanitization)
       ↓
EXECUTION METIER
       ↓
STRUCTURED AUDIT LOG
```

### Règles d'Inviolabilité
1. **Ne jamais faire confiance aux identifiants envoyés par le client** : L'ID utilisateur doit toujours être extrait de la session cryptographique vérifiée côté serveur (JWT signé ou session HTTP-only cookie).
2. **Ne jamais faire confiance aux paramètres d'URL** : Tout `[id]` ou `[slug]` doit être vérifié en base pour s'assurer qu'il appartient bien à l'utilisateur courant avant tout traitement.
3. **Contrôle d'accès basé sur les Rôles (RBAC)** :
   - `OWNER` : Plein pouvoir sur ses propres événements.
   - `MANAGER` : Accès aux événements sur lesquels des permissions explicites lui ont été accordées.
   - `CHECKIN_AGENT` : Accès strictement restreint à l'endpoint et l'interface de validation des QR codes pour l'événement désigné.
   - `GUEST` : Accès uniquement aux données publiques via `/e/[slug]` et soumission de son propre RSVP.
   - `ADMIN` : Supervision technique globale.
   - `VENDOR` : Accès limité aux demandes de devis futures.

## 3. Sécurité des QR Codes (Happy Check-in)

- Chaque invité possède un `qrToken` cryptographiquement unique (UUID v4 ou CUID).
- Le scan à l'entrée effectue une vérification transactionnelle atomique pour empêcher le **double check-in** (attaques par rejeu de capture d'écran).
- Dès qu'un invité est scanné, son statut passe à `checkedIn = true` et un enregistrement `Checkin` est créé avec horodatage et identifiant de l'agent.

## 4. Protection des Données & Secrets

- Aucune clé secrète dans le frontend (absence de `NEXT_PUBLIC_` sur les secrets d'API).
- Protection CSRF native avec les Server Actions Next.js.
- Validation des uploads (taille et types MIME autorisés : `image/jpeg`, `image/png`, `image/webp`).
