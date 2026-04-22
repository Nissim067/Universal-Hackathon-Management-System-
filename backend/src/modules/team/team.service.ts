import { db } from '../../config/db';
import { ApiError } from '../../utils/ApiError';
import { CreateTeamInput, InviteMemberInput, JoinTeamInput } from './team.schema';
import { sendEmail } from '../../utils/sendEmail';
import { env } from '../../config/env';

export class TeamService {
  async createTeam(data: CreateTeamInput, userId: string) {
    const hackathon = await db.hackathon.findUnique({
      where: { id: data.hackathonId },
    });

    if (!hackathon) {
      throw new ApiError(404, 'Hackathon not found', 'HACKATHON_NOT_FOUND');
    }

    // Check if user is registered for the hackathon
    const registration = await db.registration.findUnique({
      where: {
        userId_hackathonId: {
          userId,
          hackathonId: data.hackathonId,
        },
      },
    });

    if (!registration) {
      throw new ApiError(403, 'You must register for the hackathon before creating a team', 'NOT_REGISTERED');
    }

    // Check if user is already in a team for this hackathon
    const existingTeamMember = await db.teamMember.findFirst({
      where: {
        userId,
        team: {
          hackathonId: data.hackathonId,
        },
      },
    });

    if (existingTeamMember) {
      throw new ApiError(409, 'You are already in a team for this hackathon', 'ALREADY_IN_TEAM');
    }

    const team = await db.team.create({
      data: {
        name: data.name,
        hackathonId: data.hackathonId,
        members: {
          create: {
            userId,
            role: 'LEADER',
          },
        },
      },
      include: {
        members: true,
      },
    });

    return team;
  }

  async getTeamById(teamId: string) {
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        hackathon: {
          select: { id: true, title: true },
        },
      },
    });

    if (!team) {
      throw new ApiError(404, 'Team not found', 'TEAM_NOT_FOUND');
    }

    return team;
  }

  async inviteMember(teamId: string, data: InviteMemberInput, userId: string) {
    const team = await this.getTeamById(teamId);

    const leader = team.members.find((m) => m.userId === userId && m.role === 'LEADER');
    if (!leader) {
      throw new ApiError(403, 'Only team leaders can invite members', 'FORBIDDEN');
    }

    // In a real app, you might want to create a separate Invite model
    // Here we use the inviteToken stored on the team to construct a link
    const inviteLink = `${env.FRONTEND_URL}/join-team?token=${team.inviteToken}`;

    const emailSubject = `You have been invited to join team ${team.name}`;
    const emailHtml = `
      <p>Hello,</p>
      <p>You have been invited to join the team <strong>${team.name}</strong> for the hackathon <strong>${team.hackathon.title}</strong>.</p>
      <p>Click the link below to join:</p>
      <a href="${inviteLink}">Join Team</a>
      <p>Or use this code: ${team.inviteToken}</p>
    `;

    await sendEmail(data.email, emailSubject, '', emailHtml);

    return { message: 'Invitation sent successfully' };
  }

  async joinTeam(data: JoinTeamInput, userId: string) {
    const team = await db.team.findUnique({
      where: { inviteToken: data.inviteToken },
      include: { hackathon: true },
    });

    if (!team) {
      throw new ApiError(404, 'Invalid invite token', 'INVALID_TOKEN');
    }

    // Check if user is registered for the hackathon
    const registration = await db.registration.findUnique({
      where: {
        userId_hackathonId: {
          userId,
          hackathonId: team.hackathonId,
        },
      },
    });

    if (!registration) {
      throw new ApiError(403, 'You must register for the hackathon before joining a team', 'NOT_REGISTERED');
    }

    // Check if user is already in a team for this hackathon
    const existingTeamMember = await db.teamMember.findFirst({
      where: {
        userId,
        team: {
          hackathonId: team.hackathonId,
        },
      },
    });

    if (existingTeamMember) {
      throw new ApiError(409, 'You are already in a team for this hackathon', 'ALREADY_IN_TEAM');
    }

    const teamMember = await db.teamMember.create({
      data: {
        userId,
        teamId: team.id,
        role: 'MEMBER',
      },
    });

    return teamMember;
  }
}
