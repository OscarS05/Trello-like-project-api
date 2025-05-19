class DeleteListUseCase {
  constructor({ listRepository }) {
    this.listRepository = listRepository;
  }

  async execute(projectId, listId) {
    return this.listRepository.delete(projectId, listId);
  }
}

module.exports = DeleteListUseCase;
