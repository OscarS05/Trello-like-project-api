const ChecklistDto = require('../../dtos/checklist.dto');

class GetAllChecklistsByCardUseCase {
  constructor({ checklistRepository }) {
    this.checklistRepository = checklistRepository;
  }

  async execute(cardId) {
    const checklists =
      await this.checklistRepository.findChecklistsByCard(cardId);
    return checklists?.length > 0
      ? checklists.map((checklist) => new ChecklistDto(checklist))
      : [];
  }
}

module.exports = GetAllChecklistsByCardUseCase;
