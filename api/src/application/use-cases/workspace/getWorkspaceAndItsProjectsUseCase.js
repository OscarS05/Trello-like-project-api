const Boom = require('@hapi/boom');
const WorkspaceDto = require('../../dtos/workspace.dto');

class GetWorkspaceAndItsProjectsUseCase {
  constructor({ workspaceRepository }) {
    this.workspaceRepository = workspaceRepository;
  }

  async execute(workspaceMember) {
    if (!workspaceMember?.id) {
      throw Boom.badRequest('WorkspaceMember was not provided');
    }
    const workspace = await this.workspaceRepository.findById(workspaceMember);
    if (!workspace.id) return [];

    return this.structureData(workspaceMember, workspace.get({ plain: true }));
  }

  structureData(workspaceMember, workspace) {
    const structuredProjects = workspace.projects.map((project) => {
      return {
        ...project,
        access: project.projectMembers.some(
          (member) => workspaceMember.id === member.workspaceMemberId,
        ),
      };
    });
    const structuredWorkspace = {
      ...workspace,
      role: workspaceMember.role || 'member',
      projects: structuredProjects,
    };
    return WorkspaceDto.fromEntity(structuredWorkspace);
  }
}

module.exports = GetWorkspaceAndItsProjectsUseCase;
