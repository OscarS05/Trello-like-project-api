const ProjectMemberDto = require('../../dtos/projectMember.dto');
const TeamDto = require('../../dtos/team.dto');

class GetProjectWithItsMembersAndTeamsUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(projectId) {
    const project =
      await this.projectMemberRepository.findProjectWithItsMembersAndTeams(
        projectId,
      );

    const formattedProjectMembers = project.projectMembers.map((pm) =>
      ProjectMemberDto.fromModel(pm, project.teams),
    );
    const formattedTeams = project.teams.map((team) =>
      TeamDto.fromModel(team, project.projectMembers),
    );

    return { projectMembers: formattedProjectMembers, teams: formattedTeams };
  }
}

module.exports = GetProjectWithItsMembersAndTeamsUseCase;
