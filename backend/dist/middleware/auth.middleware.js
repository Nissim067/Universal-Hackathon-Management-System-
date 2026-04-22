"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.verifyToken = void 0;
const jwt_1 = require("../utils/jwt");
const ApiError_1 = require("../utils/ApiError");
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError_1.ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
        }
        const token = authHeader.split(' ')[1];
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        if (error instanceof ApiError_1.ApiError) {
            next(error);
        }
        else {
            next(new ApiError_1.ApiError(401, 'Invalid or expired token', 'UNAUTHORIZED'));
        }
    }
};
exports.verifyToken = verifyToken;
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError_1.ApiError(401, 'Unauthorized', 'UNAUTHORIZED'));
        }
        if (req.user.role !== role && req.user.role !== 'ADMIN') {
            return next(new ApiError_1.ApiError(403, 'Forbidden', 'FORBIDDEN'));
        }
        next();
    };
};
exports.requireRole = requireRole;
