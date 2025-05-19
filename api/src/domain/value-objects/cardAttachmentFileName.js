const Boom = require('@hapi/boom');

class CardAttachmentFileName {
  static VALID_EXTENSIONS = {
    image: ['jpeg', 'avif', 'jpg', 'png', 'svg'],
    pdf: ['pdf'],
    word: ['doc', 'docx'],
    excel: ['xls', 'xlsx'],
    powerpoint: ['ppt', 'pptx'],
  };

  static ALLOWED_CHARACTERS_REGEX = /^[a-zA-Z0-9_\-.\s]+$/;

  static MAX_LENGTH_NO_EXTENSION = 225;

  constructor(value) {
    this.validate(value);
    this.value = value;
  }

  validate(value) {
    if (!value || typeof value !== 'string')
      throw Boom.badRequest('Value must be a non-empty string.');
    if (!CardAttachmentFileName.ALLOWED_CHARACTERS_REGEX.test(value))
      throw Boom.badRequest('Value contains invalid characters.');

    const extension = this.getExtension(value);
    const validExtensions = Object.values(
      CardAttachmentFileName.VALID_EXTENSIONS,
    ).flat();

    if (!extension) {
      if (value.length > CardAttachmentFileName.MAX_LENGTH_NO_EXTENSION) {
        throw Boom.badRequest(
          `Value without extension must not exceed ${CardAttachmentFileName.MAX_LENGTH_NO_EXTENSION} characters.`,
        );
      }
    } else if (!validExtensions.includes(extension)) {
      throw Boom.badRequest(
        `Invalid extension for non-file value: ${extension}`,
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getExtension(value) {
    const parts = value.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : null;
  }

  getValue() {
    return this.value;
  }
}

module.exports = CardAttachmentFileName;
