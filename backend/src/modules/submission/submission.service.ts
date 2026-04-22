import { db } from '../../config/db';
import { ApiError } from '../../utils/ApiError';
import { CreateSubmissionInput } from './submission.schema';

export class SubmissionService {
  async createSubmission(data: CreateSubmissionInput, userId: string) {
    // Verify hackathon exists and is active/upcoming
    const hackathon = await db.hackathon.findUnique({
      where: { id: data.hackathonId },
    });

    if (!hackathon) {
      throw new ApiError(404, 'Hackathon not found', 'HACKATHON_NOT_FOUND');
    }

    // Verify team exists and user is part of it
    const team = await db.team.findUnique({
      where: { id: data.teamId },
      include: { members: true },
    });

    if (!team || team.hackathonId !== data.hackathonId) {
      throw new ApiError(404, 'Team not found in this hackathon', 'TEAM_NOT_FOUND');
    }

    const isMember = team.members.some((m) => m.userId === userId);
    if (!isMember) {
      throw new ApiError(403, 'You must be a member of the team to submit', 'FORBIDDEN');
    }

    // Check if team already submitted
    const existingSubmission = await db.submission.findUnique({
      where: { teamId: data.teamId },
    });

    if (existingSubmission) {
      throw new ApiError(409, 'Team has already submitted a project', 'DUPLICATE_SUBMISSION');
    }

    // Create submission
    const submission = await db.submission.create({
      data: {
        ...data,
        userId,
      },
    });

    return submission;
  }

  async getSubmissionsByHackathonId(hackathonId: string) {
    const submissions = await db.submission.findMany({
      where: { hackathonId },
      include: {
        team: {
          select: { id: true, name: true },
        },
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return submissions;
  }
}
