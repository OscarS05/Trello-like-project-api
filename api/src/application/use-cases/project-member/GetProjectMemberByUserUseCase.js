class GetProjectMemberByUserUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(userId, workspaceId, projectId) {
    return this.projectMemberRepository.findByUser(
      userId,
      workspaceId,
      projectId,
    );
  }
}

module.exports = GetProjectMemberByUserUseCase;
