import axiosClient from './axiosClient';
import type { User, RegisterPayload, LoginPayload } from '../types';

/** POST /auth/register */
export async function registerUser(payload: RegisterPayload): Promise<User> {
  const { data } = await axiosClient.post('/auth/register', payload);
  return data;
}

/** POST /auth/login — sets httpOnly cookie */
export async function loginUser(payload: LoginPayload): Promise<User> {
  const { data } = await axiosClient.post('/auth/login', payload);
  return data;
}

/** POST /auth/logout — clears cookie */
export async function logoutUser(): Promise<void> {
  await axiosClient.post('/auth/logout');
}

/** GET /auth/me — get current user from session cookie */
export async function getCurrentUser(): Promise<User> {
  const { data } = await axiosClient.get('/auth/me');
  return data;
}
