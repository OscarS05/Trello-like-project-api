const ProjectMemberEntity = require('../../../domain/entities/projectMemberEntity');
const ProjectMemberDto = require('../../dtos/projectMember.dto');

class AddMemberToProjectUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(projectId, workspaceMemberId) {
    const projectMemberEntity = new ProjectMemberEntity({
      projectId,
      workspaceMemberId,
    });
    const addedMember =
      await this.projectMemberRepository.create(projectMemberEntity);
    return new ProjectMemberDto(addedMember);
  }
}

module.exports = AddMemberToProjectUseCase;
