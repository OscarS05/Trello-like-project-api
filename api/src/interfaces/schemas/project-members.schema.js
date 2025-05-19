const Joi = require('joi');

const id = Joi.string().uuid();
const role = Joi.string().valid('member', 'admin');

const addProjectMember = Joi.object({
  workspaceMemberId: id.required(),
});

const roleChangeSchema = Joi.object({
  newRole: role.required(),
});

const projectMemberSchemas = Joi.object({
  workspaceId: id.required(),
  projectId: id.required(),
  projectMemberId: id.required(),
});

module.exports = {
  addProjectMember,
  projectMemberSchemas,
  roleChangeSchema,
};
