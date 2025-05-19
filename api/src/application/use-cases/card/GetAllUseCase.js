class GetAllUseCase {
  constructor({ cardRepository }) {
    this.cardRepository = cardRepository;
  }

  async execute(listId) {
    return this.cardRepository.findAll(listId);
  }
}

module.exports = GetAllUseCase;
