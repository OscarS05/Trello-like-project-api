const Boom = require('@hapi/boom');
const CardAttachmentEntity = require('../../../domain/entities/CardAttachmentEntity');
const CardAttachmentDto = require('../../dtos/card-attachment.dto');

class SaveCardAttachmentUseCase {
  constructor({ cardAttachmentRepository }) {
    this.cardAttachmentRepository = cardAttachmentRepository;
  }

  async execute(cardAttachmentData) {
    const cardAttachmentEntity = new CardAttachmentEntity(cardAttachmentData);

    const newCardAttachment = await this.cardAttachmentRepository.create(
      cardAttachmentEntity
    );

    if (!newCardAttachment?.id) {
      throw Boom.badRequest(
        'Something went wrong creating the attachment in DB'
      );
    }

    return new CardAttachmentDto(newCardAttachment);
  }
}

module.exports = SaveCardAttachmentUseCase;
