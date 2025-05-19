const boom = require('@hapi/boom');

class ListService {
  constructor({
    getProjectByListUseCase,
    createListUseCase,
    getAllListsUseCase,
    getListUseCase,
    updateListUseCase,
    deleteListUseCase,
    checkProjectMembershipByListUseCase,
  }) {
    this.getProjectByListUseCase = getProjectByListUseCase;
    this.checkProjectMembershipByListUseCase =
      checkProjectMembershipByListUseCase;
    this.getListUseCase = getListUseCase;
    this.getAllListsUseCase = getAllListsUseCase;
    this.createListUseCase = createListUseCase;
    this.updateListUseCase = updateListUseCase;
    this.deleteListUseCase = deleteListUseCase;
  }

  async create(listData) {
    return this.createListUseCase.execute(listData);
  }

  async update(projectId, listId, newName) {
    const list = await this.getList(projectId, listId);
    if (!list?.id) throw boom.notFound('The list to be updated was not found');
    return this.updateListUseCase.execute(listId, newName);
  }

  async delete(projectId, listId) {
    const list = await this.getList(projectId, listId);
    if (!list?.id) throw boom.notFound('The list to be deleted was not found');
    return this.deleteListUseCase.execute(projectId, listId);
  }

  async getList(projectId, listId) {
    return this.getListUseCase.execute(projectId, listId);
  }

  async findAll(projectId) {
    return this.getAllListsUseCase.execute(projectId);
  }

  async projectMembershipByList(userId, listId) {
    return this.checkProjectMembershipByListUseCase.execute(userId, listId);
  }

  async getProjectByList(listId) {
    return this.getProjectByListUseCase.execute(listId);
  }
}

module.exports = ListService;
