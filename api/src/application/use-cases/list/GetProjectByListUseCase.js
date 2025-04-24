class GetProjectByListUseCase {
  constructor({ listRepository }) {
    this.listRepository = listRepository;
  }

  async execute(listId) {
    const listIWithItsProject = await this.listRepository.getProjectByList(listId);
    return listIWithItsProject?.id ? listIWithItsProject : {};
  }
}

module.exports = GetProjectByListUseCase;
