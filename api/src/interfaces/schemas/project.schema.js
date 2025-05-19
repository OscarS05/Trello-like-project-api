const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string()
  .min(3)
  .max(50)
  .pattern(/^[a-zA-Z0-9-_ ]+$/)
  .messages({
    'string.pattern.base': 'The project name contains illegal characters',
  });
const visibility = Joi.string().valid('private', 'workspace');
const backgroundImage = Joi.string()
  .uri()
  .pattern(/^https:\/\/images\.unsplash\.com\//)
  .messages({
    'string.pattern.base': 'Only images from Unsplash are allowed.',
  });

const projectIdSchema = Joi.object({
  workspaceId: id.required(),
  projectId: id.required(),
});

const projectId = Joi.object({
  projectId: id.required(),
});

const createProject = Joi.object({
  name: name.required(),
  visibility: visibility.required(),
  backgroundUrl: backgroundImage.required(),
});

const updateProject = Joi.object({
  name,
  visibility: visibility.allow(null, ''),
});

module.exports = { createProject, updateProject, projectIdSchema, projectId };
