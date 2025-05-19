class GetAllProjectsAssignedUseCase {
  constructor({ teamRepository }) {
    this.teamRepository = teamRepository;
  }

  async execute(teamId) {
    return this.teamRepository.findAllProjectsAssigned(teamId);
  }
}

module.exports = GetAllProjectsAssignedUseCase;
