const boom = require('@hapi/boom');

class TeamName {
  #value;

  constructor(value) {
    this.#validate(value);
    this.#value = value;
  }

  // eslint-disable-next-line class-methods-use-this
  #validate(value) {
    if (!value || typeof value !== 'string') {
      throw boom.badData('Team name must be a non-empty string.');
    }

    const trimmedValue = value.trim();
    if (trimmedValue.length < 3 || trimmedValue.length > 50) {
      throw boom.badData('Team name must be between 3 and 50 characters long.');
    }

    const invalidCharacters = /[^a-zA-Z0-9\s]/;
    if (invalidCharacters.test(trimmedValue)) {
      throw boom.badData('Team name contains invalid characters.');
    }
  }

  get value() {
    return this.#value;
  }
}

module.exports = TeamName;
