const ProjectMemberDto = require('../../dtos/projectMember.dto');

class GetProjectMembersByProjectUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(projectId) {
    const projectMembers =
      await this.projectMemberRepository.findAllByProject(projectId);
    return projectMembers.map(
      (projectMember) => new ProjectMemberDto(projectMember),
    );
  }
}

module.exports = GetProjectMembersByProjectUseCase;
