class Email {
  constructor(value) {
    this.validate(value);
    this.value = value;
  }

  validate(email) {
    if (/\s/.test(email)) {
      throw new Error('The email must not contain spaces');
    }

    if ((email.match(/@/g) || []).length !== 1) {
      throw new Error('The email must contain only one @');
    }

    const domain = email.split('@')[1];
    if (!domain || domain.indexOf('.') === -1) {
      throw new Error('The email domain is not valid');
    }

    if (/^[.@]|[.@]$/.test(email)) {
      throw new Error('The email must not start or end with . or @');
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error('The email is not in the correct format');
    }
    return true;
  }
}

module.exports = Email;
