const CardDto = require('./card.dto');

class ListDto {
  constructor({ id, name, projectId, cards, createdAt }) {
    this.id = id;
    this.name = name;
    this.projectId = projectId;
    this.createdAt = createdAt;
    this.cards = cards?.map(card => new CardDto(card));
  }

  static withCards(list) {
    return {
      id: list.id,
      name: list.name,
      projectId: list.projectId,
      createdAt: list.createdAt,
      cards: list.cards?.map(card => CardDto.withAllCardInformation(card)),
    }
  }
}

module.exports = ListDto;
