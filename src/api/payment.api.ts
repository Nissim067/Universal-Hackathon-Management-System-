import axiosClient from './axiosClient';
import type { PaymentIntentResponse } from '../types';

export interface PaymentStatus {
  paid: boolean;
  amount: number;
  currency: string;
  paidAt?: string;
}

/** POST /payments/create-intent — create a Stripe PaymentIntent */
export async function createPaymentIntent(hackathonId: string): Promise<PaymentIntentResponse> {
  const { data } = await axiosClient.post('/payments/create-intent', { hackathonId });
  return data;
}

/** GET /payments/status/:hackathonId — check payment status for the current user */
export async function getPaymentStatus(hackathonId: string): Promise<PaymentStatus> {
  const { data } = await axiosClient.get(`/payments/status/${hackathonId}`);
  return data;
}

// ⚠️ POST /payments/webhook — Backend only. Never call from frontend.
