import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/check-username', profileController.checkUserName);
router.post('/', authenticateJWT, profileController.createProfile);
router.put('/:userId', authenticateJWT, profileController.updateProfile);
router.patch('/goals/:goalId', authenticateJWT, profileController.updateGoal);

export default router;