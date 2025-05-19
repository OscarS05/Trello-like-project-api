const dbRepositories = require('../../../infrastructure/repositories/db/index');

const GetAllCardInformationUseCase = require('./GetAllCardInformationUseCase');
const GetAllUseCase = require('./GetAllUseCase');
const GetCardUseCase = require('./GetCardUseCase');
const CheckProjectMemberByCardAndListUseCase = require('./CheckProjectMemberByCardAndList');
const CreateCardUseCase = require('./CreateCardUseCase');
const UpdateCardUseCase = require('./UpdateCardUseCase');
const DeleteCardUseCase = require('./DeleteCardUseCase');
const GetProjectMemberByCardUseCase = require('./GetProjectMemberByCardUseCase');

const getAllCardInformationUseCase = new GetAllCardInformationUseCase(
  dbRepositories,
);
const getAllUseCase = new GetAllUseCase(dbRepositories);
const getCardUseCase = new GetCardUseCase(dbRepositories);
const checkProjectMemberByCardAndListUseCase =
  new CheckProjectMemberByCardAndListUseCase(dbRepositories);
const createCardUseCase = new CreateCardUseCase(dbRepositories);
const updateCardUseCase = new UpdateCardUseCase(dbRepositories);
const deleteCardUseCase = new DeleteCardUseCase(dbRepositories);
const getProjectMemberByCardUseCase = new GetProjectMemberByCardUseCase(
  dbRepositories,
);

module.exports = {
  getAllCardInformationUseCase,
  getAllUseCase,
  getCardUseCase,
  checkProjectMemberByCardAndListUseCase,
  createCardUseCase,
  updateCardUseCase,
  deleteCardUseCase,
  getProjectMemberByCardUseCase,
};
