const dbRepositories = require('../../../infrastructure/repositories/db/index');

const GetTeamMembersByIdUseCase = require('./GetTeamMembersByIdUseCase');
const GetTeamProjectsByTeamMemberUseCase = require('./GetTeamProjectsByTeamMemberUseCase');
const GetTeamMemberUseCase = require('./GetTeamMemberUseCase');
const GetTeamMemberByIdUseCase = require('./GetTeamMemberByIdUseCase');
const AddMemberUseCase = require('./AddMemberUseCase');
const UpdateRoleUseCase = require('./UpdateRoleUseCase');
const TransferOwnershipUseCase = require('./TransferOwnershipUseCase');
const DeleteTeamMemberUseCase = require('./DeleteTeamMemberUseCase');

const getTeamProjectsByTeamMemberUseCase =
  new GetTeamProjectsByTeamMemberUseCase(dbRepositories);
const getTeamMembersByIdUseCase = new GetTeamMembersByIdUseCase(dbRepositories);
const getTeamMemberUseCase = new GetTeamMemberUseCase(dbRepositories);
const getTeamMemberByIdUseCase = new GetTeamMemberByIdUseCase(dbRepositories);
const addMemberUseCase = new AddMemberUseCase(dbRepositories);
const updateRoleUseCase = new UpdateRoleUseCase(dbRepositories);
const transferOwnershipUseCase = new TransferOwnershipUseCase(dbRepositories);
const deleteTeamMemberUseCase = new DeleteTeamMemberUseCase(dbRepositories);

module.exports = {
  getTeamProjectsByTeamMemberUseCase,
  getTeamMembersByIdUseCase,
  getTeamMemberUseCase,
  getTeamMemberByIdUseCase,
  addMemberUseCase,
  updateRoleUseCase,
  transferOwnershipUseCase,
  deleteTeamMemberUseCase,
};
