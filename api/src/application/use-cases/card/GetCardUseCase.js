const CardDto = require('../../dtos/card.dto');

class GetCardUseCase {
  constructor({ cardRepository }) {
    this.cardRepository = cardRepository;
  }

  async execute(cardId) {
    if (!cardId) throw new Error('cardId was not provided');

    const card = await this.cardRepository.findOneById(cardId);

    return card?.id ? new CardDto(card) : {};
  }
}

module.exports = GetCardUseCase;
