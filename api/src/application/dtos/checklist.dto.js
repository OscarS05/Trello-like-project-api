const ChecklistItemDto = require('./checklist-item.dto');

class ChecklistDto {
  constructor({ id, name, cardId, items, createdAt }) {
    this.id = id;
    this.name = name;
    this.cardId = cardId;
    this.createdAt = createdAt;
    this.items = items?.map((item) => new ChecklistItemDto(item));
  }

  static withItems(checklist) {
    return {
      items: checklist.items?.map((item) => new ChecklistItemDto(item)),
    };
  }
}

module.exports = ChecklistDto;
