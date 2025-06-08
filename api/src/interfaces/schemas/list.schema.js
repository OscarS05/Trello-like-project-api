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

const listIdSchema = Joi.object({
  listId: id.required(),
});

const listSchema = Joi.object({
  workspaceId: id.required(),
  projectId: id.required(),
  listId: id.required(),
});

const listNameSchema = Joi.object({
  name: name.required(),
});

const updateListSchema = Joi.object({
  newName: name.required(),
});

module.exports = { listNameSchema, listIdSchema, updateListSchema, listSchema };
