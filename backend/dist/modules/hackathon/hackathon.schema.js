"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHackathonsQuerySchema = exports.updateHackathonSchema = exports.createHackathonSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createHackathonSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3),
        description: zod_1.z.string().min(10),
        coverImageUrl: zod_1.z.string().url().optional(),
        startDate: zod_1.z.string().datetime(),
        endDate: zod_1.z.string().datetime(),
        registrationDeadline: zod_1.z.string().datetime(),
        prizePool: zod_1.z.number().nonnegative().optional(),
        registrationFee: zod_1.z.number().nonnegative().default(0),
        maxParticipants: zod_1.z.number().int().positive().optional(),
        tags: zod_1.z.array(zod_1.z.string()).default([]),
    }),
});
exports.updateHackathonSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).optional(),
        description: zod_1.z.string().min(10).optional(),
        coverImageUrl: zod_1.z.string().url().optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
        registrationDeadline: zod_1.z.string().datetime().optional(),
        prizePool: zod_1.z.number().nonnegative().optional(),
        registrationFee: zod_1.z.number().nonnegative().optional(),
        maxParticipants: zod_1.z.number().int().positive().optional(),
        status: zod_1.z.nativeEnum(client_1.HackathonStatus).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.getHackathonsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.HackathonStatus).optional(),
        page: zod_1.z.string().regex(/^\d+$/).default('1').transform(Number),
        limit: zod_1.z.string().regex(/^\d+$/).default('10').transform(Number),
        search: zod_1.z.string().optional(),
    }),
});
