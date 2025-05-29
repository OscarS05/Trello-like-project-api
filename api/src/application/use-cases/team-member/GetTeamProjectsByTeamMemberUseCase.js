const ProjectDto = require('../../dtos/project.dto');

class GetTeamProjectsByTeamMemberUseCase {
  constructor({ teamMemberRepository }) {
    this.teamMemberRepository = teamMemberRepository;
  }

  async execute(teamMember, projectTeams) {
    if (!teamMember?.id) throw new Error('teamMember was not provided');
    if (!Array.isArray(projectTeams)) {
      throw new Error('projectTeams is not an array');
    }

    const projectIds = projectTeams.map((projectTeam) => projectTeam.projectId);
    const projects = await this.teamMemberRepository.findProjectsByTeamMember(
      projectIds,
      teamMember,
    );
    return projects?.length > 0
      ? projects.map((project) => ProjectDto.withTeams(project))
      : [];
  }
}

module.exports = GetTeamProjectsByTeamMemberUseCase;
