import { PrismaClient } from '@prisma/client';
import { CreateUserSkillDto, UpdateUserSkillDto, CreateSkillUsageDto } from '../dto/userSkill.dto';

export class UserSkillService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createUserSkill(userId: number, data: CreateUserSkillDto) {
        return this.prisma.$transaction(async (prisma) => {
            const userSkill = await prisma.userSkill.create({
                data: {
                    userId,
                    skillId: data.skillId,
                    note: data.note || '',  // Ensure note has a default value if undefined
                    videoUrl: data.videoUrl || null,  // Optional: handle videoUrl similarly
                }
            });

            if (data.sequences) {
                for (const seq of data.sequences) {
                    const sequence = await prisma.skillSequence.create({
                        data: {
                            skillId: userSkill.id,
                            stepNumber: seq.stepNumber,
                            intention: seq.intention,
                            details: {
                                create: seq.details.map(detail => ({
                                    detail
                                }))
                            }
                        }
                    });
                }
            }

            return userSkill;
        });
    }

    async getUserSkills(userId: number) {
        return this.prisma.userSkill.findMany({
            where: { userId },
            include: {
                skill: {
                    include: { category: true }
                },
                sequences: {
                    include: { details: true }
                },
                usages: true
            }
        });
    }

    async updateUserSkill(id: number, userId: number, data: UpdateUserSkillDto) {
        return this.prisma.userSkill.update({
            where: { id, userId },
            data
        });
    }

    async addSkillUsage(userSkillId: number, userId: number, data: CreateSkillUsageDto) {
        const userSkill = await this.prisma.userSkill.findFirst({
            where: { id: userSkillId, userId }
        });

        if (!userSkill) {
            throw new Error('UserSkill not found or unauthorized');
        }

        return this.prisma.skillUsage.create({
            data: {
                skillId: userSkillId,
                ...data
            }
        });
    }

    async deleteUserSkill(id: number, userId: number) {
        return this.prisma.userSkill.delete({
            where: { id, userId }
        });
    }
}
