"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const jwt_1 = require("../../utils/jwt");
const ApiError_1 = require("../../utils/ApiError");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res, next) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { user, accessToken, refreshToken } = await authService.login(req.body);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.status(200).json({
                success: true,
                data: {
                    user,
                    accessToken,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.status(200).json({
                success: true,
                data: { message: 'Logged out successfully' },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getMe(req, res, next) {
        try {
            if (!req.user) {
                throw new ApiError_1.ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
            }
            const user = await authService.getMe(req.user.userId);
            res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                throw new ApiError_1.ApiError(401, 'Refresh token required', 'UNAUTHORIZED');
            }
            const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
            const tokens = (0, jwt_1.generateTokens)({
                userId: payload.userId,
                email: payload.email,
                role: payload.role,
            });
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.status(200).json({
                success: true,
                data: {
                    accessToken: tokens.accessToken,
                },
            });
        }
        catch (error) {
            res.clearCookie('refreshToken');
            next(new ApiError_1.ApiError(401, 'Invalid or expired refresh token', 'UNAUTHORIZED'));
        }
    }
}
exports.AuthController = AuthController;
