const Boom = require('@hapi/boom');
const WorkspaceMemberDto = require('../../dtos/workspaceMember.dto');

class GetWorkspaceMembersWithDataUseCase {
  constructor({ workspaceMemberRepository }) {
    this.workspaceMemberRepository = workspaceMemberRepository;
  }

  async execute(workspaceId) {
    if (!workspaceId) throw Boom.badData('workspaceId was not provided');
    const workspaceMembers =
      await this.workspaceMemberRepository.findAllWithData(workspaceId);
    if (workspaceMembers.length === 0) return [];
    return workspaceMembers.map((workspaceMember) =>
      WorkspaceMemberDto.withData(workspaceMember),
    );
  }
}

module.exports = GetWorkspaceMembersWithDataUseCase;
