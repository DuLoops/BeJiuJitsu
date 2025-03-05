import { Router, Request, Response } from 'express';
import { SkillController } from '../controllers/skill.controller';

const router = Router();
const skillController = new SkillController();

router.post('/', async (req: Request, res: Response) => {
  try {
    await skillController.createSkill(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    await skillController.getSkills(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    await skillController.updateSkill(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await skillController.deleteSkill(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

export default router;
