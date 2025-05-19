const boom = require('@hapi/boom');
const TeamMemberDto = require('../../dtos/teamMember.dto');

class GetTeamMemberUseCase {
  constructor({ teamMemberRepository }) {
    this.teamMemberRepository = teamMemberRepository;
  }

  async execute(userId, workspaceId, teamId) {
    const teamMember = await this.teamMemberRepository.findOneByUserId(
      userId,
      workspaceId,
      teamId,
    );
    if (!teamMember?.id)
      throw boom.notFound('The team member does not belong to the team');
    return new TeamMemberDto(teamMember);
  }
}

module.exports = GetTeamMemberUseCase;
