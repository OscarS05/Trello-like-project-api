const CardEntity = require('../../../domain/entities/CardEntity');
const CardDto = require('../../dtos/card.dto');

class CreateCardUseCase {
  constructor({ cardRepository }) {
    this.cardRepository = cardRepository;
  }

  async execute(listId, cardData) {
    if (!listId) throw new Error('listId was not provided');

    const cardEntity = new CardEntity(cardData);
    const card = await this.cardRepository.create(listId, cardEntity);

    if (!card?.id) {
      throw new Error('Something went wrong creating the card.');
    }

    return new CardDto(card);
  }
}

module.exports = CreateCardUseCase;
