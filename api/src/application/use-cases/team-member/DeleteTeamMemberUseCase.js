const boom = require('@hapi/boom');

class DeleteTeamMemberUseCase {
  constructor({ teamMemberRepository, teamRepository }) {
    this.teamMemberRepository = teamMemberRepository;
    this.teamRepository = teamRepository;
  }

  async deleteTeamMember(teamMemberId) {
    if (!teamMemberId) throw new Error('teamMemberId was not provided');

    const deletedMember = await this.teamMemberRepository.delete(teamMemberId);

    if (deletedMember === 0) {
      throw boom.badImplementation(
        'Something went wrong. Failed to delete the team member',
      );
    }

    return deletedMember;
  }

  async execute(requesterAsTeamMember, memberToBeRemoved, teamMembers) {
    if (!requesterAsTeamMember?.id) {
      throw new Error('requesterAsTeamMember was not provided');
    }
    if (!memberToBeRemoved?.id) {
      throw new Error('requesterAsTeamMember was not provided');
    }
    if (!Array.isArray(teamMembers)) {
      throw new Error('teamMembers is not an array');
    }
    if (teamMembers?.length === 0) {
      throw new Error(
        'teamMembers is not valid because must have almost 1 member',
      );
    }

    if (requesterAsTeamMember.teamId !== memberToBeRemoved.teamId) {
      throw boom.conflict(
        'The team member to be removed does not belong in the team',
      );
    }
    if (
      requesterAsTeamMember.role !== 'owner' &&
      memberToBeRemoved.role === 'owner'
    ) {
      throw boom.forbidden('You cannot remove the team owner');
    }

    if (requesterAsTeamMember.id === memberToBeRemoved.id) {
      return this.leaveTheTeam(memberToBeRemoved, teamMembers);
    }
    return this.deleteTeamMember(memberToBeRemoved.id);
  }

  async leaveTheTeam(memberToBeRemoved, teamMembers) {
    return memberToBeRemoved.role === 'owner'
      ? this.handleOwnerExit(memberToBeRemoved, teamMembers)
      : this.deleteTeamMember(memberToBeRemoved.id);
  }

  async handleOwnerExit(memberToBeRemoved, teamMembers) {
    if (teamMembers.length === 1 && teamMembers[0].role === 'owner') {
      return this.teamRepository.delete(memberToBeRemoved.teamId);
    }

    const admins = [];
    const members = [];

    teamMembers.forEach((member) => {
      if (member.role === 'admin') admins.push(member);
      if (member.role === 'member') members.push(member);
    });

    const newOwner =
      // eslint-disable-next-line no-nested-ternary
      admins.length > 0 ? admins[0] : members.length > 0 ? members[0] : null;
    if (!newOwner?.id)
      throw boom.conflict(
        'There are no members available to transfer ownership before leaving the team',
      );

    await this.teamMemberRepository.transferOwnership(
      memberToBeRemoved.teamId,
      memberToBeRemoved,
      newOwner,
    );
    return this.deleteTeamMember(memberToBeRemoved.id);
  }
}

module.exports = DeleteTeamMemberUseCase;
