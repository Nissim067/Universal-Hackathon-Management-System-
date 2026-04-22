import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Routes
import authRoutes from './modules/auth/auth.routes';
import hackathonRoutes from './modules/hackathon/hackathon.routes';
import teamRoutes from './modules/team/team.routes';
import submissionRoutes from './modules/submission/submission.routes';
import paymentRoutes from './modules/payment/payment.routes';

const app = express();

// Middleware
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));

// We need raw body for Stripe Webhook before express.json()
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: env.NODE_ENV });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/hackathons', hackathonRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/submissions', submissionRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Error Handling
app.use(errorHandler);

const PORT = env.PORT || 8000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
  });
}

export default app;
