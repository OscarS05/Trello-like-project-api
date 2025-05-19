const ChecklistDto = require('../../dtos/checklist.dto');

class GetChecklistUseCase {
  constructor({ checklistRepository }) {
    this.checklistRepository = checklistRepository;
  }

  async execute(checklistId) {
    const checklist = await this.checklistRepository.findOne(checklistId);
    return new ChecklistDto(checklist);
  }
}

module.exports = GetChecklistUseCase;
