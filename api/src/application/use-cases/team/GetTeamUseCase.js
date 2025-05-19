const TeamDto = require('../../dtos/team.dto');

class GetTeamUseCase {
  constructor({ teamRepository }) {
    this.teamRepository = teamRepository;
  }

  async execute(teamId, workspaceId) {
    const team = await this.teamRepository.findById(teamId, workspaceId);
    return new TeamDto(team);
  }
}

module.exports = GetTeamUseCase;
