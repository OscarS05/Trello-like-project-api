const ListDto = require('../../dtos/list.dto');

class CheckProjectMembershipByListUseCase {
  constructor({ listRepository }) {
    this.listRepository = listRepository;
  }

  async execute(userId, listId) {
    if (!userId) throw new Error('userId was not provided');
    if (!listId) throw new Error('listId was not provided');

    const list = await this.listRepository.checkProjectMembershipByList(
      userId,
      listId,
    );
    return list?.id ? new ListDto(list) : {};
  }
}

module.exports = CheckProjectMembershipByListUseCase;
