class CountWorkspacesByUserUseCase {
  constructor({ workspaceRepository }) {
    this.workspaceRepository = workspaceRepository;
  }

  async execute(userId) {
    const count = await this.workspaceRepository.countWorkspacesByUser(userId);
    return count;
  }
}

module.exports = CountWorkspacesByUserUseCase;
