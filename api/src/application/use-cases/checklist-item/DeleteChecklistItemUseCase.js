class DeleteChecklistItemUseCase {
  constructor({ checklistItemRepository }) {
    this.checklistItemRepository = checklistItemRepository;
  }

  async execute(checklistItemId) {
    return this.checklistItemRepository.delete(checklistItemId);
  }
}

module.exports = DeleteChecklistItemUseCase;
