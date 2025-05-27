const ProjectMemberDto = require('../../dtos/projectMember.dto');
const TeamDto = require('../../dtos/team.dto');

class GetProjectWithItsMembersAndTeamsUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(projectId) {
    if (!projectId) {
      throw new Error('projectId was not provided');
    }

    const project =
      await this.projectMemberRepository.findProjectWithItsMembersAndTeams(
        projectId,
      );

    if (!project?.id) return {};

    const formattedProjectMembers =
      project?.projectMembers?.length > 0
        ? project.projectMembers.map((pm) =>
            ProjectMemberDto.fromModel(pm, project.teams),
          )
        : [];

    const formattedTeams =
      project?.teams?.length > 0
        ? project.teams.map((team) =>
            TeamDto.fromModel(team, project.projectMembers),
          )
        : [];

    return { projectMembers: formattedProjectMembers, teams: formattedTeams };
  }
}

module.exports = GetProjectWithItsMembersAndTeamsUseCase;
