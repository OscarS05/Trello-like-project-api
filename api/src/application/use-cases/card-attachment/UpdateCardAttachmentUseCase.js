const Boom = require('@hapi/boom');
const EntityUpdateCardAttachment = require('../../../domain/entities/EntityUpdateCardAttachment');
const CardAttachmentDto = require('../../dtos/card-attachment.dto');

class UpdateCardAttachmentUseCase {
  constructor({ cardAttachmentRepository }) {
    this.cardAttachmentRepository = cardAttachmentRepository;
  }

  async execute(cardAttachment, cardAttachmentData) {
    if (!cardAttachment?.id) {
      throw new Error('cardAttachment was not provided');
    }

    if (cardAttachment.type !== 'external-link') {
      // eslint-disable-next-line no-unused-expressions, no-param-reassign
      delete cardAttachmentData.url || null;
    }

    const entityUpdateCardAttachment = new EntityUpdateCardAttachment(
      cardAttachmentData,
    );

    const [affectedRows, [updatedAttachment]] =
      await this.cardAttachmentRepository.update(
        cardAttachment.id,
        entityUpdateCardAttachment,
      );

    if (affectedRows === 0) {
      throw Boom.badRequest('Something went wrong updating the attachment');
    }

    return new CardAttachmentDto(updatedAttachment);
  }
}

module.exports = UpdateCardAttachmentUseCase;
