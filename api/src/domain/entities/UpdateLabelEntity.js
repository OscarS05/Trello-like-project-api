const LabelName = require('../value-objects/labelName');
const LabelColor = require('../value-objects/labelColor');

class UpdateLabelEntity {
  constructor({ name, color }) {
    this.name = new LabelName(name).value;
    this.color = new LabelColor(color).value;
  }
}

module.exports = UpdateLabelEntity;
