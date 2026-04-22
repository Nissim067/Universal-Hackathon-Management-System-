"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubmissionSchema = void 0;
const zod_1 = require("zod");
exports.createSubmissionSchema = zod_1.z.object({
    body: zod_1.z.object({
        hackathonId: zod_1.z.string().cuid('Invalid hackathon ID'),
        teamId: zod_1.z.string().cuid('Invalid team ID'),
        projectTitle: zod_1.z.string().min(3, 'Project title must be at least 3 characters'),
        description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
        repoUrl: zod_1.z.string().url('Invalid repository URL').optional(),
        demoUrl: zod_1.z.string().url('Invalid demo URL').optional(),
    }),
});
