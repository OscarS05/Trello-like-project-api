const boom = require('@hapi/boom');

class ProjectService {
  constructor({
    getProjectsByWorkspaceUseCase,
    loadBackgroundImageUseCase,
    getAllProjectInformationUseCase,
    getProjectUseCase,
    countProjectsUseCase,
    createProjectUseCase,
    updateProjectUseCase,
    updateBackgroundProjectUseCase,
    deleteProjecUseCase,
  }) {
    this.getAllProjectInformationUseCase = getAllProjectInformationUseCase;
    this.getProjectsByWorkspaceUseCase = getProjectsByWorkspaceUseCase;
    this.getProjectUseCase = getProjectUseCase;
    this.loadBackgroundImageUseCase = loadBackgroundImageUseCase;
    this.countProjectsUseCase = countProjectsUseCase;
    this.createProjectUseCase = createProjectUseCase;
    this.updateProjectUseCase = updateProjectUseCase;
    this.updateBackgroundProjectUseCase = updateBackgroundProjectUseCase;
    this.deleteProjecUseCase = deleteProjecUseCase;
  }

  async create(projectData) {
    return this.createProjectUseCase.execute(projectData);
  }

  async update(projectId, projectData) {
    return this.updateProjectUseCase.execute(projectId, projectData);
  }

  async loadBackgroundImage(projectId, fileData, folder) {
    return this.loadBackgroundImageUseCase.execute(fileData, folder, projectId);
  }

  async updateBackgroundProjectInDb(projectId, url) {
    const project = await this.getProjectUseCase.execute(projectId);
    if (!project?.id) throw boom.badRequest('Project not found');
    return this.updateBackgroundProjectUseCase.execute(project, url);
  }

  async delete(projectId) {
    const project = await this.getProjectUseCase.execute(projectId);
    if (!project?.id) throw boom.notFound('Project not found');
    return this.deleteProjecUseCase.execute(project);
  }

  async findAllByWorkspace(workspaceId) {
    return this.getProjectsByWorkspaceUseCase.execute(workspaceId);
  }

  async getAllProjectInformation(projectId) {
    return this.getAllProjectInformationUseCase.execute(projectId);
  }

  async countProjects(workspaceMember) {
    return this.countProjectsUseCase.execute(workspaceMember.id);
  }

  async getProjectById(projectId) {
    return this.getProjectUseCase.execute(projectId);
  }
}

module.exports = ProjectService;
