const Joi = require('joi');

const id = Joi.string().uuid();
const filename = Joi.string().min(1).max(255);
const url = Joi.string().uri();

const attachLink = Joi.object({
  filename: filename.required(),
  url: url.required(),
});

const cardAttachmentSchema = Joi.object({
  cardId: id.required(),
  attachmentId: id.required(),
});

const updateCardAttachmentSchema = Joi.object({
  filename: filename.required(),
  url: url.optional(),
});

module.exports = {
  attachLink,
  cardAttachmentSchema,
  updateCardAttachmentSchema,
};
