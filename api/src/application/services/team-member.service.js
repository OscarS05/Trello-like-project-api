const boom = require('@hapi/boom');

class TeamMemberService {
  constructor({
    getTeamMembersByIdUseCase,
    addMemberUseCase,
    getTeamMemberByIdUseCase,
    updateRoleUseCase,
    transferOwnershipUseCase,
    deleteTeamMemberUseCase,
    getTeamProjectsByTeamMemberUseCase
  },
    { getAllProjectsAssignedUseCase }
  ){
    this.getTeamProjectsByTeamMemberUseCase = getTeamProjectsByTeamMemberUseCase;
    this.getTeamMembersByIdUseCase = getTeamMembersByIdUseCase;
    this.addMemberUseCase = addMemberUseCase;
    this.getTeamMemberByIdUseCase = getTeamMemberByIdUseCase;
    this.updateRoleUseCase = updateRoleUseCase;
    this.transferOwnershipUseCase = transferOwnershipUseCase;
    this.deleteTeamMemberUseCase = deleteTeamMemberUseCase;

    // team use cases
    this.getAllProjectsAssignedUseCase = getAllProjectsAssignedUseCase;
  }

  async addMember(teamId, dataOfNewTeamMember){
    const addedMember = await this.addMemberUseCase.execute(teamId, dataOfNewTeamMember);
    if(!addedMember?.id) throw boom.notFound('Something went wrong while adding the team member');

    const teamMember = await this.getTeamMember(teamId, addedMember.id);
    if(!teamMember?.id) throw boom.notFound('The new team member does not belong to the team');

    return teamMember;
  }

  async updateRole(teamId, teamMemberId, newRole){
    const teamMember = await this.getTeamMember(teamId, teamMemberId);
    if(!teamMember?.id) throw boom.notFound('This team member does not belong to the team');

    const updatedMember = await this.updateRoleUseCase.execute(teamMember, newRole);
    if(!updatedMember?.id) throw boom.notFound('Something went wrong while updating the team member role');

    const updatedTeamMember = await this.getTeamMember(teamId, updatedMember.id);
    if(!updatedTeamMember?.id) throw boom.notFound('The updated team member does not belong to the team');
    return updatedTeamMember;
  }

  async transferOwnership(currentTeamMember, teamMemberId){
    const newTeamMember = await this.getTeamMember(currentTeamMember.teamId, teamMemberId);
    if(!newTeamMember?.id) throw boom.notFound('The new team member does not belong to the team');
    return await this.transferOwnershipUseCase.execute(currentTeamMember, newTeamMember);
  }

  async deleteTeamMember(teamId, workspaceId, requesterAsTeamMember, teamMemberId){
    const [ memberToBeRemoved, teamMembers ] = await Promise.all([
      this.getTeamMember(teamId, teamMemberId),
      this.getTeamMembers(teamId, workspaceId),
    ]);
    if(!memberToBeRemoved?.id) throw boom.notFound('The team member to be removed does not belong to the team');
    if(teamMembers.length === 0) throw boom.conflict('The team has no members');
    return await this.deleteTeamMemberUseCase.execute(requesterAsTeamMember, memberToBeRemoved, teamMembers);
  }

  async getTeamProjectsByTeamMember(teamId, teamMemberId){
    const [ teamMember, projectTeams ] = await Promise.all([
      this.getTeamMember(teamId, teamMemberId),
      this.getProjectTeams(teamId),
    ]);

    if(!teamMember?.id) throw boom.notFound('Team member does not belong to the team');
    if(projectTeams.length === 0) return [];

    return await this.getTeamProjectsByTeamMemberUseCase.execute(teamMember, projectTeams);
  }

  async getProjectTeams(teamId){
    return await this.getAllProjectsAssignedUseCase.execute(teamId);
  }

  async getTeamMember(teamId, teamMemberId){
    return await this.getTeamMemberByIdUseCase.execute(teamId, teamMemberId);
  }

  async getTeamMembers(teamId, workspaceId){
    return await this.getTeamMembersByIdUseCase.execute(teamId, workspaceId);
  }
}

module.exports = TeamMemberService;
