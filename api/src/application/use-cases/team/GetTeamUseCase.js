const TeamDto = require('../../dtos/team.dto');

class GetTeamUseCase {
  constructor({ teamRepository }) {
    this.teamRepository = teamRepository;
  }

  async execute(teamId, workspaceId) {
    if (!teamId) throw new Error('teamId was not provided');
    if (!workspaceId) throw new Error('workspaceId was not provided');

    const team = await this.teamRepository.findById(teamId, workspaceId);
    return team?.id ? new TeamDto(team) : {};
  }
}

module.exports = GetTeamUseCase;
