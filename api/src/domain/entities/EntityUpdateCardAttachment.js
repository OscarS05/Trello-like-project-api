const CardAttachmentFileName = require('../value-objects/cardAttachmentFileName');
const CardAttachmentUrl = require('../value-objects/cardAttachmentUrl');

class EntityUpdateCardAttachment {
  constructor({ filename, url }) {
    this.filename = new CardAttachmentFileName(filename).value;
    if(url) this.url = new CardAttachmentUrl(url).value;
  }
}

module.exports = EntityUpdateCardAttachment;
