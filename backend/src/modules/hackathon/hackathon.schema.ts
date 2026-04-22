import { z } from 'zod';
import { HackathonStatus } from '@prisma/client';

export const createHackathonSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    coverImageUrl: z.string().url().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    registrationDeadline: z.string().datetime(),
    prizePool: z.number().nonnegative().optional(),
    registrationFee: z.number().nonnegative().default(0),
    maxParticipants: z.number().int().positive().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const updateHackathonSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    coverImageUrl: z.string().url().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    registrationDeadline: z.string().datetime().optional(),
    prizePool: z.number().nonnegative().optional(),
    registrationFee: z.number().nonnegative().optional(),
    maxParticipants: z.number().int().positive().optional(),
    status: z.nativeEnum(HackathonStatus).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const getHackathonsQuerySchema = z.object({
  query: z.object({
    status: z.nativeEnum(HackathonStatus).optional(),
    page: z.string().regex(/^\d+$/).default('1').transform(Number),
    limit: z.string().regex(/^\d+$/).default('10').transform(Number),
    search: z.string().optional(),
  }),
});

export type CreateHackathonInput = z.infer<typeof createHackathonSchema>['body'];
export type UpdateHackathonInput = z.infer<typeof updateHackathonSchema>['body'];
export type GetHackathonsQuery = z.infer<typeof getHackathonsQuerySchema>['query'];
