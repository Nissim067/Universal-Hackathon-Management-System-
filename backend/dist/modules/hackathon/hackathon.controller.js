"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HackathonController = void 0;
const hackathon_service_1 = require("./hackathon.service");
const ApiError_1 = require("../../utils/ApiError");
const hackathonService = new hackathon_service_1.HackathonService();
class HackathonController {
    async getHackathons(req, res, next) {
        try {
            const result = await hackathonService.getHackathons(req.query);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getHackathonById(req, res, next) {
        try {
            const id = req.params.id;
            const hackathon = await hackathonService.getHackathonById(id);
            res.status(200).json({
                success: true,
                data: hackathon,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createHackathon(req, res, next) {
        try {
            if (!req.user) {
                throw new ApiError_1.ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
            }
            const hackathon = await hackathonService.createHackathon(req.body, req.user.userId);
            res.status(201).json({
                success: true,
                data: hackathon,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateHackathon(req, res, next) {
        try {
            if (!req.user) {
                throw new ApiError_1.ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
            }
            const id = req.params.id;
            const hackathon = await hackathonService.updateHackathon(id, req.body, req.user.userId);
            res.status(200).json({
                success: true,
                data: hackathon,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteHackathon(req, res, next) {
        try {
            if (!req.user) {
                throw new ApiError_1.ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
            }
            const id = req.params.id;
            const result = await hackathonService.deleteHackathon(id, req.user.userId);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async registerParticipant(req, res, next) {
        try {
            if (!req.user) {
                throw new ApiError_1.ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
            }
            const id = req.params.id;
            const registration = await hackathonService.registerParticipant(id, req.user.userId);
            res.status(201).json({
                success: true,
                data: registration,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.HackathonController = HackathonController;
