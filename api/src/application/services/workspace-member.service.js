const boom = require('@hapi/boom');

class WorkspaceMemberService {
  constructor({
      getWorkspaceMemberByIdUseCase,
      getWorkspaceMemberByUserIdUseCase,
      addMemberToWorkspaceUseCase,
      getWorkspaceMembersWithDataUseCase,
      getWorkspaceMembersUseCase,
      updateRoleUseCase,
      transferOwnershipUseCase,
      removeWorkspaceMemberUseCase
    },
    { getProjectsByWorkspaceMemberUseCase },
    { getTeamsByWorkspaceMemberUseCase }
  ) {
    this.getWorkspaceMemberByIdUseCase = getWorkspaceMemberByIdUseCase;
    this.getWorkspaceMemberByUserIdUseCase = getWorkspaceMemberByUserIdUseCase;
    this.getWorkspaceMembersWithDataUseCase = getWorkspaceMembersWithDataUseCase;
    this.getWorkspaceMembersUseCase = getWorkspaceMembersUseCase;
    this.addMemberToWorkspaceUseCase = addMemberToWorkspaceUseCase;
    this.updateRoleUseCase = updateRoleUseCase;
    this.transferOwnershipUseCase = transferOwnershipUseCase;
    this.removeWorkspaceMemberUseCase = removeWorkspaceMemberUseCase;

    //project use cases
    this.getProjectsByWorkspaceMemberUseCase = getProjectsByWorkspaceMemberUseCase;

    // team use cases
    this.getTeamsByWorkspaceMemberUseCase = getTeamsByWorkspaceMemberUseCase;
  }

  async addMemberToWorkspace(workspaceId, userIdToAdd){
    const workspaceMember = await this.getWorkspaceMemberByUserId(workspaceId, userIdToAdd);
    if(workspaceMember) throw boom.conflict('User is already a member of this workspace');

    const newMember = await this.addMemberToWorkspaceUseCase.execute(workspaceId, userIdToAdd);
    if(!newMember.id) throw boom.notFound('Something went wrong while adding the user to the workspace');

    const workspaceMemberToReturn = await this.getWorkspaceMemberById(newMember.id);
    return workspaceMemberToReturn?.id ? workspaceMemberToReturn : {};
  }

  async updateRole(workspaceId, WorkspaceMemberIdToUpdate, newRole){
    const workspaceMember = await this.getWorkspaceMemberById(WorkspaceMemberIdToUpdate);
    if(!workspaceMember?.id) throw boom.notFound('The workspace member to update the role does not exist');

    const updatedMember = await this.updateRoleUseCase.execute(workspaceId, workspaceMember, newRole);
    if(!updatedMember?.id) throw boom.notFound('Something went wrong while updating the role of the user');

    const updatedWorkspaceMember = await this.getWorkspaceMemberById(updatedMember.id);
    return updatedWorkspaceMember?.id ? updatedWorkspaceMember : {};
  }

  async removeMember(requesterAsWorkspaceMember, workspaceMemberId){
    const [ workspaceMemberToBeRemoved, workspaceMembers ] = await Promise.all([
      this.getWorkspaceMemberById(workspaceMemberId),
      this.findAll(requesterAsWorkspaceMember.workspaceId),
    ]);

    if(!workspaceMemberToBeRemoved?.id) throw boom.notFound('The workspace member to be removed was not found');
    const projectsWithMembers = await this.getProjectsByWorkspaceMemberUseCase.execute(
      workspaceMemberToBeRemoved.workspaceId,
      workspaceMemberToBeRemoved.id
    );

    const teamsOfMemberToBeRemoved = await this.getTeamsByWorkspaceMemberUseCase.execute(workspaceMemberId);
    return await this.removeWorkspaceMemberUseCase.execute(
      requesterAsWorkspaceMember,
      workspaceMemberToBeRemoved,
      workspaceMembers,
      projectsWithMembers,
      teamsOfMemberToBeRemoved
    );
  }

  async transferOwnership(currentOwner, newOwnerId){
    const newOwner = await this.getWorkspaceMemberById(newOwnerId);
    if(!newOwner?.id) throw boom.notFound('New owner does not exist');
    return await this.transferOwnershipUseCase.execute(currentOwner, newOwner);
  }

  async findAllWithData(workspaceId){
    return await this.getWorkspaceMembersWithDataUseCase.execute(workspaceId);
  }

  async findAll(workspaceId){
    return await this.getWorkspaceMembersUseCase.execute(workspaceId);
  }

  async getWorkspaceMemberByUserId(workspaceId, userId){
    return await this.getWorkspaceMemberByUserIdUseCase.execute(workspaceId, userId);
  }

  async getWorkspaceMemberById(WorkspaceMemberId){
    return await this.getWorkspaceMemberByIdUseCase.execute(WorkspaceMemberId);
  }
}

module.exports = WorkspaceMemberService;
