const Boom = require('@hapi/boom');
const CardAttachmentEntity = require('../../../domain/entities/CardAttachmentEntity');
const CardAttachmentDto = require('../../dtos/card-attachment.dto');

class SaveCardAttachmentUseCase {
  constructor({ cardAttachmentRepository }) {
    this.cardAttachmentRepository = cardAttachmentRepository;
  }

  async execute(cardAttachmentData) {
    if (!cardAttachmentData?.id) {
      throw new Error('cardAttachment was not provided');
    }
    if (!cardAttachmentData?.cardId) throw new Error('cardId was not provided');
    if (!cardAttachmentData?.type || !cardAttachmentData?.publicId) {
      throw new Error(
        'cardAttachmentData does not contain the data of the saved attachment',
      );
    }

    const cardAttachmentEntity = new CardAttachmentEntity(cardAttachmentData);

    const newCardAttachment =
      await this.cardAttachmentRepository.create(cardAttachmentEntity);

    if (!newCardAttachment?.id) {
      throw Boom.badRequest(
        'Something went wrong creating the attachment in DB',
      );
    }

    return new CardAttachmentDto(newCardAttachment);
  }
}

module.exports = SaveCardAttachmentUseCase;
