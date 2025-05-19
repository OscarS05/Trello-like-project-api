const boom = require('@hapi/boom');
const ChecklistEntity = require('../../../domain/entities/ChecklistEntity');
const ChecklistDto = require('../../dtos/checklist.dto');

class CreateChecklistUseCase {
  constructor({ checklistRepository }) {
    this.checklistRepository = checklistRepository;
  }

  async execute(checklistData) {
    const checklistEntity = new ChecklistEntity(checklistData);

    const newChecklist = await this.checklistRepository.create(checklistEntity);
    if (!newChecklist?.id)
      throw boom.badRequest('Something went wront creating the checklist');

    return new ChecklistDto(newChecklist);
  }
}

module.exports = CreateChecklistUseCase;
