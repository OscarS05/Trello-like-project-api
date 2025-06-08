const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string()
  .min(3)
  .max(80)
  .pattern(/^[A-Za-z0-9 ]+$/)
  .messages({
    'string.pattern.base':
      'The name can only contain letters, numbers and spaces.',
  });
const description = Joi.string().max(255);

const cardIdSchema = Joi.object({
  cardId: id.required(),
});

const cardSchemas = Joi.object({
  listId: id.required(),
  cardId: id.required(),
});

const createCardSchema = Joi.object({
  name: name.required(),
  description,
});

const updateCardSchema = Joi.object({
  newName: name.optional(),
  description,
});

module.exports = {
  cardSchemas,
  createCardSchema,
  updateCardSchema,
  cardIdSchema,
};
