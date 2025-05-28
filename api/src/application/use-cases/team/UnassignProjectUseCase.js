const boom = require('@hapi/boom');

class UnassignProjectUseCase {
  constructor({ teamRepository, projectMemberRepository }) {
    this.teamRepository = teamRepository;
    this.projectMemberRepository = projectMemberRepository;
  }

  async unassignProject(teamId, projectId) {
    if (!teamId) throw new Error('teamId was not provided');
    if (!projectId) throw new Error('teamId was not provided');

    const result = await this.teamRepository.unassignProject(teamId, projectId);
    if (result === 0) {
      throw new Error('Something went wrong unassigning the project');
    }
    return result;
  }

  async execute(
    removeTeamMembersFromProject,
    teamMembers,
    projectMembers,
    teamId,
    projectId,
  ) {
    if (!teamId) throw new Error('teamId was not provided');
    if (!projectId) throw new Error('projectId was not provided');
    if (!Array.isArray(teamMembers)) {
      throw new Error('teamMembers provided is not an array');
    }
    if (!Array.isArray(projectMembers)) {
      throw new Error('projectMembers provided is not an array');
    }
    if (typeof removeTeamMembersFromProject !== 'boolean') {
      throw new Error('removeTeamMembersFromProject must be a boolean');
    }

    if (!removeTeamMembersFromProject) {
      return this.unassignProject(teamId, projectId);
    }

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
