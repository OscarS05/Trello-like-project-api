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
      teams: workspaceMember.teams.map((team) => {
        return {
          id: team.id,
          name: team.name,
        };
      }),
      projects: workspaceMember.projects.map((project) => {
        return {
          id: project.id,
          name: project.name,
          visibility: project.visibility,
        };
      }),
    };
  }
}

module.exports = WorkspaceMemberDto;
