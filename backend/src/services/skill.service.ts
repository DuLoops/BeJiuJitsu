import { PrismaClient } from '@prisma/client';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skill.dto';

export class SkillService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createSkill(creatorId: string, data: CreateSkillDto) {
        return this.prisma.skill.create({
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
