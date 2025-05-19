class DeleteCardUseCase {
  constructor({ cardRepository }) {
    this.cardRepository = cardRepository;
  }

  async execute(cardId) {
    return this.cardRepository.delete(cardId);
  }
}

module.exports = DeleteCardUseCase;
