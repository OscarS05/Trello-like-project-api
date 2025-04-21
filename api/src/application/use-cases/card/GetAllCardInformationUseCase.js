const CardDto = require("../../dtos/card.dto");

class GetAllCardInformationUseCase {
  constructor({ cardRepository }) {
    this.cardRepository = cardRepository;
  }

  async execute(listId, cardId) {
    const card = await this.cardRepository.findAllCardInformation(listId, cardId);
    return CardDto.withAllCardInformation(card);
  }
}

module.exports = GetAllCardInformationUseCase;
