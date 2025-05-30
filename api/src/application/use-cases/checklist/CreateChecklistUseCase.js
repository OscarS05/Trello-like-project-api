const boom = require('@hapi/boom');
const ChecklistEntity = require('../../../domain/entities/ChecklistEntity');
const ChecklistDto = require('../../dtos/checklist.dto');

class CreateChecklistUseCase {
  constructor({ checklistRepository }) {
    this.checklistRepository = checklistRepository;
  }

  async execute(checklistData) {
    if (!checklistData?.name) throw new Error('name was not provided');
    if (!checklistData?.cardId) throw new Error('cardId was not provided');

    const checklistEntity = new ChecklistEntity(checklistData);

    const newChecklist = await this.checklistRepository.create(checklistEntity);
    if (!newChecklist?.id)
      throw boom.badRequest('Something went wrong creating the checklist');

    return new ChecklistDto(newChecklist);
  }
}

module.exports = CreateChecklistUseCase;
