const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string()
  .min(3)
  .max(50)
  .pattern(/^(?!.*\.\.)(?![. ])([A-Za-z0-9 _.-]{3,80})(?<![. ])$/)
  .messages({
    'string.pattern.base':
      'The name can only contain letters, numbers and spaces.',
  });

const checklistSchema = Joi.object({
  cardId: id.required(),
  checklistId: id.required(),
});

const createChecklistSchema = Joi.object({
  name: name.required(),
});

const updateCardSchema = Joi.object({
  newName: name.required(),
});

module.exports = { checklistSchema, createChecklistSchema, updateCardSchema };
