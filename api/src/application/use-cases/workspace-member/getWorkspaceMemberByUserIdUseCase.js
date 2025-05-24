const Boom = require('@hapi/boom');

class GetWorkspaceMemberByUserIdUseCase {
  constructor({ workspaceMemberRepository }) {
    this.workspaceMemberRepository = workspaceMemberRepository;
  }

  async execute(workspaceId, userId) {
    if (!workspaceId) {
      throw Boom.badData('workspaceId was not provided');
    }
    if (!userId) {
      throw Boom.badData('userId was not provided');
    }
    const workspaceMember =
      await this.workspaceMemberRepository.findWorkspaceMemberByUserId(
        workspaceId,
        userId,
      );
    return workspaceMember;
  }
}

module.exports = GetWorkspaceMemberByUserIdUseCase;
