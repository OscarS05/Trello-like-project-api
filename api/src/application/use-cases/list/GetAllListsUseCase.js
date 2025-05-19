const ListDto = require('../../dtos/list.dto');

class GetAllListsUseCase {
  constructor({ listRepository }) {
    this.listRepository = listRepository;
  }

  async execute(projectId) {
    const lists = await this.listRepository.findAll(projectId);
    return lists.map((list) => new ListDto(list));
  }
}

module.exports = GetAllListsUseCase;
