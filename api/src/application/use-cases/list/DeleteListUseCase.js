class DeleteListUseCase {
  constructor({ listRepository }) {
    this.listRepository = listRepository;
  }

  async execute(projectId, listId) {
    if (!projectId) throw new Error('projectId was not provided');
    if (!listId) throw new Error('listId was not provided');

    const result = await this.listRepository.delete(projectId, listId);

    if (result === 0) {
      throw new Error(
        'Something went wrong deleting the list. Maybe the list does not exist',
      );
    }

    return result;
  }
}

module.exports = DeleteListUseCase;
