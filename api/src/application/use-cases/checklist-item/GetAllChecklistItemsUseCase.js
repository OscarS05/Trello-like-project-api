const ChecklistItemDto = require('../../dtos/checklist-item.dto');

class GetAllChecklistItemsUseCase {
  constructor({ checklistItemRepository }) {
    this.checklistItemRepository = checklistItemRepository;
  }

  async execute(checklistId) {
    const items = await this.checklistItemRepository.findAll(checklistId);
    return items?.length > 0
      ? items.map((item) => new ChecklistItemDto(item))
      : [];
  }
}

module.exports = GetAllChecklistItemsUseCase;
