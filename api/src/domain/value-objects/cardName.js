const boom = require('@hapi/boom');

class CardName {
  #value;

  constructor(value) {
    this.validate(value);
    this.#value = value;
  }

  // eslint-disable-next-line class-methods-use-this
  validate(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw boom.badData('CardName must be a non-empty string.');
    }

    if (value.length > 80) {
      throw boom.badData('CardName cannot exceed 80 characters.');
    }
  }

  get value() {
    return this.#value;
  }

  toString() {
    return this.#value;
  }
}

module.exports = CardName;
