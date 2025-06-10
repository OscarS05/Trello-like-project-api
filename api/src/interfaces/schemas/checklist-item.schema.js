const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string()
  .trim()
  .min(1)
  .max(50)
  .pattern(/^(?!.*\.\.)(?![. ])([A-Za-z0-9 _.-]{3,80})(?<![. ])$/)
  .messages({
    'string.pattern.base':
      'The name can only contain letters, numbers and spaces.',
  });
const dueDate = Joi.date().iso().greater('now').messages({
  'date.format': 'Due date must be a valid ISO date string',
  'date.greater': 'Due date must be in the future',
});
const isChecked = Joi.boolean();
const assignedProjectMemberIds = Joi.array()
  .items(Joi.string().uuid())
  .messages({
    'array.includes': 'All member IDs must be uuids',
  });

const checklistItemSchema = Joi.object({
  cardId: id.required(),
  checklistId: id.required(),
  checklistItemId: id.required(),
});

const createChecklistItemSchema = Joi.object({
  name: name.required(),
  assignedProjectMemberIds: assignedProjectMemberIds.optional(),
  dueDate: dueDate.optional(),
});

const updateChecklistItemSchema = Joi.object({
  name: name.required(),
  assignedProjectMemberIds: assignedProjectMemberIds.optional(),
  dueDate: dueDate.optional(),
});

const schemaUpdateCheck = Joi.object({
  isChecked: isChecked.required(),
});

module.exports = {
  checklistItemSchema,
  createChecklistItemSchema,
  updateChecklistItemSchema,
  schemaUpdateCheck,
};
