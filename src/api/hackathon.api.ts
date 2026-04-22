import axiosClient from './axiosClient';
import type { Hackathon } from '../types';

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

/** GET /hackathons — list all with optional filters */
export async function getHackathons(filters?: HackathonFilters): Promise<HackathonListResponse> {
  const { data } = await axiosClient.get('/hackathons', { params: filters });
  return data;
}

/** GET /hackathons/:id — get single hackathon */
export async function getHackathonById(id: string): Promise<Hackathon> {
  const { data } = await axiosClient.get(`/hackathons/${id}`);
  return data;
}

/** POST /hackathons — create hackathon (organizer only) */
export async function createHackathon(payload: CreateHackathonPayload): Promise<Hackathon> {
  const { data } = await axiosClient.post('/hackathons', payload);
  return data;
}

/** PUT /hackathons/:id — update hackathon */
export async function updateHackathon(id: string, payload: Partial<CreateHackathonPayload>): Promise<Hackathon> {
  const { data } = await axiosClient.put(`/hackathons/${id}`, payload);
  return data;
}

/** DELETE /hackathons/:id — delete hackathon */
export async function deleteHackathon(id: string): Promise<void> {
  await axiosClient.delete(`/hackathons/${id}`);
}

/** POST /hackathons/:id/register — register as participant */
export async function registerForHackathon(id: string): Promise<void> {
  await axiosClient.post(`/hackathons/${id}/register`);
}
