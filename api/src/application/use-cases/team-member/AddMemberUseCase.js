const boom = require('@hapi/boom');

const TeamMemberEntity = require('../../../domain/entities/TeamMemberEntity');
const TeamMemberDto = require('../../dtos/teamMember.dto');

class AddMemberUseCase {
  constructor({ teamMemberRepository }) {
    this.teamMemberRepository = teamMemberRepository;
  }

  async execute(teamId, dataOfNewTeamMember) {
    if (!dataOfNewTeamMember?.workspaceMemberId) {
      throw new Error('workspaceMemberId was not provided');
    }
    if (!dataOfNewTeamMember?.workspaceId) {
      throw new Error('workspaceId was not provided');
    }
    if (!dataOfNewTeamMember?.teamId) {
      throw new Error('teamId was not provided');
    }
    if (!teamId) {
      throw new Error('teamId was not provided');
    }

    const teamMember = await this.teamMemberRepository.findByWorkspaceMemberId({
      teamId,
      workspaceMemberId: dataOfNewTeamMember.workspaceMemberId,
    });
    if (teamMember?.id) {
      throw boom.conflict('The workspaceMember already belong to the team');
    }

    const teamMemberEntity = new TeamMemberEntity(dataOfNewTeamMember);

    const addedMember = await this.teamMemberRepository.create(
      teamId,
      teamMemberEntity,
    );

    if (!addedMember?.id) {
      throw new Error('Something went wrong adding the member.');
    }

    return new TeamMemberDto(addedMember);
  }
}

module.exports = AddMemberUseCase;
