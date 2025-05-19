const WorkspaceMemberEntity = require('../../../domain/entities/WorkspaceMemberEntity');
const WorkspaceMemberDto = require('../../dtos/workspaceMember.dto');

class AddMemberToWorkspaceUseCase {
  constructor({ workspaceMemberRepository }) {
    this.workspaceMemberRepository = workspaceMemberRepository;
  }

  async execute(workspaceId, memberIdToAdd) {
    const workspaceMemberEntity = new WorkspaceMemberEntity({
      workspaceId,
      userId: memberIdToAdd,
    });
    const addedWorkspaceMember = await this.workspaceMemberRepository.create(
      workspaceMemberEntity,
    );
    return new WorkspaceMemberDto(addedWorkspaceMember);
  }
}

module.exports = AddMemberToWorkspaceUseCase;
