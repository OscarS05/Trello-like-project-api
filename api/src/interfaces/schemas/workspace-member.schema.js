const Joi = require('joi');

const id = Joi.string().uuid();
const role = Joi.string().valid('member', 'admin');

const createWorkspaceMember = Joi.object({
  userId: id.required(),
});

const updateWorkspaceMember = Joi.object({
  newRole: role.required(),
});

const updateWorkspaceMemberIdParams = Joi.object({
  workspaceId: id.required(),
  workspaceMemberId: id.required(),
});

const removeMember = Joi.object({
  workspaceId: id.required(),
  workspaceMemberId: id.required(),
});

module.exports = {
  createWorkspaceMember,
  updateWorkspaceMember,
  updateWorkspaceMemberIdParams,
  removeMember,
};
