const ProjectDto = require("./project.dto");

class WorkspaceDto {
  constructor({ id, name, description, userId, createdAt, projects }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.userId = userId;
    this.createdAt = createdAt

    if(Array.isArray(projects)) {
      this.projects = projects.length > 0 ? projects.map(project => new ProjectDto(project)) : [];
    }
  }

  static fromEntity(workspace){
    return {
      id: workspace.id,
      name: workspace.name,
      userId: workspace.userId,
      role: workspace.role || 'member',
      description: workspace.description,
      projects: workspace.projects ? workspace.projects.map(ProjectDto.fromEntity) : [],
    };
  }
}

module.exports = WorkspaceDto;
