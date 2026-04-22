"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamController = void 0;
const team_service_1 = require("./team.service");
const ApiError_1 = require("../../utils/ApiError");
const teamService = new team_service_1.TeamService();
class TeamController {
    async createTeam(req, res, next) {
        try {
            if (!req.user) {
                throw new ApiError_1.ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
            }
            const team = await teamService.createTeam(req.body, req.user.userId);
            res.status(201).json({
                success: true,
                data: team,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getTeamById(req, res, next) {
        try {
            const id = req.params.id;
            const team = await teamService.getTeamById(id);
            // Don't expose invite token to non-members
            const isMember = req.user && team.members.some(m => m.userId === req.user?.userId);
            if (!isMember) {
                team.inviteToken = undefined;
            }
            res.status(200).json({
                success: true,
                data: team,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async inviteMember(req, res, next) {
        try {
            if (!req.user) {
                throw new ApiError_1.ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
            }
            const id = req.params.id;
            const result = await teamService.inviteMember(id, req.body, req.user.userId);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async joinTeam(req, res, next) {
        try {
            if (!req.user) {
                throw new ApiError_1.ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
            }
            const result = await teamService.joinTeam(req.body, req.user.userId);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TeamController = TeamController;
