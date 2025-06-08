/* eslint-disable no-param-reassign */
const LabelDto = require('../../dtos/label.dto');

class UpdateVisibilityUseCase {
  constructor({ labelRepository }) {
    this.labelRepository = labelRepository;
  }

  async execute(isVisible, { cardId, labelId }) {
    if (typeof isVisible !== 'boolean') {
      if (isVisible !== 'false' && isVisible !== 'true') {
        throw new Error('isVisible was not provided');
      }
    }
    if (!cardId) {
      throw new Error('cardId was not provided');
    }
    if (!labelId) {
      throw new Error('labelId was not provided');
    }
    if (isVisible === 'false') isVisible = false;
    if (isVisible === 'true') isVisible = true;

    const [updatedRows, [updatedLabel]] =
      await this.labelRepository.updateVisibility(
        { cardId, labelId },
        { isVisible },
      );

    return updatedLabel?.labelId
      ? new LabelDto(updatedLabel).updateVisibility(updatedLabel)
      : updatedRows;
  }
}

module.exports = UpdateVisibilityUseCase;
