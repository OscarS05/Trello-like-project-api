class DeleteTeamUseCase {
  constructor({ teamRepository, projectMemberRepository }) {
    this.teamRepository = teamRepository;
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(teamId, projectMembersInTeam) {
    const teamDeleted = await this.teamRepository.delete(teamId);

    const teamMembersDeletedFromProjects =
      projectMembersInTeam.length > 0
        ? await Promise.all(
            projectMembersInTeam.map((member) =>
              this.projectMemberRepository.delete(member.id),
            ),
          )
        : [];

    return { teamDeleted, teamMembersDeletedFromProjects };
  }
}

module.exports = DeleteTeamUseCase;
