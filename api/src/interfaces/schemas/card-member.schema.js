const Joi = require('joi');

const id = Joi.string().uuid();

const cardIdSchema = Joi.object({
  cardId: id.required(),
});

const cardMemberSchema = Joi.object({
  cardId: id.required(),
  projectMemberId: id.required(),
});

module.exports = { cardIdSchema, cardMemberSchema };
