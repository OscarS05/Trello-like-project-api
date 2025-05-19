const Joi = require('joi');

const id = Joi.string().uuid();
const ids = Joi.array().items(Joi.string().uuid()).messages({
  'array.includes': 'All member IDs must be uuids',
});

const checklistItemSchema = Joi.object({
  checklistId: id.required(),
  checklistItemId: id.required(),
});

const checklistItemMemberSchema = Joi.object({
  checklistId: id.required(),
  checklistItemId: id.required(),
  projectMemberId: id.required(),
});

const addMemberToItemSchema = Joi.object({
  projectMemberIds: ids.required(),
});

module.exports = {
  checklistItemSchema,
  checklistItemMemberSchema,
  addMemberToItemSchema,
};
