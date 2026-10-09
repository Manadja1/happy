/**
 * HAPPY EVENTS — Core TypeScript domain types & enumerations
 */

export type UserRole =
  | "OWNER"
  | "MANAGER"
  | "CHECKIN_AGENT"
  | "GUEST"
  | "ADMIN"
  | "VENDOR";

export type EventType =
  | "BIRTHDAY"
  | "WEDDING"
  | "BAPTISM"
  | "BABY_SHOWER"
  | "DOT"
  | "GRADUATION"
  | "COMMUNION"
  | "CORPORATE"
  | "OTHER";

export type EventStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "COMPLETED"
  | "CANCELLED";

export type RsvpStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DECLINED";

export type MediaType = "IMAGE" | "VIDEO";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface User {
  id: string;
  name: string | null;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  ownerId: string;
  name: string;
  type: EventType;
  description?: string | null;
  date: Date;
  startTime?: string | null;
  endTime?: string | null;
  timezone: string;
  venue?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  coverImage?: string | null;
  theme?: string | null;
  slug: string;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guest {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  email?: string | null;
  group?: string | null;
  isVip: boolean;
  plusOneAllowed: boolean;
  plusOneCount: number;
  rsvpStatus: RsvpStatus;
  qrToken: string;
  checkedIn: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RSVP {
  id: string;
  eventId: string;
  guestId: string;
  status: RsvpStatus;
  attendeeCount: number;
  dietaryPreference?: string | null;
  message?: string | null;
  respondedAt: Date;
}

export interface Invitation {
  id: string;
  eventId: string;
  templateId: string;
  title: string;
  content: string;
  themeConfig?: Record<string, unknown> | null;
  published: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Checkin {
  id: string;
  eventId: string;
  guestId: string;
  checkedInAt: Date;
  checkedInBy: string;
}

export interface Media {
  id: string;
  eventId: string;
  uploadedBy: string;
  type: MediaType;
  url: string;
  caption?: string | null;
  createdAt: Date;
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  description?: string | null;
  assignedTo?: string | null;
  dueDate?: Date | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
}

/**
 * Event statistics summary for Organizers
 */
export interface EventStats {
  totalGuests: number;
  confirmedGuests: number;
  pendingGuests: number;
  declinedGuests: number;
  totalAttendees: number;
  checkedInCount: number;
  responseRate: number;
  checkinRate: number;
}
