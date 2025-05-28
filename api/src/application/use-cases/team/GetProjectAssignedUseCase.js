class GetProjectAssignedUseCase {
  constructor({ teamRepository }) {
    this.teamRepository = teamRepository;
  }

  async execute(teamId, projectId) {
    if (!teamId) throw new Error('teamId was not provided');
    if (!projectId) throw new Error('projectId was not provided');

    const projectAssigned = await this.teamRepository.findProjectAssigned(
      teamId,
      projectId,
    );
    return projectAssigned?.teamId ? projectAssigned : {};
  }
}

module.exports = GetProjectAssignedUseCase;
