const CardDto = require('../../dtos/card.dto');

class CheckProjectMemberByCardAndListUseCase {
  constructor({ cardRepository }) {
    this.cardRepository = cardRepository;
  }

  async execute(userId, listId, cardId) {
    const card = await this.cardRepository.checkProjectMemberByCardAndList(
      userId,
      listId,
      cardId,
    );
    return new CardDto(card);
  }
}

module.exports = CheckProjectMemberByCardAndListUseCase;
