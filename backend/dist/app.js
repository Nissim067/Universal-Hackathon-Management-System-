"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
// Routes
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const hackathon_routes_1 = __importDefault(require("./modules/hackathon/hackathon.routes"));
const team_routes_1 = __importDefault(require("./modules/team/team.routes"));
const submission_routes_1 = __importDefault(require("./modules/submission/submission.routes"));
const payment_routes_1 = __importDefault(require("./modules/payment/payment.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
}));
// We need raw body for Stripe Webhook before express.json()
app.use('/api/v1/payments/webhook', express_1.default.raw({ type: 'application/json' }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', environment: env_1.env.NODE_ENV });
});
// API Routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/hackathons', hackathon_routes_1.default);
app.use('/api/v1/teams', team_routes_1.default);
app.use('/api/v1/submissions', submission_routes_1.default);
app.use('/api/v1/payments', payment_routes_1.default);
// Error Handling
app.use(errorHandler_1.errorHandler);
const PORT = env_1.env.PORT || 8000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        logger_1.logger.info(`Server is running on port ${PORT} in ${env_1.env.NODE_ENV} mode`);
    });
}
exports.default = app;
