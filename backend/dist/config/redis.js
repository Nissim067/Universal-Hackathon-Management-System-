"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = require("ioredis");
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
exports.redis = new ioredis_1.Redis(env_1.env.REDIS_URL);
exports.redis.on('error', (err) => {
    logger_1.logger.error(`Redis Client Error: ${err.message}`);
});
