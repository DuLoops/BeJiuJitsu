import { PrismaClient } from '@prisma/client';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skill.dto';

export class SkillService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createSkill(creatorId: string, data: CreateSkillDto) {
        console.log('Creating skill with data:', JSON.stringify(data));
        try {
            console.log('Creating skill with data:', JSON.stringify(data));
            console.log('Creator ID:', creatorId);
            
            // Validate required fields
            if (!data.name) {
                throw new Error('Skill name is required');
            }
            
            if (!data.categoryId) {
                throw new Error('Category ID is required');
            }
            
            return await this.prisma.skill.create({
                data: {
                    name: data.name,
                    isPublic: data.isPublic ?? false,
                    creatorId,
                    category: {
                        connect: {
                            id: data.categoryId
                        }
                    }
                },
                include: {
                    category: true
                }
            });
        } catch (error) {
            console.error('Error creating skill:', error);
            // Check for specific Prisma errors and provide better messages
            if ((error as any).code === 'P2025') {
                throw new Error('Category not found with the provided ID');
            }
            throw error;
        }
    }

    async getSkills(userId: string) {
        return this.prisma.skill.findMany({
            where: {
                OR: [
                    { creatorId: userId },
                    { isPublic: true }
                ]
            },
            include: {
                category: true
            }
        });
    }

    async updateSkill(skillId: string, userId: string, data: UpdateSkillDto) {
        const skill = await this.prisma.skill.findFirst({
            where: { id: skillId, creatorId: userId }
        });

        if (!skill) {
            throw new Error('Skill not found or unauthorized');
        }

        return this.prisma.skill.update({
            where: { id: skillId },
            data
        });
    }

    async deleteSkill(skillId: string, userId: string) {
        const skill = await this.prisma.skill.findFirst({
            where: { id: skillId, creatorId: userId }
        });

        if (!skill) {
            throw new Error('Skill not found or unauthorized');
        }

        return this.prisma.skill.delete({
            where: { id: skillId }
        });
    }
}
