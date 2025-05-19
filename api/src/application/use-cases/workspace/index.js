const dbRepositories = require('../../../infrastructure/repositories/db/index');

const CreateWorkspaceUseCase = require('./createWorkspaceUseCase');
const UpdateWorkspaceUseCase = require('./updateWorkspaceUseCase');
const DeleteWorkspaceUseCase = require('./deleteWorkspaceUseCase');
const GetWorkspacesAndProjectsUseCase = require('./getWorkspacesAndProjectsUseCase');
const GetWorkspaceAndItsProjectsUseCase = require('./getWorkspaceAndItsProjectsUseCase');
const CountWorkspacesByUserUseCase = require('./countWorkspacesByUserUseCase');

const createWorkspaceUseCase = new CreateWorkspaceUseCase(dbRepositories);
const updateWorkspaceUseCase = new UpdateWorkspaceUseCase(dbRepositories);
const deleteWorkspaceUseCase = new DeleteWorkspaceUseCase(dbRepositories);
const getWorkspacesAndProjectsUseCase = new GetWorkspacesAndProjectsUseCase(
  dbRepositories,
);
const getWorkspaceAndItsProjectsUseCase = new GetWorkspaceAndItsProjectsUseCase(
  dbRepositories,
);
const countWorkspacesByUserUseCase = new CountWorkspacesByUserUseCase(
  dbRepositories,
);

module.exports = {
  createWorkspaceUseCase,
  updateWorkspaceUseCase,
  deleteWorkspaceUseCase,
  getWorkspacesAndProjectsUseCase,
  getWorkspaceAndItsProjectsUseCase,
  countWorkspacesByUserUseCase,
};
