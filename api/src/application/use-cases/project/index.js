const dbRepositories = require('../../../infrastructure/repositories/db/index');
const fileStorageRepositories = require('../../../infrastructure/repositories/storage/index');
const queues = require('../../../infrastructure/queues/index');

const GetAllProjectInformationUseCase = require('./GetAllProjectInformationUseCase');
const GetProjectUseCase = require('./GetProjectUseCase');
const GetProjectsByWorkspaceMemberUseCase = require('./GetProjectsByWorkspaceMemberUseCase');
const GetProjectsByWorkspaceUseCase = require('./GetProjectsByWorkspaceUseCase');
const CountProjectsUseCase = require('./CountProjectsUseCase');
const CreateProjectUseCase = require('./CreateProjectUseCase');
const UpdateProjectUseCase = require('./UpdateProjectUseCase');
const UpdateBackgroundProjectUseCase = require('./UpdateBackgroundProjectUseCase');
const DeleteProjectUseCase = require('./DeleteProjectUseCase');
const LoadBackgroundImageUseCase = require('./LoadBackgroundImageUseCase');

const getAllProjectInformationUseCase = new GetAllProjectInformationUseCase(
  dbRepositories
);
const getProjectUseCase = new GetProjectUseCase(dbRepositories);
const getProjectsByWorkspaceMemberUseCase =
  new GetProjectsByWorkspaceMemberUseCase(dbRepositories);
const getProjectsByWorkspaceUseCase = new GetProjectsByWorkspaceUseCase(
  dbRepositories
);
const countProjectsUseCase = new CountProjectsUseCase(dbRepositories);
const createProjectUseCase = new CreateProjectUseCase(dbRepositories);
const updateProjectUseCase = new UpdateProjectUseCase(dbRepositories);
const updateBackgroundProjectUseCase = new UpdateBackgroundProjectUseCase(
  dbRepositories,
  fileStorageRepositories
);
const deleteProjecUseCase = new DeleteProjectUseCase(
  dbRepositories,
  fileStorageRepositories
);
const loadBackgroundImageUseCase = new LoadBackgroundImageUseCase(
  dbRepositories,
  queues
);

module.exports = {
  getAllProjectInformationUseCase,
  getProjectUseCase,
  getProjectsByWorkspaceMemberUseCase,
  getProjectsByWorkspaceUseCase,
  countProjectsUseCase,
  createProjectUseCase,
  updateProjectUseCase,
  updateBackgroundProjectUseCase,
  deleteProjecUseCase,
  loadBackgroundImageUseCase,
};
