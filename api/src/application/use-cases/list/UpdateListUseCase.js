const ListName = require('../../../domain/value-objects/listName');
const ListDto = require('../../dtos/list.dto');

class UpdateListUseCase {
  constructor({ listRepository }) {
    this.listRepository = listRepository;
  }

  async execute(listId, newName) {
    const listUpdateEntity = new ListName(newName).value;

    const [[updatedList]] = await this.listRepository.update(listId, {
      name: listUpdateEntity,
    });

    return new ListDto(updatedList);
  }
}

module.exports = UpdateListUseCase;
