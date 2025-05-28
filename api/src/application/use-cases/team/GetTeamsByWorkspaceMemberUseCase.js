const TeamDto = require('../../dtos/team.dto');

class GetTeamsByWorkspaceMemberUseCase {
  constructor({ teamRepository }) {
    this.teamRepository = teamRepository;
  }

  async execute(workspaceMemberId) {
    if (!workspaceMemberId) {
      throw new Error('workspaceMemberId was not provided');
    }

    const teams =
      await this.teamRepository.findAllByWorkspaceMember(workspaceMemberId);

    return teams?.length > 0
      ? teams.map((team) => TeamDto.withMembers(team))
      : [];
  }
}

module.exports = GetTeamsByWorkspaceMemberUseCase;
