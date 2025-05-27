const boom = require('@hapi/boom');

class RemoveMemberUseCase {
  constructor({ projectMemberRepository, projectRepository }) {
    this.projectMemberRepository = projectMemberRepository;
    this.projectRepository = projectRepository;
  }

  async deleteProjectMember(projectMemberId) {
    const removedMember =
      await this.projectMemberRepository.delete(projectMemberId);
    if (removedMember === 0) {
      throw boom.internal('Something went wrong removing the project member');
    }
    return removedMember;
  }

  async execute(
    requesterAsProjectMember,
    projectMemberToBeRemoved,
    projectMembers,
  ) {
    if (!requesterAsProjectMember?.id) {
      throw boom.badRequest('requesterAsProjectMember was not provided');
    }
    if (!projectMemberToBeRemoved?.id) {
      throw boom.badRequest('projectMemberToBeRemoved was not provided');
    }
    if (!Array.isArray(projectMembers) || projectMembers.length === 0) {
      throw boom.badRequest('Invalid project members data');
    }

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
      const removedProject = await this.projectRepository.delete(
        projectMemberToBeRemoved.projectId,
      );
      if (removedProject === 0) {
        throw boom.internal('Something went wrong removing the project');
      }
      return removedProject;
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

    if (newProjectOwner) {
      await this.projectMemberRepository.transferOwnership(
        projectMemberToBeRemoved.projectId,
        projectMemberToBeRemoved,
        newProjectOwner,
      );
    }

    return this.deleteProjectMember(projectMemberToBeRemoved.id);
  }
}

module.exports = RemoveMemberUseCase;
