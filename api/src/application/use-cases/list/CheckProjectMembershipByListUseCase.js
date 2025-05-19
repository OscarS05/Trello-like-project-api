const ListDto = require('../../dtos/list.dto');

class CheckProjectMembershipByListUseCase {
  constructor({ listRepository }) {
    this.listRepository = listRepository;
  }

  async execute(userId, listId) {
    const list = await this.listRepository.checkProjectMembershipByList(
      userId,
      listId,
    );
    return new ListDto(list);
  }
}

module.exports = CheckProjectMembershipByListUseCase;
