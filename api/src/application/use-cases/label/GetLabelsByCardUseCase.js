const LabelDto = require('../../dtos/label.dto');

class GetLabelsByCardUseCase {
  constructor({ labelRepository }) {
    this.labelRepository = labelRepository;
  }

  async execute(cardId) {
    const cardWithLabels = await this.labelRepository.findLabelsByCard(cardId);

    return cardWithLabels?.labels?.length > 0
      ? cardWithLabels.labels.map((label) => {
          const labelData = label.get({ plain: true });
          return new LabelDto({
            ...labelData,
            isVisible: label.CardLabel?.isVisible || undefined,
          });
        })
      : [];
  }
}

module.exports = GetLabelsByCardUseCase;
