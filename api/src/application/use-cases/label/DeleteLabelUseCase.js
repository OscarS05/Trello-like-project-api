class DeleteLabelUseCase {
  constructor({ labelRepository }) {
    this.labelRepository = labelRepository;
  }

  async execute(labelId) {
    return this.labelRepository.delete(labelId);
  }
}

module.exports = DeleteLabelUseCase;
