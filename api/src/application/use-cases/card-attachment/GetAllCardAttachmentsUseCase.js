const CardAttachmentDto = require('../../dtos/card-attachment.dto');

class GetAllCardAttachmentsUseCase {
  constructor({ cardAttachmentRepository }) {
    this.cardAttachmentRepository = cardAttachmentRepository;
  }

  async execute(cardId) {
    if (!cardId) throw new Error('cardId was not provided');

    const attachments = await this.cardAttachmentRepository.findAll(cardId);
    return attachments?.length > 0
      ? attachments.map((attachment) => new CardAttachmentDto(attachment))
      : [];
  }
}

module.exports = GetAllCardAttachmentsUseCase;
