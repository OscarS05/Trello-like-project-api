const ListName = require('../../../domain/value-objects/listName');
const ListDto = require('../../dtos/list.dto');

class UpdateListUseCase {
  constructor({ listRepository }) {
    this.listRepository = listRepository;
  }

  async execute(listId, newName) {
    if (!listId) throw new Error('listId was not provided');

    const listUpdateEntity = new ListName(newName).value;

    const [affectedRows, [updatedList]] = await this.listRepository.update(
      listId,
      {
        name: listUpdateEntity,
      },
    );

    if (affectedRows === 0) {
      throw new Error(
        'Something went wrong updating the list. Maybe the list does not exist',
      );
    }

    return new ListDto(updatedList);
  }
}

module.exports = UpdateListUseCase;
