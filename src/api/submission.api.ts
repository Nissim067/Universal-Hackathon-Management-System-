import axiosClient from './axiosClient';
import type { Submission } from '../types';

export interface CreateSubmissionPayload {
  hackathonId: string;
  teamId: string;
  title: string;
  description: string;
  projectUrl?: string;
  demoVideoUrl?: string;
}

/** POST /submissions — submit project */
export async function createSubmission(payload: CreateSubmissionPayload): Promise<Submission> {
  const { data } = await axiosClient.post('/submissions', payload);
  return data;
}

/** GET /submissions/:hackathonId — get submissions for a hackathon */
export async function getSubmissionsByHackathon(hackathonId: string): Promise<Submission[]> {
  const { data } = await axiosClient.get(`/submissions/${hackathonId}`);
  return data;
}
