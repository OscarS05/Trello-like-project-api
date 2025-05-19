class GetCardAttachmentByIdUseCase {
  constructor({ cardAttachmentRepository }) {
    this.cardAttachmentRepository = cardAttachmentRepository;
  }

  async execute(cardId, cardAttachmentId) {
    const attachment = await this.cardAttachmentRepository.findOne(
      cardId,
      cardAttachmentId,
    );
    return attachment?.id ? attachment.get({ plain: true }) : {};
  }
}

module.exports = GetCardAttachmentByIdUseCase;
