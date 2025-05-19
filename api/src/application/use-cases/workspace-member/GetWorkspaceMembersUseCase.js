const WorkspaceMemberDto = require('../../dtos/workspaceMember.dto');

class GetWorkspaceMembersUseCase {
  constructor({ workspaceMemberRepository }) {
    this.workspaceMemberRepository = workspaceMemberRepository;
  }

  async execute(workspaceId) {
    const workspaceMembers =
      await this.workspaceMemberRepository.findAll(workspaceId);
    return workspaceMembers.map(
      (workspaceMember) => new WorkspaceMemberDto(workspaceMember),
    );
  }
}

module.exports = GetWorkspaceMembersUseCase;
