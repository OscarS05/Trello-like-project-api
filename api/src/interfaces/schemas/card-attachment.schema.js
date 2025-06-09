const Joi = require('joi');

const id = Joi.string().uuid();
const filename = Joi.string()
  .min(1)
  .max(255)
  .pattern(/^(?!.*\.\.)(?![. ])([A-Za-z0-9 _.-]{3,80})(?<![. ])$/)
  .messages({
    'string.pattern.base':
      'The name can only contain letters, numbers and spaces.',
  });
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
  filename: filename.optional(),
  url: url.optional(),
});

module.exports = {
  attachLink,
  cardAttachmentSchema,
  updateCardAttachmentSchema,
};
