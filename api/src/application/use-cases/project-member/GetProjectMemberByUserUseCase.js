class GetProjectMemberByUserUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(userId, workspaceId, projectId) {
    if (!userId) {
      throw new Error('userId was not provided');
    }
    if (!workspaceId) {
      throw new Error('workspaceId was not provided');
    }
    if (!projectId) {
      throw new Error('projectId was not provided');
    }

    const projectMember = await this.projectMemberRepository.findByUser(
      userId,
      workspaceId,
      projectId,
    );

    return projectMember?.id ? projectMember : {};
  }
}

module.exports = GetProjectMemberByUserUseCase;
