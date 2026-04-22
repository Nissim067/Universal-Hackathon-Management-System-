"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HackathonService = void 0;
const db_1 = require("../../config/db");
const ApiError_1 = require("../../utils/ApiError");
class HackathonService {
    async getHackathons(query) {
        const { status, page, limit, search } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (search) {
            where.title = { contains: search, mode: 'insensitive' };
        }
        const [hackathons, total] = await Promise.all([
            db_1.db.hackathon.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    organizer: {
                        select: { id: true, name: true, email: true },
                    },
                },
            }),
            db_1.db.hackathon.count({ where }),
        ]);
        return {
            hackathons,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getHackathonById(id) {
        const hackathon = await db_1.db.hackathon.findUnique({
            where: { id },
            include: {
                organizer: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { registrations: true, teams: true, submissions: true },
                },
            },
        });
        if (!hackathon) {
            throw new ApiError_1.ApiError(404, 'Hackathon not found', 'HACKATHON_NOT_FOUND');
        }
        return hackathon;
    }
    async createHackathon(data, organizerId) {
        const hackathon = await db_1.db.hackathon.create({
            data: {
                ...data,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                registrationDeadline: new Date(data.registrationDeadline),
                organizerId,
            },
        });
        return hackathon;
    }
    async updateHackathon(id, data, userId) {
        const hackathon = await this.getHackathonById(id);
        if (hackathon.organizerId !== userId) {
            throw new ApiError_1.ApiError(403, 'You are not authorized to update this hackathon', 'FORBIDDEN');
        }
        const updateData = { ...data };
        if (data.startDate)
            updateData.startDate = new Date(data.startDate);
        if (data.endDate)
            updateData.endDate = new Date(data.endDate);
        if (data.registrationDeadline)
            updateData.registrationDeadline = new Date(data.registrationDeadline);
        const updatedHackathon = await db_1.db.hackathon.update({
            where: { id },
            data: updateData,
        });
        return updatedHackathon;
    }
    async deleteHackathon(id, userId) {
        const hackathon = await this.getHackathonById(id);
        if (hackathon.organizerId !== userId) {
            throw new ApiError_1.ApiError(403, 'You are not authorized to delete this hackathon', 'FORBIDDEN');
        }
        await db_1.db.hackathon.delete({
            where: { id },
        });
        return { message: 'Hackathon deleted successfully' };
    }
    async registerParticipant(hackathonId, userId) {
        const hackathon = await this.getHackathonById(hackathonId);
        if (hackathon.registrationFee > 0) {
            throw new ApiError_1.ApiError(402, 'Payment required for this hackathon', 'PAYMENT_REQUIRED');
        }
        const now = new Date();
        if (now > hackathon.registrationDeadline) {
            throw new ApiError_1.ApiError(400, 'Registration deadline has passed', 'REGISTRATION_CLOSED');
        }
        if (hackathon.maxParticipants) {
            const currentRegistrations = await db_1.db.registration.count({
                where: { hackathonId },
            });
            if (currentRegistrations >= hackathon.maxParticipants) {
                throw new ApiError_1.ApiError(400, 'Hackathon is at full capacity', 'HACKATHON_FULL');
            }
        }
        const existingRegistration = await db_1.db.registration.findUnique({
            where: {
                userId_hackathonId: {
                    userId,
                    hackathonId,
                },
            },
        });
        if (existingRegistration) {
            throw new ApiError_1.ApiError(409, 'You are already registered for this hackathon', 'DUPLICATE_REGISTRATION');
        }
        const registration = await db_1.db.registration.create({
            data: {
                userId,
                hackathonId,
            },
        });
        return registration;
    }
}
exports.HackathonService = HackathonService;
