const dbRepositories = require('../../../infrastructure/repositories/db/index');

const GetItemMembersByIdsUseCase = require('./GetItemMembersByIdsUseCase');
const GetAllByProjectMemberUseCase = require('./GetAllByProjectMemberUseCase');
const GetAllItemMembersUseCase = require('./GetAllItemMembersUseCase');
const AddMemberToItemUseCase = require('./AddMemberToItemUseCase');
const DeleteChecklistItemUseCase = require('./DeleteChecklistItemUseCase');

const getItemMembersByIdsUseCase = new GetItemMembersByIdsUseCase(
  dbRepositories,
);
const getAllByProjectMemberUseCase = new GetAllByProjectMemberUseCase(
  dbRepositories,
);
const getAllItemMembersUseCase = new GetAllItemMembersUseCase(dbRepositories);
const addMemberToItemUseCase = new AddMemberToItemUseCase(dbRepositories);
const deleteChecklistItemUseCase = new DeleteChecklistItemUseCase(
  dbRepositories,
);

module.exports = {
  getItemMembersByIdsUseCase,
  getAllByProjectMemberUseCase,
  getAllItemMembersUseCase,
  addMemberToItemUseCase,
  deleteChecklistItemUseCase,
};
