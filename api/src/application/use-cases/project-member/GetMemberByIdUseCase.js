const ProjectMemberDto = require('../../dtos/projectMember.dto');

class GetMemberByIdUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(projectMemberId) {
    const projectMember =
      await this.projectMemberRepository.findProjectMemberById(projectMemberId);
    return !projectMember?.id ? {} : new ProjectMemberDto(projectMember);
  }
}

module.exports = GetMemberByIdUseCase;
