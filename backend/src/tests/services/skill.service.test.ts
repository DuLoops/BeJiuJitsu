import { SkillService } from '../../services/skill.service';
import { mockContext, MockPrisma } from '../setup';
import { PrismaClient } from '@prisma/client';
import { CreateSkillDto, UpdateSkillDto } from '../../dto/skill.dto';

describe('SkillService', () => {
    let skillService: SkillService;
    let prisma: MockPrisma;

    beforeEach(() => {
        prisma = mockContext.prisma as unknown as MockPrisma;
        skillService = new SkillService();
        (skillService as any).prisma = prisma;
        
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('createSkill', () => {
        it('should create a skill', async () => {
            const mockSkill = {
                id: 1,
                name: 'Triangle',
                categoryId: 1,
                creatorId: '123',
                isPublic: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            prisma.skill.create.mockResolvedValue(mockSkill);

            const dto: CreateSkillDto = {
                name: 'Triangle',
                categoryId: 1,
                isPublic: true
            };

            const result = await skillService.createSkill('123', dto);
            expect(result).toEqual(mockSkill);
        });
    });

    describe('getSkills', () => {
        it('should return skills for user', async () => {
            const mockSkills = [
                { id: 1, name: 'Triangle', categoryId: 1, creatorId: '123', isPublic: true },
                { id: 2, name: 'Armbar', categoryId: 1, creatorId: '456', isPublic: true }
            ];

            prisma.skill.findMany.mockResolvedValue(mockSkills);

            const result = await skillService.getSkills('123');
            expect(result).toEqual(mockSkills);
        });
    });

    describe('updateSkill', () => {
        it('should update a skill', async () => {
            const mockSkill = {
                id: 1,
                name: 'Updated Triangle',
                categoryId: 1,
                creatorId: '123',
                isPublic: true
            };

            prisma.skill.findFirst.mockResolvedValue(mockSkill);
            prisma.skill.update.mockResolvedValue(mockSkill);

            const dto: UpdateSkillDto = {
                name: 'Updated Triangle'
            };

            const result = await skillService.updateSkill(1, '123', dto);
            expect(result).toEqual(mockSkill);
        });

        it('should throw error if skill not found', async () => {
            prisma.skill.findFirst.mockResolvedValue(null);

            const dto: UpdateSkillDto = {
                name: 'Updated Triangle'
            };

            await expect(skillService.updateSkill(1, '123', dto))
                .rejects
                .toThrow('Skill not found or unauthorized');
        });
    });

    describe('deleteSkill', () => {
        it('should delete a skill', async () => {
            const mockSkill = {
                id: 1,
                name: 'Triangle',
                categoryId: 1,
                creatorId: '123',
                isPublic: true
            };

            prisma.skill.findFirst.mockResolvedValue(mockSkill);
            prisma.skill.delete.mockResolvedValue(mockSkill);

            const result = await skillService.deleteSkill(1, '123');
            expect(result).toEqual(mockSkill);
        });

        it('should throw error if skill not found', async () => {
            prisma.skill.findFirst.mockResolvedValue(null);

            await expect(skillService.deleteSkill(1, '123'))
                .rejects
                .toThrow('Skill not found or unauthorized');
        });
    });
});
