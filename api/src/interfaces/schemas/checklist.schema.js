const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string().min(3).max(50);

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
