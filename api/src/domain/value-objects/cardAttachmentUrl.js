const Boom = require('@hapi/boom');

class CardAttachmentUrl {
  constructor(url) {
    this.validate(url);
    this.url = url;
  }

  // eslint-disable-next-line class-methods-use-this
  validate(url) {
    const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/;
    if (!url || typeof url !== 'string' || !urlPattern.test(url))
      throw Boom.badData('Invalid card attachment URL');
  }

  get value() {
    return this.url;
  }

  toString() {
    return this.url;
  }
}

module.exports = CardAttachmentUrl;
