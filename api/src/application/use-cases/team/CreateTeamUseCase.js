const TeamEntity = require('../../../domain/entities/TeamEntity');
const TeamMemberEntity = require('../../../domain/entities/TeamMemberEntity');
const TeamDto = require('../../dtos/team.dto');

class CreateTeamUseCase {
  constructor({ teamRepository }) {
    this.teamRepository = teamRepository;
  }

  async execute(teamData) {
    if (!teamData?.workspaceId) {
      throw new Error('workspaceId was not provided');
    }
    if (!teamData?.workspaceMemberId) {
      throw new Error('workspaceMemberId was not provided');
    }

    const teamEntity = new TeamEntity(teamData);

    const teamMemberEntity = new TeamMemberEntity({
      teamId: teamEntity.id,
      workspaceId: teamEntity.workspaceId,
      workspaceMemberId: teamEntity.workspaceMemberId,
      role: 'owner',
    });

    const teamCreated = await this.teamRepository.create(
      teamEntity,
      teamMemberEntity,
    );

    if (!teamCreated?.id) {
      throw new Error('Something went wrong creating the team');
    }

    return new TeamDto(teamCreated);
  }
}

module.exports = CreateTeamUseCase;
