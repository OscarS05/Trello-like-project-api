const CardAttachmentDto = require('../../dtos/card-attachment.dto');

class GetAllCardAttachmentsUseCase {
  constructor({ cardAttachmentRepository }) {
    this.cardAttachmentRepository = cardAttachmentRepository;
  }

  async execute(cardId) {
    const attachments = await this.cardAttachmentRepository.findAll(cardId);
    return attachments?.length > 0
      ? attachments.map((attachment) => new CardAttachmentDto(attachment))
      : [];
  }
}

module.exports = GetAllCardAttachmentsUseCase;
