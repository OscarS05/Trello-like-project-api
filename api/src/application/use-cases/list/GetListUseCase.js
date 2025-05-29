const ListDto = require('../../dtos/list.dto');

class GetListUseCase {
  constructor({ listRepository }) {
    this.listRepository = listRepository;
  }

  async execute(projectId, listId) {
    if (!projectId) throw new Error('projectId was not provided');
    if (!listId) throw new Error('listId was not provided');

    const list = await this.listRepository.findOneById(projectId, listId);

    return list?.id ? new ListDto(list) : {};
  }
}

module.exports = GetListUseCase;
