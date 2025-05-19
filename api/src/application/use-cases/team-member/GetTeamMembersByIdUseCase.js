const TeamMemberDto = require('../../dtos/teamMember.dto');

class GetTeamMembersByIdUseCase {
  constructor({ teamMemberRepository }) {
    this.teamMemberRepository = teamMemberRepository;
  }

  async execute(teamId, workspaceId) {
    const projectMembers = await this.teamMemberRepository.findAll(
      teamId,
      workspaceId,
    );
    return projectMembers.map((member) => new TeamMemberDto(member));
  }
}

module.exports = GetTeamMembersByIdUseCase;
