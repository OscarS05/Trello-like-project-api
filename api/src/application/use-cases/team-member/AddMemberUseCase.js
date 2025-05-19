const TeamMemberEntity = require('../../../domain/entities/TeamMemberEntity');
const TeamMemberDto = require('../../dtos/teamMember.dto');

class AddMemberUseCase {
  constructor({ teamMemberRepository }) {
    this.teamMemberRepository = teamMemberRepository;
  }

  async execute(teamId, dataOfNewTeamMember) {
    const teamMemberEntity = new TeamMemberEntity(dataOfNewTeamMember);

    const addedMember = await this.teamMemberRepository.create(
      teamId,
      teamMemberEntity,
    );
    return new TeamMemberDto(addedMember);
  }
}

module.exports = AddMemberUseCase;
