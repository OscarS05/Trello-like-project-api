const boom = require('@hapi/boom');
const TeamMemberDto = require('../../dtos/teamMember.dto');

class UpdateRoleUseCase {
  constructor({ teamMemberRepository }) {
    this.teamMemberRepository = teamMemberRepository;
  }

  async execute(teamMember, newRole) {
    if (teamMember.role === 'owner')
      throw boom.forbidden('You cannot change the role to the owner');
    if (teamMember.role === newRole)
      throw boom.conflict(`The team member already has the role: ${newRole}`);

    const [[updatedMember]] = await this.teamMemberRepository.updateRole(
      teamMember.id,
      newRole,
    );
    return new TeamMemberDto(updatedMember);
  }
}

module.exports = UpdateRoleUseCase;
