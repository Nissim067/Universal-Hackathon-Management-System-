"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info: (message, ...args) => {
        if (process.env.NODE_ENV !== 'test') {
            process.stdout.write(`[INFO] ${new Date().toISOString()} - ${message}\n`);
        }
    },
    error: (message, ...args) => {
        if (process.env.NODE_ENV !== 'test') {
            process.stderr.write(`[ERROR] ${new Date().toISOString()} - ${message}\n`);
        }
    },
    warn: (message, ...args) => {
        if (process.env.NODE_ENV !== 'test') {
            process.stdout.write(`[WARN] ${new Date().toISOString()} - ${message}\n`);
        }
    },
    debug: (message, ...args) => {
        if (process.env.NODE_ENV === 'development') {
            process.stdout.write(`[DEBUG] ${new Date().toISOString()} - ${message}\n`);
        }
    },
};
