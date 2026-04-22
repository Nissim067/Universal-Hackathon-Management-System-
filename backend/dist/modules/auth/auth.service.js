"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = require("../../config/db");
const ApiError_1 = require("../../utils/ApiError");
const hashPassword_1 = require("../../utils/hashPassword");
const jwt_1 = require("../../utils/jwt");
class AuthService {
    async register(data) {
        const existingUser = await db_1.db.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new ApiError_1.ApiError(409, 'User with this email already exists', 'USER_EXISTS');
        }
        const hashedPassword = await (0, hashPassword_1.hashPassword)(data.password);
        const user = await db_1.db.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: hashedPassword,
                role: data.role,
            },
        });
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async login(data) {
        const user = await db_1.db.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new ApiError_1.ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
        }
        const isPasswordValid = await (0, hashPassword_1.comparePassword)(data.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new ApiError_1.ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
        }
        const tokens = (0, jwt_1.generateTokens)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const { passwordHash, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            ...tokens,
        };
    }
    async getMe(userId) {
        const user = await db_1.db.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new ApiError_1.ApiError(404, 'User not found', 'USER_NOT_FOUND');
        }
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
exports.AuthService = AuthService;
