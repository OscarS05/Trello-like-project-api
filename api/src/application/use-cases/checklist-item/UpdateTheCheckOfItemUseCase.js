const boom = require('@hapi/boom');
const ChecklistItemDto = require('../../dtos/checklist-item.dto');

class UpdateTheCheckOfItemUseCase {
  constructor({ checklistItemRepository }) {
    this.checklistItemRepository = checklistItemRepository;
  }

  async execute(checklistItemId, isChecked) {
    const [[updateChecklistItem]] = await this.checklistItemRepository.update(
      checklistItemId,
      { isChecked },
    );
    if (!updateChecklistItem?.id)
      throw boom.badRequest('Something went wrong updating the check');
    return new ChecklistItemDto(updateChecklistItem);
  }
}

module.exports = UpdateTheCheckOfItemUseCase;
