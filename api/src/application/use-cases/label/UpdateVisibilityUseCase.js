const UpdateVisibilityLabelEntity = require('../../../domain/entities/UpdateVisibilityLabelEntity');
const LabelDto = require('../../dtos/label.dto');

class UpdateVisibilityUseCase {
  constructor({ labelRepository }) {
    this.labelRepository = labelRepository;
  }

  async execute(isVisible, { cardId, labelId }) {
    if (!isVisible || typeof isVisible !== 'string') {
      throw new Error('isVisible was not provided');
    }
    if (!cardId) {
      throw new Error('cardId was not provided');
    }
    if (!labelId) {
      throw new Error('labelId was not provided');
    }

    const updateVisibilityLabelEntity = new UpdateVisibilityLabelEntity({
      isVisible,
    });

    const [updatedRows, [updatedLabel]] =
      await this.labelRepository.updateVisibility(
        { cardId, labelId },
        updateVisibilityLabelEntity,
      );

    return updatedLabel?.labelId
      ? new LabelDto(updatedLabel).updateVisibility(updatedLabel)
      : updatedRows;
  }
}

module.exports = UpdateVisibilityUseCase;
