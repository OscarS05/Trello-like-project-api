class DeleteCardUseCase {
  constructor({ cardRepository }) {
    this.cardRepository = cardRepository;
  }

  async execute(cardId) {
    if (!cardId) throw new Error('cardId was not provided');

    const result = await this.cardRepository.delete(cardId);

    if (result === 0) {
      throw new Error(
        'Something went wrong deleting the card. Maybe the cardId does not exist',
      );
    }

    return result;
  }
}

module.exports = DeleteCardUseCase;
