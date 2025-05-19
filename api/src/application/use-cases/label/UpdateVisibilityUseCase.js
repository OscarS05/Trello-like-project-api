const UpdateVisibilityLabelEntity = require('../../../domain/entities/UpdateVisibilityLabelEntity');
const LabelDto = require('../../dtos/label.dto');

class UpdateVisibilityUseCase {
  constructor({ labelRepository }) {
    this.labelRepository = labelRepository;
  }

  async execute(isVisible, { cardId, labelId }) {
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
