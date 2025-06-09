const Boom = require('@hapi/boom');

class DeleteCardAttachmentUseCase {
  constructor({ cardAttachmentRepository }, { cloudinaryStorageRepository }) {
    this.cardAttachmentRepository = cardAttachmentRepository;
    this.cloudinaryStorageRepository = cloudinaryStorageRepository;
  }

  async execute(cardAttachment) {
    if (!cardAttachment?.id) throw new Error('cardId was not provided');

    if (cardAttachment.type !== 'external-link') {
      const deletedInStorage = await this.cloudinaryStorageRepository.destroy(
        cardAttachment.publicId,
      );

      if (deletedInStorage?.result !== 'ok') {
        throw Boom.badRequest('Failed to delete file from Cloudinary');
      }
    }

    const result = await this.cardAttachmentRepository.delete(
      cardAttachment.id,
    );

    if (result === 0) {
      throw new Error('Something went wrong deleting the attachment');
    }

    return result;
  }
}

module.exports = DeleteCardAttachmentUseCase;
