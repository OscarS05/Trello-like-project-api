class DeleteLabelUseCase {
  constructor({ labelRepository }) {
    this.labelRepository = labelRepository;
  }

  async execute(labelId) {
    if (!labelId) {
      throw new Error('labelId was not provided');
    }

    const result = await this.labelRepository.delete(labelId);

    if (result === 0) {
      throw new Error(
        'Something went wrong deleting the label. Maybe, the label does don exist',
      );
    }

    return result;
  }
}

module.exports = DeleteLabelUseCase;
