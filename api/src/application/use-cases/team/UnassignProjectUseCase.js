const boom = require('@hapi/boom');

class UnassignProjectUseCase {
  constructor({ teamRepository, projectMemberRepository }) {
    this.teamRepository = teamRepository;
    this.projectMemberRepository = projectMemberRepository;
  }

  async unassignProject(teamId, projectId) {
    return this.teamRepository.unassignProject(teamId, projectId);
  }

  async execute(
    removeTeamMembersFromProject,
    teamMembers,
    projectMembers,
    teamId,
    projectId,
  ) {
    if (!removeTeamMembersFromProject)
      return this.unassignProject(teamId, projectId);

    return this.unassignProjectRemovingMembers(
      teamMembers,
      projectMembers,
      teamId,
      projectId,
    );
  }

  async unassignProjectRemovingMembers(
    teamMembers,
    projectMembers,
    teamId,
    projectId,
  ) {
    const projectMembersInTeam = await this.handleTeamMembersInProject(
      teamMembers,
      projectMembers,
      projectId,
    );
    const unassignedProject = await this.unassignProject(teamId, projectId);

    const removedMembers = await Promise.all(
      projectMembersInTeam.map((member) =>
        this.projectMemberRepository.delete(member.id),
      ),
    );
    return { unassignedProject, removedMembers };
  }

  async handleTeamMembersInProject(teamMembers, projectMembers, projectId) {
    const teamMembersAsWorkspaceMemberIds = new Set(
      teamMembers.map((member) => member.workspaceMemberId),
    );
    const projectMembersInTeam = projectMembers.filter((member) =>
      teamMembersAsWorkspaceMemberIds.has(member.workspaceMemberId),
    );

    if (projectMembersInTeam.length === 0) return [];

    const projectMembersNotInTeam = projectMembers.filter(
      (projectMember) =>
        !teamMembers.some(
          (teamMember) =>
            teamMember.workspaceMemberId === projectMember.workspaceMemberId,
        ),
    );
    if (projectMembersNotInTeam.length === 0) {
      throw boom.forbidden(
        `The team members cannot be removed from the project because all project members are part of the team. ` +
          `Please, add a new member to the project ${projectId} before unassigning the team, or delete the project first`,
      );
    }
    const teamMemberIsOwnerOnProject = projectMembersInTeam.find(
      (member) => member.role === 'owner',
    );
    if (teamMemberIsOwnerOnProject) {
      const newOwner =
        projectMembersNotInTeam.find((member) => member.role === 'admin') ||
        projectMembersNotInTeam.find((member) => member.role === 'member');
      if (!newOwner)
        throw boom.forbidden(
          'Cannot transfer ownership because no suitable owner is available.',
        );

      await this.projectMemberRepository.transferOwnership(
        projectId,
        teamMemberIsOwnerOnProject,
        newOwner,
      );
    }

    return projectMembersInTeam;
  }
}

module.exports = UnassignProjectUseCase;
