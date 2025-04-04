import { Request, Response } from 'express';
import { UserSkillService } from '../services/userSkill.service';
import { SkillService } from '../services/skill.service';
import { CreateUserSkillDto, UpdateUserSkillDto } from '../dto/userSkill.dto';
import { UserRole } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

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
    private skillService: SkillService;
    private prisma: PrismaClient;

    constructor() {
        this.userSkillService = new UserSkillService();
        this.skillService = new SkillService();
        this.prisma = new PrismaClient();
    }

    async createUserSkill(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            const skillData = req.body;
            if (!skillData?.skill?.name || !skillData?.skill?.categoryId) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            try {
                const result = await this.prisma.$transaction(async (tx) => {
                    // Check if skill exists by name
                    let existingSkill = await tx.skill.findUnique({
                        where: { name: skillData.skill.name }
                    });

                    // If skill doesn't exist, create it
                    if (!existingSkill) {
                        existingSkill = await this.skillService.createSkill(
                            userId,
                            {
                                name: skillData.skill.name,
                                categoryId: skillData.skill.categoryId
                            },
                            tx
                        );
                    }

                    if (!existingSkill) {
                        throw new Error('Failed to create or find skill');
                    }

                    // Create user skill with the existing or new skill
                    const userSkillData: CreateUserSkillDto = {
                        skill: {
                            ...skillData.skill,
                            id: existingSkill.id
                        },
                        userSkill: skillData.userSkill,
                        creatorId: userId
                    };

                    const userSkill = await this.userSkillService.createUserSkill(
                        userId,
                        userSkillData,
                        tx
                    );

                    return {
                        skill: existingSkill,
                        userSkill
                    };
                });

                return res.status(201).json(result);
            } catch (error) {
                if (error instanceof Error && error.message.includes('Transaction failed')) {
                    return res.status(500).json({ message: 'Database operation failed' });
                }
                throw error;
            }
        } catch (error) {
            return res.status(500).json({ 
                message: error instanceof Error 
                    ? error.message 
                    : 'An unknown error occurred',
                status: 'error'
            });
        }
    }

    async getUserSkills(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new Error('User not authenticated');
            }
            const userSkills = await this.userSkillService.getUserSkills(userId);
            res.json(userSkills);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }

    async updateUserSkill(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new Error('User not authenticated');
            }
            const userSkillId = req.params.id;
            const updateData: UpdateUserSkillDto = req.body;
            const userSkill = await this.userSkillService.updateUserSkill(userSkillId, userId, updateData);
            res.json(userSkill);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }

    // async addUserSkillUsage(req: AuthenticatedRequest, res: Response) {
    //     try {
    //         const userSkillId = req.params.id;
    //         const userId = req.user.id;
    //         const usageData: CreateUserSkillUsageDto = req.body;
    //         const usage = await this.userSkillService.addUserSkillUsage(userSkillId, userId, usageData);
    //         res.json(usage);
    //     } catch (error: unknown) {
    //         if (error instanceof Error) {
    //             res.status(400).json({ error: error.message });
    //         } else {
    //             res.status(500).json({ error: 'An unknown error occurred' });
    //         }
    //     }
    // }

    async deleteUserSkill(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new Error('User not authenticated');
            }
            const userSkillId = req.params.id;
            await this.userSkillService.deleteUserSkill(userSkillId, userId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    }
}
