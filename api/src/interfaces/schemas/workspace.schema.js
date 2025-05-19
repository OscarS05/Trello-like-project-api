const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string()
  .min(3)
  .max(50)
  .pattern(/^[a-zA-Z0-9-_ ]+$/)
  .messages({
    'string.pattern.base': 'The workspace name contains illegal characters',
  });
const description = Joi.string()
  .max(255)
  .pattern(/^[a-zA-Z0-9-_ ]+$/)
  .messages({
    'string.pattern.base': 'The description contains illegal characters',
  });

const createWorkspace = Joi.object({
  name: name.required(),
  description: description.allow(null, ''),
});

const updateWorkspace = Joi.object({
  name,
  description: description.allow(null, ''),
});

const workspaceIdSchema = Joi.object({
  workspaceId: id.required(),
});

module.exports = { createWorkspace, updateWorkspace, workspaceIdSchema };
