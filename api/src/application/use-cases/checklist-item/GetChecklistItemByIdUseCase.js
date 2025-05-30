const ChecklistItemDto = require('../../dtos/checklist-item.dto');

class GetChecklistItemByIdUseCase {
  constructor({ checklistItemRepository }) {
    this.checklistItemRepository = checklistItemRepository;
  }

  async execute(checklistItemId) {
    if (!checklistItemId) throw new Error('checklistItemId was not provided');

    const checklistItem =
      await this.checklistItemRepository.findOne(checklistItemId);

    return checklistItem?.id ? new ChecklistItemDto(checklistItem) : {};
  }
}

module.exports = GetChecklistItemByIdUseCase;
