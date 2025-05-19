class GetWorkspaceMemberByUserIdUseCase {
  constructor({ workspaceMemberRepository }) {
    this.workspaceMemberRepository = workspaceMemberRepository;
  }

  async execute(workspaceId, userId) {
    const workspaceMember =
      await this.workspaceMemberRepository.findWorkspaceMemberByUserId(
        workspaceId,
        userId,
      );
    return workspaceMember;
  }
}

module.exports = GetWorkspaceMemberByUserIdUseCase;
