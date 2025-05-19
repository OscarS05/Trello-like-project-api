class CardService {
  constructor({
    getAllUseCase,
    getAllCardInformationUseCase,
    getCardUseCase,
    createCardUseCase,
    checkProjectMemberByCardAndListUseCase,
    getProjectMemberByCardUseCase,
    updateCardUseCase,
    deleteCardUseCase,
  }) {
    this.getAllCardInformationUseCase = getAllCardInformationUseCase;
    this.getAllUseCase = getAllUseCase;
    this.getCardUseCase = getCardUseCase;
    this.checkProjectMemberByCardAndListUseCase =
      checkProjectMemberByCardAndListUseCase;
    this.createCardUseCase = createCardUseCase;
    this.updateCardUseCase = updateCardUseCase;
    this.deleteCardUseCase = deleteCardUseCase;
    this.getProjectMemberByCardUseCase = getProjectMemberByCardUseCase;
  }

  async create(cardData) {
    return this.createCardUseCase.execute(cardData.listId, cardData);
  }

  async update(cardId, cardData) {
    return this.updateCardUseCase.execute(cardId, cardData);
  }

  async delete(cardId) {
    return this.deleteCardUseCase.execute(cardId);
  }

  async findById(cardId) {
    return this.getCardUseCase.execute(cardId);
  }

  async getAllCardInformation(listId, cardId) {
    return this.getAllCardInformationUseCase.execute(listId, cardId);
  }

  async findAll(listId) {
    return this.getAllUseCase.execute(listId);
  }

  async checkProjectMemberByCardAndList(userId, listId, cardId) {
    return this.checkProjectMemberByCardAndListUseCase.execute(
      userId,
      listId,
      cardId,
    );
  }

  async getProjectMemberByCard(userId, cardId) {
    return this.getProjectMemberByCardUseCase.execute(userId, cardId);
  }
}

module.exports = CardService;
