const CardDto = require('../../dtos/card.dto');

class GetCardUseCase {
  constructor({ cardRepository }) {
    this.cardRepository = cardRepository;
  }

  async execute(cardId) {
    const card = await this.cardRepository.findOneById(cardId);
    return new CardDto(card);
  }
}

module.exports = GetCardUseCase;
