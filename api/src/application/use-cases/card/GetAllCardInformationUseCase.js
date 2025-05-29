const CardDto = require('../../dtos/card.dto');

class GetAllCardInformationUseCase {
  constructor({ cardRepository }) {
    this.cardRepository = cardRepository;
  }

  async execute(listId, cardId) {
    if (!listId) throw new Error('listId was not provided');
    if (!cardId) throw new Error('cardId was not provided');

    const card = await this.cardRepository.findAllCardInformation(
      listId,
      cardId,
    );

    return card?.id ? CardDto.withAllCardInformation(card) : {};
  }
}

module.exports = GetAllCardInformationUseCase;
