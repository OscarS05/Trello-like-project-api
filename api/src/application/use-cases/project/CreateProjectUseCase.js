const ProjectEntity = require('../../../domain/entities/ProjectEntity');
const ProjectMemberEntity = require('../../../domain/entities/projectMemberEntity');
const ProjectDto = require('../../dtos/project.dto');

class CreateProjectUseCase {
  constructor({ projectRepository }) {
    this.projectRepository = projectRepository;
  }

  async execute(projectData) {
    const projectEntity = new ProjectEntity(projectData);
    projectEntity.role = 'owner';
    const { id: projectId, ...rest } = projectEntity;
    const updatedProject = { projectId, ...rest };

    const projectMemberEntity = new ProjectMemberEntity(updatedProject);

    const projectCreated = await this.projectRepository.create(
      projectEntity,
      projectMemberEntity,
    );
    return new ProjectDto(projectCreated);
  }
}

module.exports = CreateProjectUseCase;
