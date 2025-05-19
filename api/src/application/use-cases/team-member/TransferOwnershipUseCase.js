const boom = require('@hapi/boom');

class TransferOwnershipUseCase {
  constructor({ teamMemberRepository }) {
    this.teamMemberRepository = teamMemberRepository;
  }

  async execute(currentTeamMember, newTeamMember) {
    if (currentTeamMember.teamId !== newTeamMember.teamId)
      throw boom.conflict(
        'The new team member does not belong to the workspace',
      );
    if (currentTeamMember.id === newTeamMember.id)
      throw boom.conflict('You cannot transfer ownership yourself');
    if (newTeamMember.role === 'owner')
      throw boom.conflict('The new team member already has the role: owner');

    return this.teamMemberRepository.transferOwnership(
      newTeamMember.teamId,
      currentTeamMember,
      newTeamMember,
    );
  }
}

module.exports = TransferOwnershipUseCase;
