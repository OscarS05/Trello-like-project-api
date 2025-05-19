const boom = require('@hapi/boom');

class CardAttachmentService {
  constructor({
    getAllCardAttachmentsUseCase,
    getCardAttachmentByIdUseCase,
    saveCardAttachmentUseCase,
    updateCardAttachmentUseCase,
    deleteCardAttachmentUseCase,
    addJobForAttachmentsUseCase,
  }) {
    this.getAllCardAttachmentsUseCase = getAllCardAttachmentsUseCase;
    this.getCardAttachmentByIdUseCase = getCardAttachmentByIdUseCase;
    this.saveCardAttachmentUseCase = saveCardAttachmentUseCase;
    this.updateCardAttachmentUseCase = updateCardAttachmentUseCase;
    this.deleteCardAttachmentUseCase = deleteCardAttachmentUseCase;
    this.addJobForAttachmentsUseCase = addJobForAttachmentsUseCase;
  }

  async getAllCardAttachments(cardId) {
    return this.getAllCardAttachmentsUseCase.execute(cardId);
  }

  async createJobForAttachment(fileData, folder, cardId) {
    const addedJob = await this.saveCardAttachmentUseCase.execute(
      fileData,
      folder,
      cardId,
    );
    if (!addedJob.id || !addedJob.name)
      throw boom.badData('Something went wrong loading the file in the queue');
    return addedJob;
  }

  async addJobForAttachments({ fileData, folder, cardId }) {
    return this.addJobForAttachmentsUseCase.execute({
      fileData,
      folder,
      cardId,
    });
  }

  async saveCardAttachment(cardAttachmentData) {
    return this.saveCardAttachmentUseCase.execute(cardAttachmentData);
  }

  async updateCardAttachment(cardId, attachmentId, cardAttachmentData) {
    const cardAttachment = await this.getCardAttachmentById(
      cardId,
      attachmentId,
    );
    if (!cardAttachment?.id)
      throw boom.notFound(
        'The card attachment does not exist or does not belong to the card',
      );
    return this.updateCardAttachmentUseCase.execute(
      cardAttachment,
      cardAttachmentData,
    );
  }

  async deleteCardAttachment(cardId, attachmentId) {
    const cardAttachment = await this.getCardAttachmentById(
      cardId,
      attachmentId,
    );
    if (!cardAttachment?.id)
      throw boom.notFound(
        'The card attachment does not exist or does not belong to the card',
      );
    return this.deleteCardAttachmentUseCase.execute(cardAttachment);
  }

  async getCardAttachmentById(cardId, attachmentId) {
    return this.getCardAttachmentByIdUseCase.execute(cardId, attachmentId);
  }
}

module.exports = CardAttachmentService;
