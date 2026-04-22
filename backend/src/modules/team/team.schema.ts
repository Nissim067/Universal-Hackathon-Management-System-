import { z } from 'zod';

export const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Team name must be at least 2 characters'),
    hackathonId: z.string().cuid('Invalid hackathon ID'),
  }),
});

export const inviteMemberSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const joinTeamSchema = z.object({
  body: z.object({
    inviteToken: z.string().min(1, 'Invite token is required'),
  }),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>['body'];
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>['body'];
export type JoinTeamInput = z.infer<typeof joinTeamSchema>['body'];
