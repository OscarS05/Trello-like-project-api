const TeamDto = require('../../dtos/team.dto');

class GetTeamsByWorkspaceUseCase {
  constructor({ teamRepository }) {
    this.teamRepository = teamRepository;
  }

  async execute(requesterAsWorkspaceMember) {
    const teams = await this.teamRepository.findAllByWorkspace(
      requesterAsWorkspaceMember.workspaceId,
    );
    return teams.lenght === 0
      ? []
      : teams.map((team) => TeamDto.WithData(team, requesterAsWorkspaceMember));
  }
}

module.exports = GetTeamsByWorkspaceUseCase;
