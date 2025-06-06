const boom = require('@hapi/boom');
const WorkspaceMemberDto = require('../../dtos/workspaceMember.dto');

class UpdateRoleUseCase {
  constructor({ workspaceMemberRepository }) {
    this.workspaceMemberRepository = workspaceMemberRepository;
  }

  async execute(workspaceId, workspaceMemberToUpdateRole, newRole) {
    if (!newRole) {
      throw boom.badData('newRole was not provided');
    }
    if (!workspaceId) {
      throw boom.badData('workspaceId was not provided');
    }
    if (!workspaceMemberToUpdateRole) {
      throw boom.badData('workspaceMemberToUpdateRole was not provided');
    }

    if (workspaceId !== workspaceMemberToUpdateRole.workspaceId)
      throw boom.badData(
        'The workspace member to update the role does not belong to the workspace',
      );
    if (newRole === 'owner') {
      throw boom.badData('The owner role cannot be set.');
    }
    if (workspaceMemberToUpdateRole.role === 'owner')
      throw boom.forbidden("You cannot change the owner's role");

    if (workspaceMemberToUpdateRole.role === newRole)
      throw boom.conflict('The member already has this role');

    const [updatedRows, [updatedMember]] =
      await this.workspaceMemberRepository.updateRole(
        workspaceMemberToUpdateRole.id,
        newRole,
      );
    if (updatedRows !== 1) {
      throw boom.internal('Something went wrong updating the workspace member');
    }
    return new WorkspaceMemberDto(updatedMember);
  }
}

module.exports = UpdateRoleUseCase;
