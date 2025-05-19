const Joi = require('joi');

const id = Joi.string().uuid();
const role = Joi.string().valid('member', 'admin');

const memberToBeAdded = Joi.object({
  workspaceMemberId: id.required(),
});

const roleChangeSchema = Joi.object({
  newRole: role.required(),
});

const teamMemberSchemas = Joi.object({
  workspaceId: id.required(),
  teamId: id.required(),
  teamMemberId: id.required(),
});

module.exports = {
  memberToBeAdded,
  teamMemberSchemas,
  roleChangeSchema,
};
