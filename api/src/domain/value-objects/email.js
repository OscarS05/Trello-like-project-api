const boom = require('@hapi/boom');

class Email {
  constructor(value) {
    if (!this.validate(value)) {
      throw boom.badData('The email is not valid');
    }
    this.value = value;
  }

  // eslint-disable-next-line class-methods-use-this
  validate(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
}

module.exports = Email;
