import { Router } from 'express';
import { SubmissionController } from './submission.controller';
import { validate } from '../../middleware/validate.middleware';
import { verifyToken } from '../../middleware/auth.middleware';
import { createSubmissionSchema } from './submission.schema';

const router = Router();
const submissionController = new SubmissionController();

router.post('/', verifyToken, validate(createSubmissionSchema), submissionController.createSubmission);
router.get('/:hackathonId', verifyToken, submissionController.getSubmissions);

export default router;
