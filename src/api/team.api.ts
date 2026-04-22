import axiosClient from './axiosClient';
import type { Team } from '../types';

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

/** POST /teams — create team */
export async function createTeam(payload: CreateTeamPayload): Promise<Team> {
  const { data } = await axiosClient.post('/teams', payload);
  return data;
}

/** GET /teams/:id — get team details */
export async function getTeamById(id: string): Promise<Team> {
  const { data } = await axiosClient.get(`/teams/${id}`);
  return data;
}

/** POST /teams/:id/invite — invite member by email */
export async function inviteTeamMember(teamId: string, payload: InviteMemberPayload): Promise<void> {
  await axiosClient.post(`/teams/${teamId}/invite`, payload);
}

/** POST /teams/:id/join — join via invite token */
export async function joinTeam(teamId: string, payload: JoinTeamPayload): Promise<void> {
  await axiosClient.post(`/teams/${teamId}/join`, payload);
}
