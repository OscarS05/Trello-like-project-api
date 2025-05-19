const dbRepositories = require('../../../infrastructure/repositories/db/index');

const GetAllMembersByIdUseCase = require('./GetAllMembersByIdUseCase');
const GetProjectMembersOfWorkspaceMemberUseCase = require('./GetProjectMembersOfWorkspaceMemberUseCase');
const GetProjectMembersByProjectUseCase = require('./GetProjectMembersByProjectUseCase');
const GetProjectMemberByUserUseCase = require('./GetProjectMemberByUserUseCase');
const GetProjectMemberByWorkspaceMemberUseCase = require('./GetProjectMemberByWorkspaceMemberUseCase');
const GetProjectWithItsMembersAndTeamsUseCase = require('./GetProjectWithItsMembersAndTeamsUseCase');
const GetMemberByIdUseCase = require('./GetMemberByIdUseCase');
const AddMemberToProjectUseCase = require('./AddMemberToProjectUseCase');
const UpdateRoleUseCase = require('./UpdateRoleUseCase');
const TransferOwnershipUseCase = require('./TransferOwnershipUseCase');
const RemoveMemberUseCase = require('./RemoveMemberUseCase');
const CheckProjectMembershipByUserUseCase = require('./CheckProjectMembershipByUserUseCase');

const getAllMembersByIdUseCase = new GetAllMembersByIdUseCase(dbRepositories);
const getProjectMembersOfWorkspaceMemberUseCase =
  new GetProjectMembersOfWorkspaceMemberUseCase(dbRepositories);
const getProjectMembersByProjectUseCase = new GetProjectMembersByProjectUseCase(
  dbRepositories,
);
const getProjectMemberByUserUseCase = new GetProjectMemberByUserUseCase(
  dbRepositories,
);
const getProjectMemberByWorkspaceMemberUseCase =
  new GetProjectMemberByWorkspaceMemberUseCase(dbRepositories);
const getProjectWithItsMembersAndTeamsUseCase =
  new GetProjectWithItsMembersAndTeamsUseCase(dbRepositories);
const getMemberByIdUseCase = new GetMemberByIdUseCase(dbRepositories);
const addMemberToProjectUseCase = new AddMemberToProjectUseCase(dbRepositories);
const updateRoleUseCase = new UpdateRoleUseCase(dbRepositories);
const transferOwnershipUseCase = new TransferOwnershipUseCase(dbRepositories);
const removeMemberUseCase = new RemoveMemberUseCase(dbRepositories);
const checkProjectMembershipByUserUseCase =
  new CheckProjectMembershipByUserUseCase(dbRepositories);

module.exports = {
  getAllMembersByIdUseCase,
  getProjectMembersOfWorkspaceMemberUseCase,
  getProjectMemberByWorkspaceMemberUseCase,
  getProjectMembersByProjectUseCase,
  getProjectMemberByUserUseCase,
  getProjectWithItsMembersAndTeamsUseCase,
  getMemberByIdUseCase,
  addMemberToProjectUseCase,
  updateRoleUseCase,
  transferOwnershipUseCase,
  removeMemberUseCase,
  checkProjectMembershipByUserUseCase,
};
