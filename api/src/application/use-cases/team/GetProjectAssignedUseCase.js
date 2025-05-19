class GetProjectAssignedUseCase {
  constructor({ teamRepository }) {
    this.teamRepository = teamRepository;
  }

  async execute(teamId, projectId) {
    return this.teamRepository.findProjectAssigned(teamId, projectId);
  }
}

module.exports = GetProjectAssignedUseCase;
