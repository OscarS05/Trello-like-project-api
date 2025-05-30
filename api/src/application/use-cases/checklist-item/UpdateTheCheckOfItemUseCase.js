const boom = require('@hapi/boom');
const ChecklistItemDto = require('../../dtos/checklist-item.dto');

class UpdateTheCheckOfItemUseCase {
  constructor({ checklistItemRepository }) {
    this.checklistItemRepository = checklistItemRepository;
  }

  async execute(checklistItemId, isChecked) {
    if (!checklistItemId) throw new Error('checklistItemId was not provided');
    if (typeof isChecked !== 'boolean') {
      throw new Error('checklistItemId was not provided');
    }

    const [affectedRows, [updateChecklistItem]] =
      await this.checklistItemRepository.update(checklistItemId, { isChecked });

    if (affectedRows === 0) {
      throw boom.badRequest('Something went wrong updating the check');
    }

    return new ChecklistItemDto(updateChecklistItem);
  }
}

module.exports = UpdateTheCheckOfItemUseCase;
