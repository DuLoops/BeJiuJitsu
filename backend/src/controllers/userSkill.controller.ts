import { Request, Response } from 'express';
import { UserSkillService } from '../services/userSkill.service';
import { UserSkillManagerService } from '../services/userSkillManager.service';
import { SkillService } from '../services/skill.service';
import { CreateUserSkillDto, UpdateUserSkillDto, CreateUserSkillUsageDto } from '../dto/userSkill.dto';
import { UserRole } from '@prisma/client';

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
        password: string;
        isVerified: boolean;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
    };
}

export class UserSkillController {
    private userSkillService: UserSkillService;
    private userSkillManagerService: UserSkillManagerService;

    constructor() {
        this.userSkillService = new UserSkillService();
        const skillService = new SkillService();
        this.userSkillManagerService = new UserSkillManagerService(skillService, this.userSkillService);
    }

    async createUserSkill(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user.id;
            const skillData = req.body;
            console.log('skillData', skillData);
            
            if (skillData.skill.name) {
                const result = await this.userSkillManagerService.createUserSkill(
                    userId,
                    {
                        name: skillData.skill.name,
                        categoryId: skillData.categoryId
                    },
                    {
                        note: skillData.userSkill.note,
                        videoUrl: skillData.userSkill.videoUrl,
                        sequences: skillData.userSkill.sequences
                    }
                );
                return res.status(201).json(result);
            }

            res.status(400).json({ message: 'Skill name must be provided' });
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }

    async getUserSkills(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user.id;
            const userSkills = await this.userSkillService.getUserSkills(userId);
            res.json(userSkills);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }

    async updateUserSkill(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user.id;
            const userSkillId = req.params.id;
            const updateData: UpdateUserSkillDto = req.body;
            const userSkill = await this.userSkillService.updateUserSkill(userSkillId, userId, updateData);
            res.json(userSkill);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }

    async addUserSkillUsage(req: AuthenticatedRequest, res: Response) {
        try {
            const userSkillId = req.params.id;
            const userId = req.user.id;
            const usageData: CreateUserSkillUsageDto = req.body;
            const usage = await this.userSkillService.addUserSkillUsage(userSkillId, userId, usageData);
            res.json(usage);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }

    async deleteUserSkill(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user.id;
            const userSkillId = req.params.id;
            await this.userSkillService.deleteUserSkill(userSkillId, userId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }
}
