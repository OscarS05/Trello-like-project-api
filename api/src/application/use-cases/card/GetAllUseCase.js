class GetAllUseCase {
  constructor({ cardRepository }) {
    this.cardRepository = cardRepository;
  }

  async execute(listId) {
    if (!listId) throw new Error('listId was not provided');

    const cards = await this.cardRepository.findAll(listId);

    return cards?.length > 0 ? cards : [];
  }
}

module.exports = GetAllUseCase;
