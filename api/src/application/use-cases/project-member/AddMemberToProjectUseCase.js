const ProjectMemberEntity = require('../../../domain/entities/projectMemberEntity');
const ProjectMemberDto = require('../../dtos/projectMember.dto');

class AddMemberToProjectUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(projectId, workspaceMemberId) {
    if (!projectId) {
      throw new Error('Project ID was not provided');
    }
    if (!workspaceMemberId) {
      throw new Error('Workspace Member ID was not provided');
    }

    const projectMemberEntity = new ProjectMemberEntity({
      projectId,
      workspaceMemberId,
    });
    const addedMember =
      await this.projectMemberRepository.create(projectMemberEntity);

    if (!addedMember?.id) {
      throw new Error(
        'Something went wrong while adding the member to the project',
      );
    }

    return new ProjectMemberDto(addedMember);
  }
}

module.exports = AddMemberToProjectUseCase;
