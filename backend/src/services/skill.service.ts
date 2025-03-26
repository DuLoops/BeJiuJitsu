import { PrismaClient } from '@prisma/client';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skill.dto';

export class SkillService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createSkill(creatorId: string, data: CreateSkillDto) {
       try{
        if (data.isNewSkill) {
            data.skill.id = await this.prisma.skill.create({
                data: {
                    name: data.skill.name,
                    categoryId: data.skill.categoryId,
                    creatorId,
                    isPublic: false,
                    createdAt: new Date()
                }
            }).then(skill => skill.id);
        }
        if (!data.skill.id) {
            throw new Error('Skill ID is undefined');
        }

        const createdUserSkill = await this.prisma.userSkill.create({
            data: {
                note: data.userSkill.note,
                videoUrl: data.userSkill.videoUrl,
                sequences: {
                    create: data.userSkill.sequence.map((step, index) => ({
                        stepNumber: index + 1,
                        intention: step.intention,
                        details: {
                            create: step.details.map(detail => ({ detail }))
                        }
                    }))
                },
                skillId: data.skill.id,
                skill: {
                    connect: { id: data.skill.id }
                },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        // Optionally, you can log or use `createdUserSkill` as needed
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
