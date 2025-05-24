const Boom = require('@hapi/boom');
const WorkspaceMemberEntity = require('../../../domain/entities/WorkspaceMemberEntity');
const WorkspaceMemberDto = require('../../dtos/workspaceMember.dto');

class AddMemberToWorkspaceUseCase {
  constructor({ workspaceMemberRepository }) {
    this.workspaceMemberRepository = workspaceMemberRepository;
  }

  async execute(workspaceId, memberIdToAdd) {
    if (!workspaceId) {
      throw Boom.badRequest('WorkspaceId was not provided');
    }
    if (!memberIdToAdd) {
      throw Boom.badRequest(
        'UserId of the member to be added was not provided',
      );
    }
    const workspaceMemberEntity = new WorkspaceMemberEntity({
      workspaceId,
      userId: memberIdToAdd,
    });
    const addedWorkspaceMember = await this.workspaceMemberRepository.create(
      workspaceMemberEntity,
    );
    if (!addedWorkspaceMember?.id) {
      throw Boom.internal('Something went wrong adding the member');
    }
    return new WorkspaceMemberDto(addedWorkspaceMember);
  }
}

module.exports = AddMemberToWorkspaceUseCase;
