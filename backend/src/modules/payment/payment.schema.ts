import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  body: z.object({
    hackathonId: z.string().cuid('Invalid hackathon ID'),
  }),
});

export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>['body'];
