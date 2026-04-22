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

export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
  currency: string;
}
