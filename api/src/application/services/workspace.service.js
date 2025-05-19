class WorkspaceService {
  constructor({
    createWorkspaceUseCase,
    updateWorkspaceUseCase,
    countWorkspacesByUserUseCase,
    deleteWorkspaceUseCase,
    getWorkspacesAndProjectsUseCase,
    getWorkspaceAndItsProjectsUseCase,
  }) {
    this.createWorkspaceUseCase = createWorkspaceUseCase;
    this.updateWorkspaceUseCase = updateWorkspaceUseCase;
    this.deleteWorkspaceUseCase = deleteWorkspaceUseCase;
    this.getWorkspacesAndProjectsUseCase = getWorkspacesAndProjectsUseCase;
    this.getWorkspaceAndItsProjectsUseCase = getWorkspaceAndItsProjectsUseCase;
    this.countWorkspacesByUserUseCase = countWorkspacesByUserUseCase;
  }

  async createWorkspace(workspaceData) {
    return this.createWorkspaceUseCase.execute(workspaceData);
  }

  async update(workspaceId, data) {
    return this.updateWorkspaceUseCase.execute(workspaceId, data);
  }

  async delete(workspaceId) {
    return this.deleteWorkspaceUseCase.execute(workspaceId);
  }

  async getWorkspaceAndItsProjects(workspaceMember) {
    return this.getWorkspaceAndItsProjectsUseCase.execute(workspaceMember);
  }

  async getWorkspacesAndProjects(userId) {
    return this.getWorkspacesAndProjectsUseCase.execute(userId);
  }

  async countWorkspacesByUserId(userId) {
    return this.countWorkspacesByUserUseCase.execute(userId);
  }
}

module.exports = WorkspaceService;
