const boom = require('@hapi/boom');

class ListName {
  #value;

  constructor(value) {
    this.validate(value);
    this.#value = value;
  }

  validate(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw boom.badData('ListName must be a non-empty string.');
    }

    if (value.length > 80) {
      throw boom.badData('ListName cannot exceed 80 characters.');
    }
  }

  get value() {
    return this.#value;
  }

  toString() {
    return this.#value;
  }
}

module.exports = ListName;
