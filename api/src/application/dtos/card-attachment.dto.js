class CardAttachmentDto {
  constructor({ id, filename, url, cardId, type, createdAt }) {
    this.id = id;
    this.filename = filename;
    this.url = url;
    this.cardId = cardId;
    this.type = type;
    this.createdAt = createdAt;
  }
}

module.exports = CardAttachmentDto;
