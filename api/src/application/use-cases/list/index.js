const dbRepositories = require('../../../infrastructure/repositories/db/index');

const CheckProjectMembershipByListUseCase = require('./CheckProjectMembershipByListUseCase');
const GetProjectByListUseCase = require('./GetProjectByListUseCase');
const GetListUseCase = require('./GetListUseCase');
const GetAllListsUseCase = require('./GetAllListsUseCase');
const CreateListUseCase = require('./CreateListUseCase');
const UpdateListUseCase = require('./UpdateListUseCase');
const DeleteListUseCase = require('./DeleteListUseCase');

const checkProjectMembershipByListUseCase =
  new CheckProjectMembershipByListUseCase(dbRepositories);
const getProjectByListUseCase = new GetProjectByListUseCase(dbRepositories);
const getListUseCase = new GetListUseCase(dbRepositories);
const getAllListsUseCase = new GetAllListsUseCase(dbRepositories);
const createListUseCase = new CreateListUseCase(dbRepositories);
const updateListUseCase = new UpdateListUseCase(dbRepositories);
const deleteListUseCase = new DeleteListUseCase(dbRepositories);

module.exports = {
  checkProjectMembershipByListUseCase,
  getProjectByListUseCase,
  getListUseCase,
  getAllListsUseCase,
  createListUseCase,
  updateListUseCase,
  deleteListUseCase,
};
