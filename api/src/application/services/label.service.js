class LabelService {
  constructor({
    getAllLabelsUseCase,
    getLabelUseCase,
    getLabelsByCardUseCase,
    createLabelUseCase,
    deleteLabelUseCase,
    updateLabelUseCase,
    updateVisibilityUseCase,
  }) {
    this.getAllLabelsUseCase = getAllLabelsUseCase;
    this.getLabelUseCase = getLabelUseCase;
    this.getLabelsByCardUseCase = getLabelsByCardUseCase;
    this.createLabelUseCase = createLabelUseCase;
    this.deleteLabelUseCase = deleteLabelUseCase;
    this.updateLabelUseCase = updateLabelUseCase;
    this.updateVisibilityUseCase = updateVisibilityUseCase;
  }

  async getAllLabels(projectId) {
    return this.getAllLabelsUseCase.execute(projectId);
  }

  async getLabelsByCard(cardId) {
    return this.getLabelsByCardUseCase.execute(cardId);
  }

  async createLabel(projectId, cardId, labelData) {
    return this.createLabelUseCase.execute(projectId, cardId, labelData);
  }

  async updateVisibilityLabel(isVisible, { cardId, labelId }) {
    return this.updateVisibilityUseCase.execute(isVisible, {
      cardId,
      labelId,
    });
  }

  async updateLabel(labelId, labelData) {
    return this.updateLabelUseCase.execute(labelId, labelData);
  }

  async deleteLabel(labelId) {
    return this.deleteLabelUseCase.execute(labelId);
  }
}

module.exports = LabelService;
