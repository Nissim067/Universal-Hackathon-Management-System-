import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { registerSchema, loginSchema } from './auth.schema';
import { verifyToken } from '../../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/me', verifyToken, authController.getMe);

export default router;
