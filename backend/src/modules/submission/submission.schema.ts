import { z } from 'zod';

export const createSubmissionSchema = z.object({
  body: z.object({
    hackathonId: z.string().cuid('Invalid hackathon ID'),
    teamId: z.string().cuid('Invalid team ID'),
    projectTitle: z.string().min(3, 'Project title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    repoUrl: z.string().url('Invalid repository URL').optional(),
    demoUrl: z.string().url('Invalid demo URL').optional(),
  }),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>['body'];
