const Boom = require('@hapi/boom');
const WorkspaceMemberDto = require('../../dtos/workspaceMember.dto');

class GetWorkspaceMembersUseCase {
  constructor({ workspaceMemberRepository }) {
    this.workspaceMemberRepository = workspaceMemberRepository;
  }

  async execute(workspaceId) {
    if (!workspaceId) {
      throw Boom.badData('workspaceId was not provided');
    }
    const workspaceMembers =
      await this.workspaceMemberRepository.findAll(workspaceId);

    if (workspaceMembers.length === 0) return [];
    return workspaceMembers.map(
      (workspaceMember) => new WorkspaceMemberDto(workspaceMember),
    );
  }
}

module.exports = GetWorkspaceMembersUseCase;
