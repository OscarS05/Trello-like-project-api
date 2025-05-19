const boom = require('@hapi/boom');
const LabelEntity = require('../../../domain/entities/LabelEntity');
const LabelDto = require('../../dtos/label.dto');

class CreateLabelUseCase {
  constructor({ labelRepository }) {
    this.labelRepository = labelRepository;
  }

  async execute(projectId, cardId, labelData) {
    const labelEntity = new LabelEntity({ projectId, ...labelData });

    const newLabel = await this.labelRepository.create(labelEntity);
    if (!newLabel?.id)
      throw boom.badRequest('Something went wrong creating the label');

    const visibilityOfLabel =
      await this.labelRepository.createVisibilityOfLabel(cardId, newLabel.id);
    if (!visibilityOfLabel?.isVisible)
      throw boom.badRequest('Something went wrong creating the label');

    const formattedData = newLabel.get({ plain: true });
    return new LabelDto({
      ...formattedData,
      isVisible: visibilityOfLabel.isVisible || undefined,
    });
  }
}

module.exports = CreateLabelUseCase;
