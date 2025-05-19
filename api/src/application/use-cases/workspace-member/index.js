const dbRepositories = require('../../../infrastructure/repositories/db/index');

const GetWorkspaceMemberByIdUseCase = require('./getWorkspaceMemberByIdUseCase');
const GetWorkspaceMemberByUserIdUseCase = require('./getWorkspaceMemberByUserIdUseCase');
const GetWorkspaceMembersWithDataUseCase = require('./getWorkspaceMembersWithDataUseCase');
const GetWorkspaceMembersUseCase = require('./GetWorkspaceMembersUseCase');
const AddMemberToWorkspaceUseCase = require('./AddMemberToWorkspaceUseCase');
const UpdateRoleUseCase = require('./UpdateRoleUseCase');
const TransferOwnershipUseCase = require('./TransferOwnershipUseCase');
const RemoveWorkspaceMemberUseCase = require('./RemoveWorkspaceMemberUseCase');

const getWorkspaceMemberByIdUseCase = new GetWorkspaceMemberByIdUseCase(
  dbRepositories,
);
const getWorkspaceMemberByUserIdUseCase = new GetWorkspaceMemberByUserIdUseCase(
  dbRepositories,
);
const getWorkspaceMembersWithDataUseCase =
  new GetWorkspaceMembersWithDataUseCase(dbRepositories);
const getWorkspaceMembersUseCase = new GetWorkspaceMembersUseCase(
  dbRepositories,
);
const addMemberToWorkspaceUseCase = new AddMemberToWorkspaceUseCase(
  dbRepositories,
);
const updateRoleUseCase = new UpdateRoleUseCase(dbRepositories);
const transferOwnershipUseCase = new TransferOwnershipUseCase(dbRepositories);
const removeWorkspaceMemberUseCase = new RemoveWorkspaceMemberUseCase(
  dbRepositories,
);

module.exports = {
  getWorkspaceMemberByIdUseCase,
  getWorkspaceMemberByUserIdUseCase,
  getWorkspaceMembersWithDataUseCase,
  getWorkspaceMembersUseCase,
  addMemberToWorkspaceUseCase,
  updateRoleUseCase,
  transferOwnershipUseCase,
  removeWorkspaceMemberUseCase,
};
