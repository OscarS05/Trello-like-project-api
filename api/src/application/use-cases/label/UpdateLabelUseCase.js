const UpdateLabelEntity = require('../../../domain/entities/UpdateLabelEntity');
const LabelDto = require('../../dtos/label.dto');

class UpdateLabelUseCase {
  constructor({ labelRepository }) {
    this.labelRepository = labelRepository;
  }

  async execute(labelId, labelData) {
    if (!labelId) throw new Error('labelId was not provided');

    const updateLabelEntity = new UpdateLabelEntity(labelData);

    const [updatedRows, [updatedLabel]] = await this.labelRepository.update(
      labelId,
      updateLabelEntity,
    );
    return updatedLabel?.id ? new LabelDto(updatedLabel) : updatedRows;
  }
}

module.exports = UpdateLabelUseCase;
