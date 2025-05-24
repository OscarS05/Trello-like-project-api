class WorkspaceMemberDto {
  constructor({ id, userId, workspaceId, role, user, addedAt }) {
    this.id = id;
    this.userId = userId;
    this.name = user?.name;
    this.workspaceId = workspaceId;
    this.role = role;
    this.addedAt = addedAt;
  }

  static withData(workspaceMember) {
    return {
      id: workspaceMember.id,
      userId: workspaceMember.userId,
      user: workspaceMember.user.name,
      role: workspaceMember.role,
      workspaceId: workspaceMember.workspaceId,
      addedAt: workspaceMember.addedAt,
      teams:
        Array.isArray(workspaceMember.teams) && workspaceMember.teams.length > 0
          ? workspaceMember.teams.map((team) => ({
              id: team.id,
              name: team.name,
            }))
          : [],
      projects:
        Array.isArray(workspaceMember.projects) &&
        workspaceMember.projects.length > 0
          ? workspaceMember.projects.map((project) => ({
              id: project.id,
              name: project.name,
              visibility: project.visibility,
            }))
          : [],
    };
  }
}

module.exports = WorkspaceMemberDto;
