"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentIntentSchema = void 0;
const zod_1 = require("zod");
exports.createPaymentIntentSchema = zod_1.z.object({
    body: zod_1.z.object({
        hackathonId: zod_1.z.string().cuid('Invalid hackathon ID'),
    }),
});
