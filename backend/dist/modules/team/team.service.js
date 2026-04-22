"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamService = void 0;
const db_1 = require("../../config/db");
const ApiError_1 = require("../../utils/ApiError");
const sendEmail_1 = require("../../utils/sendEmail");
const env_1 = require("../../config/env");
class TeamService {
    async createTeam(data, userId) {
        const hackathon = await db_1.db.hackathon.findUnique({
            where: { id: data.hackathonId },
        });
        if (!hackathon) {
            throw new ApiError_1.ApiError(404, 'Hackathon not found', 'HACKATHON_NOT_FOUND');
        }
        // Check if user is registered for the hackathon
        const registration = await db_1.db.registration.findUnique({
            where: {
                userId_hackathonId: {
                    userId,
                    hackathonId: data.hackathonId,
                },
            },
        });
        if (!registration) {
            throw new ApiError_1.ApiError(403, 'You must register for the hackathon before creating a team', 'NOT_REGISTERED');
        }
        // Check if user is already in a team for this hackathon
        const existingTeamMember = await db_1.db.teamMember.findFirst({
            where: {
                userId,
                team: {
                    hackathonId: data.hackathonId,
                },
            },
        });
        if (existingTeamMember) {
            throw new ApiError_1.ApiError(409, 'You are already in a team for this hackathon', 'ALREADY_IN_TEAM');
        }
        const team = await db_1.db.team.create({
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
    async getTeamById(teamId) {
        const team = await db_1.db.team.findUnique({
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
            throw new ApiError_1.ApiError(404, 'Team not found', 'TEAM_NOT_FOUND');
        }
        return team;
    }
    async inviteMember(teamId, data, userId) {
        const team = await this.getTeamById(teamId);
        const leader = team.members.find((m) => m.userId === userId && m.role === 'LEADER');
        if (!leader) {
            throw new ApiError_1.ApiError(403, 'Only team leaders can invite members', 'FORBIDDEN');
        }
        // In a real app, you might want to create a separate Invite model
        // Here we use the inviteToken stored on the team to construct a link
        const inviteLink = `${env_1.env.FRONTEND_URL}/join-team?token=${team.inviteToken}`;
        const emailSubject = `You have been invited to join team ${team.name}`;
        const emailHtml = `
      <p>Hello,</p>
      <p>You have been invited to join the team <strong>${team.name}</strong> for the hackathon <strong>${team.hackathon.title}</strong>.</p>
      <p>Click the link below to join:</p>
      <a href="${inviteLink}">Join Team</a>
      <p>Or use this code: ${team.inviteToken}</p>
    `;
        await (0, sendEmail_1.sendEmail)(data.email, emailSubject, '', emailHtml);
        return { message: 'Invitation sent successfully' };
    }
    async joinTeam(data, userId) {
        const team = await db_1.db.team.findUnique({
            where: { inviteToken: data.inviteToken },
            include: { hackathon: true },
        });
        if (!team) {
            throw new ApiError_1.ApiError(404, 'Invalid invite token', 'INVALID_TOKEN');
        }
        // Check if user is registered for the hackathon
        const registration = await db_1.db.registration.findUnique({
            where: {
                userId_hackathonId: {
                    userId,
                    hackathonId: team.hackathonId,
                },
            },
        });
        if (!registration) {
            throw new ApiError_1.ApiError(403, 'You must register for the hackathon before joining a team', 'NOT_REGISTERED');
        }
        // Check if user is already in a team for this hackathon
        const existingTeamMember = await db_1.db.teamMember.findFirst({
            where: {
                userId,
                team: {
                    hackathonId: team.hackathonId,
                },
            },
        });
        if (existingTeamMember) {
            throw new ApiError_1.ApiError(409, 'You are already in a team for this hackathon', 'ALREADY_IN_TEAM');
        }
        const teamMember = await db_1.db.teamMember.create({
            data: {
                userId,
                teamId: team.id,
                role: 'MEMBER',
            },
        });
        return teamMember;
    }
}
exports.TeamService = TeamService;
