# Spécification API & Server Actions — HAPPY EVENTS

## 1. Conventions de Communication

HAPPY EVENTS utilise principalement les **Server Actions Next.js** pour les mutations authentifiées et des **Endpoints REST (`/app/api/...`)** pour les intégrations tierces (Webhooks WhatsApp, Webhooks Mobile Money, vérifications QR en temps réel).

## 2. Format Normalisé des Réponses

Toute action ou route d'API renvoie une enveloppe cohérente :

```typescript
export type ApiResponse<T = unknown> =
  | {
      success: true;
      data: T;
      message?: string;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details?: unknown;
      };
    };
```

## 3. Principaux Endpoints & Actions Prévus

### Événements
- `createEvent(data: CreateEventInput): Promise<ApiResponse<Event>>`
- `updateEvent(eventId: string, data: UpdateEventInput): Promise<ApiResponse<Event>>`
- `getEventBySlug(slug: string): Promise<ApiResponse<PublicEventDTO>>`
- `deleteEvent(eventId: string): Promise<ApiResponse<void>>`

### Invités (Happy Guests)
- `addGuest(eventId: string, data: CreateGuestInput): Promise<ApiResponse<Guest>>`
- `importGuestsCsv(eventId: string, csvData: string): Promise<ApiResponse<ImportSummary>>`
- `updateGuest(guestId: string, data: Partial<Guest>): Promise<ApiResponse<Guest>>`
- `deleteGuest(guestId: string): Promise<ApiResponse<void>>`

### RSVP & Invité Public
- `submitPublicRsvp(slug: string, data: RsvpSubmissionInput): Promise<ApiResponse<RsvpConfirmation>>`

### Check-in & Accès (Happy Check-in)
- `verifyQrToken(qrToken: string): Promise<ApiResponse<CheckinResult>>`
- `confirmCheckin(guestId: string, eventId: string): Promise<ApiResponse<Checkin>>`

### Webhooks
- `POST /api/webhooks/whatsapp` : Réception des statuts de livraison et réponses WhatsApp.
- `POST /api/webhooks/payments` : Notifications de paiement Wave, Orange Money, MTN MoMo.
