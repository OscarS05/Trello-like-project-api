const boom = require('@hapi/boom');

class WorkspaceName {
  constructor(value) {
    if (!this.validate(value)) {
      throw boom.badData('Invalid workspace name');
    }
    this.value = value;
  }

  // eslint-disable-next-line class-methods-use-this
  validate(value) {
    return typeof value === 'string' && value.length > 3 && value.length <= 50;
  }
}

module.exports = WorkspaceName;
