const WorkspaceMemberDto = require('../../dtos/workspaceMember.dto');

class GetWorkspaceMembersWithDataUseCase {
  constructor({ workspaceMemberRepository }) {
    this.workspaceMemberRepository = workspaceMemberRepository;
  }

  async execute(workspaceId) {
    const workspaceMembers =
      await this.workspaceMemberRepository.findAllWithData(workspaceId);
    return workspaceMembers.map((workspaceMember) =>
      WorkspaceMemberDto.withData(workspaceMember),
    );
  }
}

module.exports = GetWorkspaceMembersWithDataUseCase;
