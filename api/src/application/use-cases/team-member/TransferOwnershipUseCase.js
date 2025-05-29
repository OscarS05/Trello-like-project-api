const boom = require('@hapi/boom');

class TransferOwnershipUseCase {
  constructor({ teamMemberRepository }) {
    this.teamMemberRepository = teamMemberRepository;
  }

  async execute(currentTeamMember, newTeamMember) {
    if (!currentTeamMember?.id) {
      throw new Error('currentTeamMember was not provided');
    }
    if (!newTeamMember?.id) {
      throw new Error('newTeamMember was not provided');
    }

    if (currentTeamMember.teamId !== newTeamMember.teamId)
      throw boom.conflict('The new team member does not belong to the team');
    if (currentTeamMember.id === newTeamMember.id)
      throw boom.conflict('You cannot transfer ownership yourself');
    if (newTeamMember.role === 'owner')
      throw boom.conflict('The new team member already has the role: owner');

    const updatedMember = await this.teamMemberRepository.transferOwnership(
      newTeamMember.teamId,
      currentTeamMember,
      newTeamMember,
    );

    if (!updatedMember?.id) {
      throw new Error(
        'Something went wrong transfer the ownership. Zero rows was affected',
      );
    }

    return updatedMember;
  }
}

module.exports = TransferOwnershipUseCase;
