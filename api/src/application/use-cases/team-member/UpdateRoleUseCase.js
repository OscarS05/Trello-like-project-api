const boom = require('@hapi/boom');
const TeamMemberDto = require('../../dtos/teamMember.dto');

class UpdateRoleUseCase {
  constructor({ teamMemberRepository }) {
    this.teamMemberRepository = teamMemberRepository;
  }

  async execute(teamMember, newRole) {
    if (!teamMember?.id) {
      throw new Error('teamMember to be updated was not provided');
    }
    if (!newRole && typeof newRole !== 'string') {
      throw new Error('newRole is invalid or was not provided');
    }

    if (teamMember.role === 'owner')
      throw boom.forbidden('You cannot change the role to the owner');
    if (teamMember.role === newRole)
      throw boom.conflict(`The team member already has the role: ${newRole}`);

    const [updatedRows, [updatedMember]] =
      await this.teamMemberRepository.updateRole(teamMember.id, newRole);

    if (updatedRows === 0) {
      throw new Error('Something went wrong updating the role');
    }

    return new TeamMemberDto(updatedMember);
  }
}

module.exports = UpdateRoleUseCase;
