const TeamMemberDto = require('../../dtos/teamMember.dto');

class GetTeamMemberByIdUseCase {
  constructor({ teamMemberRepository }) {
    this.teamMemberRepository = teamMemberRepository;
  }

  async execute(teamId, teamMemberId) {
    if (!teamId) throw new Error('teamId was not provided');
    if (!teamMemberId) throw new Error('teamMemberId was not provided');

    const teamMember = await this.teamMemberRepository.findOneById(
      teamId,
      teamMemberId,
    );

    return !teamMember?.id ? {} : new TeamMemberDto(teamMember);
  }
}

module.exports = GetTeamMemberByIdUseCase;
