import { PrismaClient, Prisma} from '@prisma/client';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skill.dto';

export class SkillService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createSkill(creatorId: string, data: CreateSkillDto, tx?: Prisma.TransactionClient) {
        console.log('Creating skill with data:', data);
        if (tx) {
            return tx.skill.create({
                data: {
                    ...data,
                    creatorId
                }
            });
        }

        return await this.prisma.$transaction(async (prismaTransaction) => {
            return prismaTransaction.skill.create({
                data: {
                    ...data,
                    creatorId
                }
            });
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
