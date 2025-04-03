import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SkillService } from './skill.service';
import { UserSkillService } from './userSkill.service';
import { SkillInput, UserSkillInput, CreateSkillDto } from '../dto';

@Injectable()
export class UserSkillManagerService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly skillService: SkillService,
        private readonly userSkillService: UserSkillService
    ) {}

    async createUserSkill(userId: string, skillInput: SkillInput, userSkillInput: UserSkillInput) {
        console.log('=== Debug createUserSkill ===');
        console.log('userId:', userId);
        console.log('skillInput:', JSON.stringify(skillInput, null, 2));
        console.log('userSkillInput:', JSON.stringify(userSkillInput, null, 2));
        
        return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            try {
                // 1. Check if skill exists
                let skill = await this.skillService.findSkillByName(skillInput.name, tx);
                console.log('Found existing skill:', JSON.stringify(skill, null, 2));
                
                // 2. If skill doesn't exist, create it
                if (!skill) {
                    console.log('Creating new skill...');
                    const createSkillDto: CreateSkillDto = {
                        skill: skillInput,
                        userSkill: userSkillInput,
                        creatorId: userId,
                        isNewSkill: true
                    };
                    console.log('createSkillDto:', JSON.stringify(createSkillDto, null, 2));
                    skill = await this.skillService.createSkill(userId, createSkillDto, tx);
                    console.log('Created new skill:', JSON.stringify(skill, null, 2));
                }

                if (!skill) {
                    throw new Error('Failed to create or find skill');
                }

                // 3. Create userSkill with sequences
                const userSkillData = {
                    skillId: skill.id,
                    note: userSkillInput.note,
                    videoUrl: userSkillInput.videoUrl || undefined,
                    sequences: (userSkillInput.sequences || []).map((seq) => ({
                        stepNumber: seq.stepNumber,
                        intention: seq.intention,
                        details: seq.details
                    }))
                };
                console.log('Creating userSkill with data:', JSON.stringify(userSkillData, null, 2));
                
                const userSkill = await this.userSkillService.createUserSkill(userId, userSkillData);
                console.log('Created userSkill:', JSON.stringify(userSkill, null, 2));

                return {
                    skill,
                    userSkill
                };
            } catch (error) {
                console.error('Error in createUserSkill:', error);
                throw error;
            }
        });
    }
}
// ... existing code ...

