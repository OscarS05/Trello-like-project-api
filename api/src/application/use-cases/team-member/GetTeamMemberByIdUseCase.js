const TeamMemberDto = require("../../dtos/teamMember.dto");

class GetTeamMemberByIdUseCase {
  constructor({ teamMemberRepository }){
    this.teamMemberRepository = teamMemberRepository;
  }

  async execute(teamId, teamMemberId){
    const teamMember = await this.teamMemberRepository.findOneById(teamId, teamMemberId);
    return !teamMember?.id ? {} : new TeamMemberDto(teamMember);
  }
}

module.exports = GetTeamMemberByIdUseCase;
