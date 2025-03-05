import { SkillController } from '../../controllers/skill.controller';
import { SkillService } from '../../services/skill.service';
import { Request, Response } from 'express';
import { CreateSkillDto, UpdateSkillDto } from '../../dto/skill.dto';

jest.mock('../../services/skill.service');

describe('SkillController', () => {
    let skillController: SkillController;
    let skillService: jest.Mocked<SkillService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.Mock;
    let responseStatus: jest.Mock;
    let responseSend: jest.Mock;

    beforeEach(() => {
        skillService = new SkillService() as jest.Mocked<SkillService>;
        skillController = new SkillController();
        (skillController as any).skillService = skillService;

        responseJson = jest.fn();
        responseStatus = jest.fn().mockReturnValue({ json: responseJson, send: responseSend });
        responseSend = jest.fn();

        mockResponse = {
            json: responseJson,
            status: responseStatus,
            send: responseSend
        };

        mockRequest = {
            user: { id: '123' }
        };
    });

    describe('createSkill', () => {
        it('should create a skill successfully', async () => {
            const dto: CreateSkillDto = {
                name: 'Triangle',
                categoryId: 1,
                isPublic: true
            };

            mockRequest.body = dto;
            const mockSkill = { id: 1, ...dto, creatorId: '123' };
            
            skillService.createSkill = jest.fn().mockResolvedValue(mockSkill);

            await skillController.createSkill(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith(mockSkill);
        });
    });

    describe('getSkills', () => {
        it('should get skills successfully', async () => {
            const mockSkills = [
                { id: 1, name: 'Triangle', categoryId: 1, creatorId: '123', isPublic: true }
            ];

            skillService.getSkills = jest.fn().mockResolvedValue(mockSkills);

            await skillController.getSkills(mockRequest as Request, mockResponse as Response);

            expect(responseJson).toHaveBeenCalledWith(mockSkills);
        });
    });

    describe('updateSkill', () => {
        it('should update a skill successfully', async () => {
            const dto: UpdateSkillDto = {
                name: 'Updated Triangle'
            };

            mockRequest.body = dto;
            mockRequest.params = { id: '1' };

            const mockSkill = { id: 1, ...dto, creatorId: '123' };
            
            skillService.updateSkill = jest.fn().mockResolvedValue(mockSkill);

            await skillController.updateSkill(mockRequest as Request, mockResponse as Response);

            expect(responseJson).toHaveBeenCalledWith(mockSkill);
        });
    });

    describe('deleteSkill', () => {
        it('should delete a skill successfully', async () => {
            mockRequest.params = { id: '1' };
            
            skillService.deleteSkill = jest.fn().mockResolvedValue(undefined);

            await skillController.deleteSkill(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(204);
            expect(responseSend).toHaveBeenCalled();
        });
    });
});
