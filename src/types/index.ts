/* ── Domain Models ── */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'participant' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Hackathon {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  prizePool: number;
  participantCount: number;
  tags: string[];
  registrationFee: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  organizerId: string;
}

export interface Team {
  id: string;
  name: string;
  hackathonId: string;
  leaderId: string;
  members: User[];
  createdAt: string;
}

export interface Submission {
  id: string;
  hackathonId: string;
  teamId: string;
  title: string;
  description: string;
  projectUrl?: string;
  demoVideoUrl?: string;
  createdAt: string;
}

/* ── Auth Payloads ── */

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'organizer' | 'participant';
}

export interface LoginPayload {
  email: string;
  password: string;
}

/* ── Hackathon Payloads & Responses ── */

export interface HackathonFilters {
  status?: 'upcoming' | 'ongoing' | 'completed';
  page?: number;
  limit?: number;
}

export interface HackathonListResponse {
  hackathons: Hackathon[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateHackathonPayload {
  title: string;
  description: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  prizePool: number;
  tags: string[];
  registrationFee: number;
}

/* ── Team Payloads ── */

export interface CreateTeamPayload {
  name: string;
  hackathonId: string;
}

export interface InviteMemberPayload {
  email: string;
}

export interface JoinTeamPayload {
  token: string;
}

/* ── Submission Payloads ── */

export interface CreateSubmissionPayload {
  hackathonId: string;
  teamId: string;
  title: string;
  description: string;
  projectUrl?: string;
  demoVideoUrl?: string;
}

/* ── Payment Types ── */

export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface PaymentStatus {
  paid: boolean;
  amount: number;
  currency: string;
  paidAt?: string;
}
