const dbRepositories = require('../../../infrastructure/repositories/db/index');

const CheckListItemByIdAndProjectUseCase = require('./CheckListItemByIdAndProjectUseCase');
const GetChecklistItemByIdUseCase = require('./GetChecklistItemByIdUseCase');
const GetAllChecklistItemsUseCase = require('./GetAllChecklistItemsUseCase');
const CreateChecklistItemUseCase = require('./CreateChecklistItemUseCase');
const UpdateChecklistItemUseCase = require('./UpdateChecklistItemUseCase');
const UpdateTheCheckOfItemUseCase = require('./UpdateTheCheckOfItemUseCase');
const DeleteChecklistItemUseCase = require('./DeleteChecklistItemUseCase');

const checkListItemByIdAndProjectUseCase =
  new CheckListItemByIdAndProjectUseCase(dbRepositories);
const getChecklistItemByIdUseCase = new GetChecklistItemByIdUseCase(
  dbRepositories,
);
const getAllChecklistItemsUseCase = new GetAllChecklistItemsUseCase(
  dbRepositories,
);
const createChecklistItemUseCase = new CreateChecklistItemUseCase(
  dbRepositories,
);
const updateChecklistItemUseCase = new UpdateChecklistItemUseCase(
  dbRepositories,
);
const updateTheCheckOfItemUseCase = new UpdateTheCheckOfItemUseCase(
  dbRepositories,
);
const deleteChecklistItemUseCase = new DeleteChecklistItemUseCase(
  dbRepositories,
);

module.exports = {
  checkListItemByIdAndProjectUseCase,
  getChecklistItemByIdUseCase,
  getAllChecklistItemsUseCase,
  createChecklistItemUseCase,
  updateChecklistItemUseCase,
  updateTheCheckOfItemUseCase,
  deleteChecklistItemUseCase,
};
