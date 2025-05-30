class DeleteChecklistItemUseCase {
  constructor({ checklistItemRepository }) {
    this.checklistItemRepository = checklistItemRepository;
  }

  async execute(checklistItemId) {
    if (!checklistItemId) throw new Error('checklistItemId was not provided');

    const result = await this.checklistItemRepository.delete(checklistItemId);

    if (result === 0) {
      throw new Error('Something went wrong deleting the checklist item');
    }

    return result;
  }
}

module.exports = DeleteChecklistItemUseCase;
