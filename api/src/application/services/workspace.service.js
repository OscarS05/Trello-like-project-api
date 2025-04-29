const boom = require('@hapi/boom');

class WorkspaceService {
  constructor(
    { createWorkspaceUseCase, updateWorkspaceUseCase, countWorkspacesByUserUseCase, deleteWorkspaceUseCase, getWorkspacesAndProjectsUseCase, getWorkspaceAndItsProjectsUseCase },
  ){
    this.createWorkspaceUseCase = createWorkspaceUseCase;
    this.updateWorkspaceUseCase = updateWorkspaceUseCase;
    this.deleteWorkspaceUseCase = deleteWorkspaceUseCase;
    this.getWorkspacesAndProjectsUseCase = getWorkspacesAndProjectsUseCase;
    this.getWorkspaceAndItsProjectsUseCase = getWorkspaceAndItsProjectsUseCase;
    this.countWorkspacesByUserUseCase = countWorkspacesByUserUseCase;
  }

  async createWorkspace(workspaceData) {
    return await this.createWorkspaceUseCase.execute(workspaceData);
  }

  async update(workspaceId, data) {
    return await this.updateWorkspaceUseCase.execute(workspaceId, data);
  }

  async delete(workspaceId){
    return await this.deleteWorkspaceUseCase.execute(workspaceId);
  }

  async getWorkspaceAndItsProjects(workspaceMember){
    return await this.getWorkspaceAndItsProjectsUseCase.execute(workspaceMember);
  }

  async getWorkspacesAndProjects(userId) {
    return await this.getWorkspacesAndProjectsUseCase.execute(userId);
  }

  async countWorkspacesByUserId(userId){
    return await this.countWorkspacesByUserUseCase.execute(userId);
  }
}

module.exports = WorkspaceService;
