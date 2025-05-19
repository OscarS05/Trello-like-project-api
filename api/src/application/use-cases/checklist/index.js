const dbRepositories = require('../../../infrastructure/repositories/db/index');

const GetAllChecklistsByCardUseCase = require('./GetAllChecklistsByCardUseCase');
const GetProjectMemberByChecklistUseCase = require('./GetProjectMemberByChecklistUseCase');
const GetAllChecklistsByProjectUseCase = require('./GetAllChecklistsByProjectUseCase');
const GetChecklistUseCase = require('./GetChecklistUseCase');
const CreateChecklistUseCase = require('./CreateChecklistUseCase');
const CreateChecklistByCopyingItemsUseCase = require('./CreateChecklistByCopyingItemsUseCase');
const UpdateChecklistUseCase = require('./UpdateChecklistUseCase');
const DeleteChecklistUseCase = require('./DeleteChecklistUseCase');

const getAllChecklistsByCardUseCase = new GetAllChecklistsByCardUseCase(
  dbRepositories,
);
const getProjectMemberByChecklistUseCase =
  new GetProjectMemberByChecklistUseCase(dbRepositories);
const getAllChecklistsByProjectUseCase = new GetAllChecklistsByProjectUseCase(
  dbRepositories,
);
const getChecklistUseCase = new GetChecklistUseCase(dbRepositories);
const createChecklistUseCase = new CreateChecklistUseCase(dbRepositories);
const createChecklistByCopyingItemsUseCase =
  new CreateChecklistByCopyingItemsUseCase(dbRepositories);
const updateChecklistUseCase = new UpdateChecklistUseCase(dbRepositories);
const deleteChecklistUseCase = new DeleteChecklistUseCase(dbRepositories);

module.exports = {
  getAllChecklistsByCardUseCase,
  getProjectMemberByChecklistUseCase,
  getAllChecklistsByProjectUseCase,
  getChecklistUseCase,
  createChecklistUseCase,
  createChecklistByCopyingItemsUseCase,
  updateChecklistUseCase,
  deleteChecklistUseCase,
};
