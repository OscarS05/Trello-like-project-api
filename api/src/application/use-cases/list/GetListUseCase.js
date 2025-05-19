const ListDto = require('../../dtos/list.dto');

class GetListUseCase {
  constructor({ listRepository }) {
    this.listRepository = listRepository;
  }

  async execute(projectId, listId) {
    const list = await this.listRepository.findOneById(projectId, listId);
    if (!list?.id) return {};
    return new ListDto(list);
  }
}

module.exports = GetListUseCase;
