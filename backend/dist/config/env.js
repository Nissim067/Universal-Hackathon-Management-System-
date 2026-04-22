"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('8000'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: zod_1.z.string().min(1),
    REDIS_URL: zod_1.z.string().default('redis://localhost:6379'),
    JWT_ACCESS_SECRET: zod_1.z.string().min(1),
    JWT_REFRESH_SECRET: zod_1.z.string().min(1),
    STRIPE_SECRET_KEY: zod_1.z.string().min(1),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string().min(1),
    SMTP_HOST: zod_1.z.string().min(1),
    SMTP_PORT: zod_1.z.string().default('465').transform(Number),
    SMTP_USER: zod_1.z.string().min(1),
    SMTP_PASS: zod_1.z.string().min(1),
    EMAIL_FROM: zod_1.z.string().min(1),
    FRONTEND_URL: zod_1.z.string().url().default('http://localhost:5173'),
});
exports.env = envSchema.parse(process.env);
