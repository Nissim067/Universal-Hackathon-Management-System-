import { Router } from 'express';
import { HackathonController } from './hackathon.controller';
import { validate } from '../../middleware/validate.middleware';
import { verifyToken, requireRole } from '../../middleware/auth.middleware';
import { createHackathonSchema, updateHackathonSchema, getHackathonsQuerySchema } from './hackathon.schema';

const router = Router();
const hackathonController = new HackathonController();

// Public routes
router.get('/', validate(getHackathonsQuerySchema), hackathonController.getHackathons);
router.get('/:id', hackathonController.getHackathonById);

// Protected routes (Organizer only)
router.post(
  '/',
  verifyToken,
  requireRole('ORGANIZER'),
  validate(createHackathonSchema),
  hackathonController.createHackathon
);

router.put(
  '/:id',
  verifyToken,
  requireRole('ORGANIZER'),
  validate(updateHackathonSchema),
  hackathonController.updateHackathon
);

router.delete(
  '/:id',
  verifyToken,
  requireRole('ORGANIZER'),
  hackathonController.deleteHackathon
);

// Protected routes (JWT for participants)
router.post(
  '/:id/register',
  verifyToken,
  hackathonController.registerParticipant
);

export default router;
