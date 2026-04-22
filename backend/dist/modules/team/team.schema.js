"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinTeamSchema = exports.inviteMemberSchema = exports.createTeamSchema = void 0;
const zod_1 = require("zod");
exports.createTeamSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Team name must be at least 2 characters'),
        hackathonId: zod_1.z.string().cuid('Invalid hackathon ID'),
    }),
});
exports.inviteMemberSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
    }),
});
exports.joinTeamSchema = zod_1.z.object({
    body: zod_1.z.object({
        inviteToken: zod_1.z.string().min(1, 'Invite token is required'),
    }),
});
