const boom = require('@hapi/boom');

const ProjectMemberDto = require('../../dtos/projectMember.dto');

class UpdateRoleUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(memberToBeUpdated, newRole) {
    if (!memberToBeUpdated?.id) {
      throw boom.badRequest('Member to be updated was not provided');
    }
    if (!newRole) throw boom.badRequest('New role was not provided');

    if (memberToBeUpdated.role === 'owner')
      throw boom.forbidden("You cannot change the owner's role");
    if (memberToBeUpdated.role === newRole)
      throw boom.conflict('The member already has this role');

    const [updatedRows, [updatedMember]] =
      await this.projectMemberRepository.updateRole(
        memberToBeUpdated.id,
        newRole,
      );

    if (updatedRows === 0) {
      throw boom.notFound(
        'Something went wrong. Project member not found or role not changed',
      );
    }
    return new ProjectMemberDto(updatedMember);
  }
}

module.exports = UpdateRoleUseCase;
