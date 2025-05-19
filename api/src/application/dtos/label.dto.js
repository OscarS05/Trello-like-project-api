class LabelDto {
  constructor({ id, projectId, name, color, isVisible, CardLabel }) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.projectId = projectId;
    this.isVisible = isVisible || CardLabel?.isVisible;
  }

  updateVisibility(updatedLabel) {
    return {
      cardId: updatedLabel.cardId,
      labelId: updatedLabel.labelId,
      isVisible: this.isVisible,
    };
  }
}

module.exports = LabelDto;
