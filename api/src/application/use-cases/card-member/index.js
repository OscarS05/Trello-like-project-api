const dbRepositories = require('../../../infrastructure/repositories/db/index');

const GetAllCardMembersUseCase = require('./GetAllCardMembersUseCase');
const GetCardMemberUseCase = require('./GetCardMemberUseCase');
const AddMemberToCardUseCase = require('./AddMemberToCardUseCase');
const DeleteCardMemberUseCase = require('./DeleteCardMemberUseCase');

const getAllCardMembersUseCase = new GetAllCardMembersUseCase(dbRepositories);
const getCardMemberUseCase = new GetCardMemberUseCase(dbRepositories);
const addMemberToCardUseCase = new AddMemberToCardUseCase(dbRepositories);
const deleteCardMemberUseCase = new DeleteCardMemberUseCase(dbRepositories);

module.exports = {
  getAllCardMembersUseCase,
  getCardMemberUseCase,
  addMemberToCardUseCase,
  deleteCardMemberUseCase,
};
