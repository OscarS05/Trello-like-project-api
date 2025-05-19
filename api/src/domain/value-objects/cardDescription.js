const boom = require('@hapi/boom');

class CardDescription {
  constructor(value) {
    this.ensureIsValid(value);
    this.value = value;
  }

  // eslint-disable-next-line class-methods-use-this
  ensureIsValid(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw boom.badData('CardDescription must be a non-empty string.');
    }
    if (value.length > 255) {
      throw boom.badData('CardDescription cannot exceed 255 characters.');
    }
  }

  get value() {
    return this.value;
  }

  toString() {
    return this.value;
  }
}

module.exports = CardDescription;
