class DeleteChecklistUseCase {
  constructor({ checklistRepository }) {
    this.checklistRepository = checklistRepository;
  }

  async execute(checklistId) {
    if (!checklistId) throw new Error('checklistId was not provided');

    const result = await this.checklistRepository.delete(checklistId);

    if (result === 0) {
      throw new Error('Something went wrong removing the checklist');
    }

    return result;
  }
}

module.exports = DeleteChecklistUseCase;
