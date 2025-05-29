const ListDto = require('../../dtos/list.dto');

class GetAllListsUseCase {
  constructor({ listRepository }) {
    this.listRepository = listRepository;
  }

  async execute(projectId) {
    if (!projectId) throw new Error('projectId was not provided');

    const lists = await this.listRepository.findAll(projectId);
    return lists?.length > 0 ? lists.map((list) => new ListDto(list)) : [];
  }
}

module.exports = GetAllListsUseCase;
