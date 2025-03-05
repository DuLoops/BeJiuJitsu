import { Request, Response } from 'express';
import { SkillService } from '../services/skill.service';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skill.dto';

export class SkillController {
    private skillService: SkillService;

    constructor() {
        this.skillService = new SkillService();
    }

    async createSkill(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const skillData: CreateSkillDto = req.body;
            const skill = await this.skillService.createSkill(userId.toString(), skillData);
            res.status(201).json(skill);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }

    async getSkills(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const skills = await this.skillService.getSkills(userId.toString());
            res.json(skills);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }

    async updateSkill(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const skillId = req.params.id;
            if (!skillId) {
                return res.status(400).json({ message: 'Invalid skill ID' });
            }
            const updateData: UpdateSkillDto = req.body;
            const skill = await this.skillService.updateSkill(skillId, userId.toString(), updateData);
            res.json(skill);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }

    async deleteSkill(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            const skillId = req.params.id;
            if (!skillId) {
                return res.status(400).json({ message: 'Invalid skill ID' });
            }
            await this.skillService.deleteSkill(skillId, userId.toString());
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }
}
