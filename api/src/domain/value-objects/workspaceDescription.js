const boom = require('@hapi/boom');

class WorkspaceDescription {
  constructor(value) {
    if (!this.validate(value)) {
      throw boom.badData('Invalid workspace description');
    }
    this.value = value;
  }

  validate(value) {
    return typeof value === 'string' && value.length <= 255;
  }
}

module.exports = WorkspaceDescription;
