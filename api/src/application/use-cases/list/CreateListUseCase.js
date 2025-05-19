const ListEntity = require('../../../domain/entities/ListEntity');
const ListDto = require('../../dtos/list.dto');

class CreateListUseCase {
  constructor({ listRepository }) {
    this.listRepository = listRepository;
  }

  async execute(listData) {
    const listEntity = new ListEntity(listData);

    const createdList = await this.listRepository.create(listEntity);

    return new ListDto(createdList);
  }
}

module.exports = CreateListUseCase;
