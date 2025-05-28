class DeleteTeamUseCase {
  constructor({ teamRepository, projectMemberRepository }) {
    this.teamRepository = teamRepository;
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(teamId, projectMembersInTeam) {
    if (!teamId) throw new Error('teamId was not provided');
    if (!Array.isArray(projectMembersInTeam)) {
      throw new Error('projectMembersInTeam is not an array');
    }

    const teamDeleted = await this.teamRepository.delete(teamId);
    if (teamDeleted === 0) {
      throw new Error('Something went wrong deleting the team');
    }

    const teamMembersDeletedFromProjects =
      projectMembersInTeam.length > 0
        ? await Promise.all(
            projectMembersInTeam.map((member) =>
              this.projectMemberRepository.delete(member.id),
            ),
          )
        : [];

    if (teamMembersDeletedFromProjects.some((t) => t === 0)) {
      throw new Error(
        `Something went wrong deleting some the project member. Result db: ${teamMembersDeletedFromProjects}`,
      );
    }

    return { teamDeleted, teamMembersDeletedFromProjects };
  }
}

module.exports = DeleteTeamUseCase;
