class GetProjectByListUseCase {
  constructor({ listRepository }) {
    this.listRepository = listRepository;
  }

  async execute(listId) {
    if (!listId) throw new Error('listId was not provided');

    const listIWithItsProject =
      await this.listRepository.getProjectByList(listId);

    return listIWithItsProject?.id ? listIWithItsProject : {};
  }
}

module.exports = GetProjectByListUseCase;
