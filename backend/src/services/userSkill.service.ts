import { PrismaClient, Prisma } from '@prisma/client';
import { CreateUserSkillDto, UpdateUserSkillDto, CreateUserSkillUsageDto } from '../dto/userSkill.dto';

export class UserSkillService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createUserSkill(userId: string, data: CreateUserSkillDto, tx?: Prisma.TransactionClient) {
        const prisma = tx || this.prisma;
        
        if (!data.skill.id) {
            throw new Error('Skill ID is required');
        }

        // If no transaction is provided, wrap operations in a new transaction
        if (!tx) {
            return this.prisma.$transaction(async (prismaClient) => {
                return this.createUserSkillWithSequences(userId, data, prismaClient);
            });
        }

        // If transaction is provided, use it directly
        return this.createUserSkillWithSequences(userId, data, prisma);
    }

    private async createUserSkillWithSequences(userId: string, data: CreateUserSkillDto, prisma: Prisma.TransactionClient) {
        if (!data.skill.id) {
            throw new Error('Skill ID is required');
        }

        const userSkill = await prisma.userSkill.create({
            data: {
                userId,
                skillId: data.skill.id,
                note: data.userSkill.note || '',
                videoUrl: data.userSkill.videoUrl || null,
            }
        });

        if (data.userSkill.sequences) {
            for (const seq of data.userSkill.sequences) {
                await prisma.skillSequence.create({
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
    }

    async getUserSkills(userId: string) {
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

    async updateUserSkill(id: string, userId: string, data: UpdateUserSkillDto) {
        const { sequences, ...rest } = data;
        return this.prisma.userSkill.update({
            where: { id, userId },
            data: {
                ...rest,
                ...(sequences && {
                    sequences: {
                        deleteMany: {},
                        create: sequences.map((seq, index) => ({
                            stepNumber: seq.stepNumber,
                            intention: seq.intention,
                            details: {
                                create: seq.details.map(detail => ({ detail }))
                            }
                        }))
                    }
                })
            }
        });
    }

    // async addSkillUsage(userSkillId: string, userId: string, data: CreateSkillUsageDto) {
    //     const userSkill = await this.prisma.userSkill.findFirst({
    //         where: { id: userSkillId, userId }
    //     });

    //     if (!userSkill) {
    //         throw new Error('UserSkill not found or unauthorized');
    //     }

    //     return this.prisma.skillUsage.create({
    //         data: {
    //             skillId: userSkillId,
    //             ...data
    //         }
    //     });
    // }

    async deleteUserSkill(id: string, userId: string) {
        return this.prisma.userSkill.delete({
            where: { id, userId }
        });
    }
}
