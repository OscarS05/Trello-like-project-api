const Boom = require('@hapi/boom');

class DeleteCardAttachmentUseCase {
  constructor({ cardAttachmentRepository }, { cloudinaryStorageRepository }) {
    this.cardAttachmentRepository = cardAttachmentRepository;
    this.cloudinaryStorageRepository = cloudinaryStorageRepository;
  }

  async execute(cardAttachment) {
    if (cardAttachment.type !== 'external-link') {
      const deletedInStorage = await this.cloudinaryStorageRepository.destroy(
        cardAttachment.publicId,
      );
      if (deletedInStorage?.result !== 'ok')
        throw Boom.badRequest('Failed to delete file from Cloudinary');
    }

    return this.cardAttachmentRepository.delete(cardAttachment.id);
  }
}

module.exports = DeleteCardAttachmentUseCase;
