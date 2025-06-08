const boom = require('@hapi/boom');
const CardName = require('../../../domain/value-objects/cardName');
const CardDescription = require('../../../domain/value-objects/cardDescription');
const CardDto = require('../../dtos/card.dto');

class UpdateCardUseCase {
  constructor({ cardRepository }) {
    this.cardRepository = cardRepository;
  }

  async execute(cardId, cardData) {
    if (!cardId) throw new Error('cardId was not provided');
    if (!cardData?.newName && !cardData?.description) {
      throw new Error('cardData was not provided');
    }

    let cardName = null;
    let cardDescription = null;

    if (cardData?.newName) {
      cardName = new CardName(cardData.newName).value;
    }
    if (cardData?.description) {
      cardDescription = new CardDescription(cardData.description).value;
    }

    const changes = {
      ...(cardName && { name: cardName }),
      ...(cardDescription && { description: cardDescription }),
    };

    const [updatedRows, [updatedCard]] = await this.cardRepository.update(
      cardId,
      changes,
    );
    if (updatedRows === 0) throw boom.badRequest('Zero rows updated');
    return new CardDto(updatedCard);
  }
}

module.exports = UpdateCardUseCase;
