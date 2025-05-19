const boom = require('@hapi/boom');

class ProjectMemberService {
  constructor({
    getProjectMemberByUserUseCase,
    getProjectMemberByWorkspaceMemberUseCase,
    getProjectWithItsMembersAndTeamsUseCase,
    getMemberByIdUseCase,
    getProjectMembersByProjectUseCase,
    addMemberToProjectUseCase,
    updateRoleUseCase,
    transferOwnershipUseCase,
    removeMemberUseCase,
    checkProjectMembershipByUserUseCase,
  }) {
    this.getProjectMemberByUserUseCase = getProjectMemberByUserUseCase;
    this.getProjectMemberByWorkspaceMemberUseCase =
      getProjectMemberByWorkspaceMemberUseCase;
    this.getProjectWithItsMembersAndTeamsUseCase =
      getProjectWithItsMembersAndTeamsUseCase;
    this.getMemberByIdUseCase = getMemberByIdUseCase;
    this.getProjectMembersByProjectUseCase = getProjectMembersByProjectUseCase;
    this.addMemberToProjectUseCase = addMemberToProjectUseCase;
    this.updateRoleUseCase = updateRoleUseCase;
    this.transferOwnershipUseCase = transferOwnershipUseCase;
    this.removeMemberUseCase = removeMemberUseCase;
    this.checkProjectMembershipByUserUseCase =
      checkProjectMembershipByUserUseCase;
  }

  async addMemberToProject(projectId, workspaceMemberId) {
    const memberToBeAdded =
      await this.getProjectMemberByWorkspaceMemberUseCase.execute(
        workspaceMemberId,
        projectId,
      );
    if (memberToBeAdded?.id)
      throw boom.conflict(
        'The workspace member is already a member if the project',
      );

    const updatedProjectMember = await this.addMemberToProjectUseCase.execute(
      projectId,
      workspaceMemberId,
    );
    if (!updatedProjectMember?.id)
      throw boom.internal('The project member was not added to the project');

    const projectMember = await this.getProjectMemberById(
      updatedProjectMember.id,
    );
    if (!projectMember?.id)
      throw boom.internal(
        'The new project member was not found in the project',
      );

    return projectMember?.id ? projectMember : {};
  }

  async updateRole(projectMemberId, newRole) {
    const memberToBeUpdated = await this.getProjectMemberById(projectMemberId);
    if (!memberToBeUpdated?.id)
      throw boom.notFound('The project member does not exist in the project');

    const updatedMember = await this.updateRoleUseCase.execute(
      memberToBeUpdated,
      newRole,
    );
    if (!updatedMember?.id)
      throw boom.internal('The project member was not updated');

    const projectMember = await this.getProjectMemberById(updatedMember.id);
    if (!projectMember?.id)
      throw boom.internal('The project member was not found in the project');

    return projectMember?.id ? projectMember : {};
  }

  async transferOwnership(projectId, currentProjectOwner, newProjectOwnerId) {
    const newProjectOwner = await this.getProjectMemberById(newProjectOwnerId);
    if (!newProjectOwner?.id)
      throw boom.notFound(
        'The member to be updated as project owner does not exist in the project',
      );
    return this.transferOwnershipUseCase.execute(
      projectId,
      currentProjectOwner,
      newProjectOwner,
    );
  }

  async removeMemberController(
    projectId,
    projectMemberId,
    requesterAsProjectMember,
  ) {
    const [memberTobeRemoved, projectMembers] = await Promise.all([
      this.getProjectMemberById(projectMemberId),
      this.getProjectMembers(projectId),
    ]);
    if (!memberTobeRemoved?.id)
      throw boom.notFound(
        'The member to be removed was not found in the project',
      );
    return this.removeMemberUseCase.execute(
      requesterAsProjectMember,
      memberTobeRemoved,
      projectMembers,
    );
  }

  async getProjectMembers(projectId) {
    return this.getProjectMembersByProjectUseCase.execute(projectId);
  }

  async getProjectMembersWithTeams(projectId) {
    return this.getProjectWithItsMembersAndTeamsUseCase.execute(projectId);
  }

  async getProjectMemberByUserId(userId, workspaceId, projectId) {
    return this.getProjectMemberByUserUseCase.execute(
      userId,
      workspaceId,
      projectId,
    );
  }

  async getProjectMemberById(projectMemberId) {
    return this.getMemberByIdUseCase.execute(projectMemberId);
  }

  async checkProjectMembershipByUser(userId, projectId) {
    return this.checkProjectMembershipByUserUseCase.execute(userId, projectId);
  }
}

module.exports = ProjectMemberService;
