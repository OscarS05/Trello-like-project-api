const ProjectMemberDto = require('../../dtos/projectMember.dto');

class CheckProjectMembershipByUserUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(userId, projectId) {
    if (!userId) throw new Error('userId was not provided');
    if (!projectId) throw new Error('projectId was not provided');

    const projectMember =
      await this.projectMemberRepository.checkProjectMemberByUser(
        userId,
        projectId,
      );
    return projectMember?.id ? new ProjectMemberDto(projectMember) : {};
  }
}

module.exports = CheckProjectMembershipByUserUseCase;
