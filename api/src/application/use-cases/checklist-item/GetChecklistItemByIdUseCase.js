const ChecklistItemDto = require('../../dtos/checklist-item.dto');

class GetChecklistItemByIdUseCase {
  constructor({ checklistItemRepository }) {
    this.checklistItemRepository = checklistItemRepository;
  }

  async execute(checklistItemId) {
    const checklistItem =
      await this.checklistItemRepository.findOne(checklistItemId);
    return checklistItem?.id ? new ChecklistItemDto(checklistItem) : {};
  }
}

module.exports = GetChecklistItemByIdUseCase;
