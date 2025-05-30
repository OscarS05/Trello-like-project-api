const ChecklistDto = require('../../dtos/checklist.dto');

class GetChecklistUseCase {
  constructor({ checklistRepository }) {
    this.checklistRepository = checklistRepository;
  }

  async execute(checklistId) {
    if (!checklistId) throw new Error('checklistId was not provided');

    const checklist = await this.checklistRepository.findOne(checklistId);
    return checklist?.id ? new ChecklistDto(checklist) : {};
  }
}

module.exports = GetChecklistUseCase;
