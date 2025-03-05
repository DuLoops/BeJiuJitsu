import { Request, Response } from 'express';
import { UserSkillService } from '../services/userSkill.service';
import { CreateUserSkillDto, UpdateUserSkillDto, CreateSkillUsageDto } from '../dto/userSkill.dto';

interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        // ... other user properties ...
    };
}

export class UserSkillController {
    private userSkillService: UserSkillService;

    constructor() {
        this.userSkillService = new UserSkillService();
    }

    async createUserSkill(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user.id;
            const skillData: CreateUserSkillDto = req.body;
            const userSkill = await this.userSkillService.createUserSkill(userId, skillData);
            res.status(201).json(userSkill);
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
            const userSkillId = parseInt(req.params.id);
            const updateData: UpdateUserSkillDto = req.body;
            const userSkill = await this.userSkillService.updateUserSkill(userSkillId, userId, updateData);
            res.json(userSkill);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }

    async addSkillUsage(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user.id;
            const userSkillId = parseInt(req.params.id);
            const usageData: CreateSkillUsageDto = req.body;
            const usage = await this.userSkillService.addSkillUsage(userSkillId, userId, usageData);
            res.status(201).json(usage);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }

    async deleteUserSkill(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user.id;
            const userSkillId = parseInt(req.params.id);
            await this.userSkillService.deleteUserSkill(userSkillId, userId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }
}
