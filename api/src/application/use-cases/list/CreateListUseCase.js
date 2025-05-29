const ListEntity = require('../../../domain/entities/ListEntity');
const ListDto = require('../../dtos/list.dto');

class CreateListUseCase {
  constructor({ listRepository }) {
    this.listRepository = listRepository;
  }

  async execute(listData) {
    if (!listData?.projectId) {
      throw new Error('projectId was not provided');
    }

    const listEntity = new ListEntity(listData);

    const createdList = await this.listRepository.create(listEntity);
    if (!createdList?.id) {
      throw new Error('Something went wrong creating the list');
    }

    return new ListDto(createdList);
  }
}

module.exports = CreateListUseCase;
