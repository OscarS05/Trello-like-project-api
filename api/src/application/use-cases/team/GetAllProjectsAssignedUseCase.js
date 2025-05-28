class GetAllProjectsAssignedUseCase {
  constructor({ teamRepository }) {
    this.teamRepository = teamRepository;
  }

  async execute(teamId) {
    if (!teamId) throw new Error('teamId was not provided');

    const projectsAssigned =
      await this.teamRepository.findAllProjectsAssigned(teamId);

    return projectsAssigned?.length > 0 ? projectsAssigned : [];
  }
}

module.exports = GetAllProjectsAssignedUseCase;
