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

    const teamMembersAsProjectMembersIds =
      projectMembersInTeam.length > 0
        ? projectMembersInTeam.map((member) => member.id)
        : [];

    let teamMembersDeletedFromProjects = 0;

    if (teamMembersAsProjectMembersIds.length > 0) {
      teamMembersDeletedFromProjects =
        await this.projectMemberRepository.bulkDelete(
          teamMembersAsProjectMembersIds,
        );

      if (teamMembersDeletedFromProjects === 0) {
        throw new Error(
          'Something went wrong deleting some the project members. Zero rows affected',
        );
      }
    }

    return { teamDeleted, teamMembersDeletedFromProjects };
  }
}

module.exports = DeleteTeamUseCase;
