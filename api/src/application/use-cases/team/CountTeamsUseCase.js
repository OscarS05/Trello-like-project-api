class CountTeamsUseCase {
  constructor({ teamRepository }) {
    this.teamRepository = teamRepository;
  }

  async execute(workspaceMemberId) {
    if (!workspaceMemberId) {
      throw new Error('workspaceMemberId was not provided');
    }

    return this.teamRepository.countTeams(workspaceMemberId);
  }
}

module.exports = CountTeamsUseCase;
