const boom = require('@hapi/boom');

const ProjectMemberDto = require('../../dtos/projectMember.dto');

class UpdateRoleUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(memberToBeUpdated, newRole) {
    if (memberToBeUpdated.role === 'owner')
      throw boom.forbidden("You cannot change the owner's role");
    if (memberToBeUpdated.role === newRole)
      throw boom.conflict('The member already has this role');

    const [[updatedMember]] = await this.projectMemberRepository.updateRole(
      memberToBeUpdated.id,
      newRole,
    );
    return new ProjectMemberDto(updatedMember);
  }
}

module.exports = UpdateRoleUseCase;
