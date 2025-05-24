const Boom = require('@hapi/boom');
const WorkspaceDto = require('../../dtos/workspace.dto');

class GetWorkspacesAndProjectsUseCase {
  constructor({ workspaceRepository }) {
    this.workspaceRepository = workspaceRepository;
  }

  async execute(userId) {
    if (!userId) {
      throw Boom.badRequest('UserId was not provided');
    }
    const workspaceMembers = await this.workspaceRepository.findAll(userId);
    if (workspaceMembers.length === 0) return [];

    return this.structureData(userId, workspaceMembers);
  }

  structureData(userId, workspaceMembers) {
    const workspaceWithProjects = workspaceMembers.map(
      (workspaceMember) => workspaceMember.workspace,
    );
    const workspaceMemberIds = workspaceMembers.map((member) => member.id);

    const structuredWorkspaces = workspaceWithProjects.map((workspace) => {
      const relatedProjects = workspace.projects.map((project) => {
        return {
          ...project.get({ plain: true }),
          access: project.projectMembers.some((member) =>
            workspaceMemberIds.includes(member.workspaceMemberId),
          ),
        };
      });

      return {
        ...workspace.get({ plain: true }),
        projects: relatedProjects,
        role:
          workspaceMembers.find((member) => member.userId === userId)?.role ||
          'member',
      };
    });
    return structuredWorkspaces.map((workspace) =>
      WorkspaceDto.fromEntity(workspace),
    );
  }
}

module.exports = GetWorkspacesAndProjectsUseCase;
