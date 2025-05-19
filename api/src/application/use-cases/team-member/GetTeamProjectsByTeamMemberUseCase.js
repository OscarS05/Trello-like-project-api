const ProjectDto = require('../../dtos/project.dto');

class GetTeamProjectsByTeamMemberUseCase {
  constructor({ teamMemberRepository }) {
    this.teamMemberRepository = teamMemberRepository;
  }

  async execute(teamMember, projectTeams) {
    const projectIds = projectTeams.map((projectTeam) => projectTeam.projectId);
    const projects = await this.teamMemberRepository.findProjectsByTeamMember(
      projectIds,
      teamMember,
    );
    return projects.map((project) => ProjectDto.withTeams(project));
  }
}

module.exports = GetTeamProjectsByTeamMemberUseCase;
