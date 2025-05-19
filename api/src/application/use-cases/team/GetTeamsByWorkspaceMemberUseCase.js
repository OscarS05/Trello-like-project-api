const TeamDto = require('../../dtos/team.dto');

class GetTeamsByWorkspaceMemberUseCase {
  constructor({ teamRepository }) {
    this.teamRepository = teamRepository;
  }

  async execute(workspaceMemberId) {
    const teams =
      await this.teamRepository.findAllByWorkspaceMember(workspaceMemberId);
    return teams.map((team) => TeamDto.withMembers(team));
  }
}

module.exports = GetTeamsByWorkspaceMemberUseCase;
