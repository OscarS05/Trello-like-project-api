const TeamMemberDto = require('../../dtos/teamMember.dto');

class GetTeamMembersByIdUseCase {
  constructor({ teamMemberRepository }) {
    this.teamMemberRepository = teamMemberRepository;
  }

  async execute(teamId, workspaceId) {
    if (!teamId) throw new Error('teamId was not provided');
    if (!workspaceId) throw new Error('workspaceId was not provided');

    const projectMembers = await this.teamMemberRepository.findAll(
      teamId,
      workspaceId,
    );
    return projectMembers?.length > 0
      ? projectMembers.map((member) => new TeamMemberDto(member))
      : [];
  }
}

module.exports = GetTeamMembersByIdUseCase;
