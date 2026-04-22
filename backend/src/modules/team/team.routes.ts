import { Router } from 'express';
import { TeamController } from './team.controller';
import { validate } from '../../middleware/validate.middleware';
import { verifyToken } from '../../middleware/auth.middleware';
import { createTeamSchema, inviteMemberSchema, joinTeamSchema } from './team.schema';

const router = Router();
const teamController = new TeamController();

router.post('/', verifyToken, validate(createTeamSchema), teamController.createTeam);
router.get('/:id', verifyToken, teamController.getTeamById);
router.post('/:id/invite', verifyToken, validate(inviteMemberSchema), teamController.inviteMember);
router.post('/join', verifyToken, validate(joinTeamSchema), teamController.joinTeam);

export default router;
