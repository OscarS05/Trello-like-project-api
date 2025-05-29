const CardDto = require('../../dtos/card.dto');

class CheckProjectMemberByCardAndListUseCase {
  constructor({ cardRepository }) {
    this.cardRepository = cardRepository;
  }

  async execute(userId, listId, cardId) {
    if (!userId) throw new Error('userId was not provided');
    if (!listId) throw new Error('listId was not provided');
    if (!cardId) throw new Error('cardId was not provided');

    const card = await this.cardRepository.checkProjectMemberByCardAndList(
      userId,
      listId,
      cardId,
    );

    return card?.id ? new CardDto(card) : {};
  }
}

module.exports = CheckProjectMemberByCardAndListUseCase;
