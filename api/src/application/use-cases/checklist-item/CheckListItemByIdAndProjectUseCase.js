const ChecklistItemDto = require('../../dtos/checklist-item.dto');

class CheckListItemByIdAndProjectUseCase {
  constructor({ checklistItemRepository }) {
    this.checklistItemRepository = checklistItemRepository;
  }

  async execute(checklistItemId, projectId) {
    if (!checklistItemId) throw new Error('checklistItemId was not provided');
    if (!projectId) throw new Error('projectId was not provided');

    const checklistItem =
      await this.checklistItemRepository.findOneByIdAndProject(
        checklistItemId,
        projectId,
      );
    return checklistItem?.id ? new ChecklistItemDto(checklistItem) : {};
  }
}

module.exports = CheckListItemByIdAndProjectUseCase;
