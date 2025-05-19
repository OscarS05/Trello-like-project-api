const dbRepositories = require('../../../infrastructure/repositories/db/index');

const CountTeamsUseCase = require('./CountTeamsUseCase');
const GetTeamsByWorkspaceMemberUseCase = require('./GetTeamsByWorkspaceMemberUseCase');
const GetAllProjectsAssignedUseCase = require('./GetAllProjectsAssignedUseCase');
const GetProjectAssignedUseCase = require('./GetProjectAssignedUseCase');
const GetTeamUseCase = require('./GetTeamUseCase');
const GetTeamsByWorkspaceUseCase = require('./GetTeamsByWorkspaceUseCase');
const CreateTeamUseCase = require('./CreateTeamUseCase');
const AssignProjectUseCase = require('./AssignProjectUseCase');
const UpdateTeamUseCase = require('./UpdateTeamUseCase');
const UnassignProjectUseCase = require('./UnassignProjectUseCase');
const DeleteTeamUseCase = require('./DeleteTeamUseCase');

const countTeamsUseCase = new CountTeamsUseCase(dbRepositories);
const getTeamsByWorkspaceMemberUseCase = new GetTeamsByWorkspaceMemberUseCase(
  dbRepositories,
);
const getAllProjectsAssignedUseCase = new GetAllProjectsAssignedUseCase(
  dbRepositories,
);
const getProjectAssignedUseCase = new GetProjectAssignedUseCase(dbRepositories);
const getTeamUseCase = new GetTeamUseCase(dbRepositories);
const getTeamsByWorkspaceUseCase = new GetTeamsByWorkspaceUseCase(
  dbRepositories,
);
const createTeamUseCase = new CreateTeamUseCase(dbRepositories);
const assignProjectUseCase = new AssignProjectUseCase(dbRepositories);
const updateTeamUseCase = new UpdateTeamUseCase(dbRepositories);
const unassignProjectUseCase = new UnassignProjectUseCase(dbRepositories);
const deleteTeamUseCase = new DeleteTeamUseCase(dbRepositories);

module.exports = {
  countTeamsUseCase,
  createTeamUseCase,
  getTeamsByWorkspaceMemberUseCase,
  getAllProjectsAssignedUseCase,
  getProjectAssignedUseCase,
  assignProjectUseCase,
  getTeamUseCase,
  getTeamsByWorkspaceUseCase,
  updateTeamUseCase,
  unassignProjectUseCase,
  deleteTeamUseCase,
};
