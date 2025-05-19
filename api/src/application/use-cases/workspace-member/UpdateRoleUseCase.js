const boom = require('@hapi/boom');
const WorkspaceMemberDto = require('../../dtos/workspaceMember.dto');

class UpdateRoleUseCase {
  constructor({ workspaceMemberRepository }) {
    this.workspaceMemberRepository = workspaceMemberRepository;
  }

  async execute(workspaceId, workspaceMemberToUpdateRole, newRole) {
    if (workspaceId !== workspaceMemberToUpdateRole.workspaceId)
      throw boom.badData(
        'The workspace member to update the role does not belong to the workspace',
      );
    if (workspaceMemberToUpdateRole.role === 'owner')
      throw boom.forbidden("You cannot change the owner's role");
    if (workspaceMemberToUpdateRole.role === newRole)
      throw boom.conflict('The member already has this role');

    const [[updatedMember]] = await this.workspaceMemberRepository.updateRole(
      workspaceMemberToUpdateRole.id,
      newRole,
    );
    return new WorkspaceMemberDto(updatedMember);
  }
}

module.exports = UpdateRoleUseCase;
