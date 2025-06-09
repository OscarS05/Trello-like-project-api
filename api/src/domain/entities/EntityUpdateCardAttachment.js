const boom = require('@hapi/boom');
const CardAttachmentFileName = require('../value-objects/cardAttachmentFileName');
const CardAttachmentUrl = require('../value-objects/cardAttachmentUrl');

class EntityUpdateCardAttachment {
  constructor({ filename, url }) {
    if (!filename && !url) {
      throw boom.badRequest(
        'At least one of them must be provided (filename, url)',
      );
    }

    if (filename) this.filename = new CardAttachmentFileName(filename).value;
    if (url) this.url = new CardAttachmentUrl(url).value;
  }
}

module.exports = EntityUpdateCardAttachment;
