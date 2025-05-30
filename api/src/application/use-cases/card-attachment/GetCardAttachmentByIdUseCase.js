class GetCardAttachmentByIdUseCase {
  constructor({ cardAttachmentRepository }) {
    this.cardAttachmentRepository = cardAttachmentRepository;
  }

  async execute(cardId, cardAttachmentId) {
    if (!cardId) throw new Error('cardId was not provided');
    if (!cardAttachmentId) throw new Error('cardAttachmentId was not provided');

    const attachment = await this.cardAttachmentRepository.findOne(
      cardId,
      cardAttachmentId,
    );
    if (attachment?.id) {
      return attachment?.get ? attachment?.get({ plain: true }) : attachment;
    }
    return {};
  }
}

module.exports = GetCardAttachmentByIdUseCase;
