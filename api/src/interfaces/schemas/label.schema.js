const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string().min(1).max(30);
const color = Joi.string().pattern(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
const boolean = Joi.boolean();

const cardIdSchema = Joi.object({
  cardId: id.required(),
});

const projectIdSchema = Joi.object({
  projectId: id.required(),
});

const labelVisibilitySchema = Joi.object({
  cardId: id.required(),
  labelId: id.required(),
});

const projectLabelScheme = Joi.object({
  projectId: id.required(),
  cardId: id.required(),
});

const labelIdSchema = Joi.object({
  projectId: id.required(),
  labelId: id.required(),
});

const createLabelSchema = Joi.object({
  name: name.required(),
  color: color.required(),
});

const updateLabelSchema = Joi.object({
  name,
  color,
});

const updateVisibility = Joi.object({
  isVisible: boolean.required(),
});

module.exports = {
  projectLabelScheme,
  labelIdSchema,
  projectIdSchema,
  createLabelSchema,
  cardIdSchema,
  updateLabelSchema,
  updateVisibility,
  labelVisibilitySchema,
};
