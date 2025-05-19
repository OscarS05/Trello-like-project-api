const Boom = require('@hapi/boom');
const EntityUpdateCardAttachment = require('../../../domain/entities/EntityUpdateCardAttachment');
const CardAttachmentDto = require('../../dtos/card-attachment.dto');

class UpdateCardAttachmentUseCase {
  constructor({ cardAttachmentRepository }) {
    this.cardAttachmentRepository = cardAttachmentRepository;
  }

  async execute(cardAttachment, cardAttachmentData) {
    if (cardAttachment.type !== 'external-link')
      // eslint-disable-next-line no-unused-expressions, no-param-reassign
      delete cardAttachmentData.url || null;

    const entityUpdateCardAttachment = new EntityUpdateCardAttachment(
      cardAttachmentData,
    );

    const [[updatedAttachment]] = await this.cardAttachmentRepository.update(
      cardAttachment.id,
      entityUpdateCardAttachment,
    );
    if (!updatedAttachment?.id)
      throw Boom.badRequest('Something went wrong updating the attachment');

    return new CardAttachmentDto(updatedAttachment);
  }
}

module.exports = UpdateCardAttachmentUseCase;
