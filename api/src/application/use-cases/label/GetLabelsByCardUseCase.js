const LabelDto = require('../../dtos/label.dto');

class GetLabelsByCardUseCase {
  constructor({ labelRepository }) {
    this.labelRepository = labelRepository;
  }

  async execute(cardId) {
    if (!cardId) throw new Error('cardId was not provided');

    const cardWithLabels = await this.labelRepository.findLabelsByCard(cardId);

    return cardWithLabels?.labels?.length > 0
      ? cardWithLabels.labels.map((label) => {
          const labelData =
            typeof label?.get === 'function'
              ? label.get({ plain: true })
              : label;
          return new LabelDto({
            ...labelData,
            isVisible: label.CardLabel?.isVisible || undefined,
          });
        })
      : [];
  }
}

module.exports = GetLabelsByCardUseCase;
