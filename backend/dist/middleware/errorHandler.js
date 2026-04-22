"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
        });
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            code: 'VALIDATION_ERROR',
            errors: err.issues,
        });
    }
    logger_1.logger.error(err);
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        code: 'INTERNAL_SERVER_ERROR',
    });
};
exports.errorHandler = errorHandler;
