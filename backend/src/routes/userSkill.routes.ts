import express from 'express';
import { UserSkillController } from '../controllers/userSkill.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
const router = express.Router();
const userSkillController = new UserSkillController();

router.post('/', authenticateJWT, async (req, res) => {
    await userSkillController.createUserSkill(req, res);
});
router.get('/', authenticateJWT, async (req, res) => {
    await userSkillController.getUserSkills(req, res);
});
router.put('/:id', authenticateJWT, async (req, res) => {
    await userSkillController.updateUserSkill(req, res);
});
// router.post('/:id/usage', (req, res) => userSkillController.addSkillUsage(req, res));
router.delete('/:id', authenticateJWT, async (req, res) => {
    await userSkillController.deleteUserSkill(req, res);
});

export default router;
