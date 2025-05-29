const boom = require('@hapi/boom');
const TeamMemberDto = require('../../dtos/teamMember.dto');

class GetTeamMemberUseCase {
  constructor({ teamMemberRepository }) {
    this.teamMemberRepository = teamMemberRepository;
  }

  async execute(userId, workspaceId, teamId) {
    if (!userId) throw new Error('userId was not provided');
    if (!workspaceId) throw new Error('workspaceId was not provided');
    if (!teamId) throw new Error('teamId was not provided');

    const teamMember = await this.teamMemberRepository.findOneByUserId(
      userId,
      workspaceId,
      teamId,
    );
    if (!teamMember?.id)
      throw boom.notFound(
        'Something went wrong finding the team member. Maybe, The team member does not belong to the team',
      );
    return new TeamMemberDto(teamMember);
  }
}

module.exports = GetTeamMemberUseCase;
