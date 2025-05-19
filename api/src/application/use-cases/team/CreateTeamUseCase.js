const TeamEntity = require('../../../domain/entities/TeamEntity');
const TeamMemberEntity = require('../../../domain/entities/TeamMemberEntity');
const TeamDto = require('../../dtos/team.dto');

class CreateTeamUseCase {
  constructor({ teamRepository }) {
    this.teamRepository = teamRepository;
  }

  async execute(teamData) {
    const teamEntity = new TeamEntity(teamData);
    teamEntity.role = 'owner';

    const { id: teamId, ...rest } = teamEntity;
    const formattedTeam = { teamId, ...rest };

    const teamMemberEntity = new TeamMemberEntity(formattedTeam);

    const teamCreated = await this.teamRepository.create(
      teamEntity,
      teamMemberEntity,
    );
    return new TeamDto(teamCreated);
  }
}

module.exports = CreateTeamUseCase;
