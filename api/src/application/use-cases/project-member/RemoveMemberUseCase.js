const boom = require('@hapi/boom');

class RemoveMemberUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async deleteProjectMember(projectMemberId) {
    return this.projectMemberRepository.delete(projectMemberId);
  }

  async execute(
    requesterAsProjectMember,
    projectMemberToBeRemoved,
    projectMembers,
  ) {
    if (
      requesterAsProjectMember.role === 'admin' &&
      projectMemberToBeRemoved.role === 'owner'
    ) {
      throw boom.forbidden('You cannot remove the owner');
    }

    if (requesterAsProjectMember.id === projectMemberToBeRemoved.id) {
      return this.leaveTheProject(projectMemberToBeRemoved, projectMembers);
    }

    return this.deleteProjectMember(projectMemberToBeRemoved.id);
  }

  async leaveTheProject(projectMemberToBeRemoved, projectMembers) {
    return projectMemberToBeRemoved.role === 'owner'
      ? this.handleOwnerExit(projectMemberToBeRemoved, projectMembers)
      : this.deleteProjectMember(projectMemberToBeRemoved.id);
  }

  async handleOwnerExit(projectMemberToBeRemoved, projectMembers) {
    if (projectMembers.length === 1 && projectMembers[0].role === 'owner') {
      return this.projectRepository.delete(projectMemberToBeRemoved.projectId);
    }

    const admins = [];
    const members = [];

    projectMembers.forEach((member) => {
      if (member.role === 'admin') admins.push(member);
      if (member.role === 'member') members.push(member);
    });

    const newProjectOwner =
      // eslint-disable-next-line no-nested-ternary
      admins.length > 0 ? admins[0] : members.length > 0 ? members[0] : null;
    if (!newProjectOwner)
      throw boom.badImplementation(
        'No suitable member found to transfer project ownership',
      );

    await this.projectMemberRepository.transferOwnership(
      projectMemberToBeRemoved.projectId,
      projectMemberToBeRemoved,
      newProjectOwner,
    );

    return this.deleteProjectMember(projectMemberToBeRemoved.id);
  }
}

module.exports = RemoveMemberUseCase;
