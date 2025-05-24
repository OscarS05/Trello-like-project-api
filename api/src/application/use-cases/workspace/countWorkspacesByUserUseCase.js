const Boom = require('@hapi/boom');

class CountWorkspacesByUserUseCase {
  constructor({ workspaceRepository }) {
    this.workspaceRepository = workspaceRepository;
  }

  async execute(userId) {
    if (!userId) {
      throw Boom.badRequest('UserId was not provided to count workspaces');
    }

    const count = await this.workspaceRepository.countWorkspacesByUser(userId);
    return count;
  }
}

module.exports = CountWorkspacesByUserUseCase;
