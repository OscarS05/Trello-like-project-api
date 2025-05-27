const ProjectMemberDto = require('../../dtos/projectMember.dto');

class GetProjectMembersByProjectUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(projectId) {
    if (!projectId) {
      throw new Error('projectId was not provided');
    }

    const projectMembers =
      await this.projectMemberRepository.findAllByProject(projectId);
    return projectMembers.map(
      (projectMember) => new ProjectMemberDto(projectMember),
    );
  }
}

module.exports = GetProjectMembersByProjectUseCase;
