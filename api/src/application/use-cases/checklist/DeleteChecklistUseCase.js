class DeleteChecklistUseCase {
  constructor({ checklistRepository }) {
    this.checklistRepository = checklistRepository;
  }

  async execute(checklistId) {
    return this.checklistRepository.delete(checklistId);
  }
}

module.exports = DeleteChecklistUseCase;
