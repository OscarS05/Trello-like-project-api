const boom = require('@hapi/boom');

class DeleteAccountUseCase {
  constructor({
    userRepository,
    workspaceRepository,
    workspaceMemberRepository,
    projectMemberRepository,
    teamMemberRepository,
  }) {
    this.projectMemberRepository = projectMemberRepository;
    this.teamMemberRepository = teamMemberRepository;
    this.workspaceMemberRepository = workspaceMemberRepository;
    this.workspaceRepository = workspaceRepository;
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this.userRepository.findAllWorkspacesByUserId(userId);
    if (!user?.id) throw boom.notFound('User not found');

    if (user.workspaces?.length === 0) return this.deleteUser(userId);

    if (user.workspaces?.length > 0) {
      await this.leaveWorkspacesHandler(user.workspaces, user);
    }

    return this.deleteUser(userId);
  }

  groupUserProjectsByCase(workspacesWithMembers, userAsWorkspaceMembersIds) {
    const projectsWithOneMember = workspacesWithMembers
      .map((w) => w.projects)
      .flat()
      .filter(
        (p) =>
          p.projectMembers.length === 1 &&
          userAsWorkspaceMembersIds.includes(
            p.projectMembers[0].workspaceMemberId,
          ),
      );

    const projectsWithMembers = workspacesWithMembers
      .map((w) => w.projects)
      .flat()
      .filter(
        (p) =>
          p.projectMembers.length > 1 &&
          p.projectMembers.find((pm) =>
            userAsWorkspaceMembersIds.includes(pm.workspaceMemberId),
          ),
      );

    const projectsWhichUserIsOwner = projectsWithMembers.filter((p) =>
      p.projectMembers.find(
        (pm) =>
          pm.role === 'owner' &&
          userAsWorkspaceMembersIds.includes(pm.workspaceMemberId),
      ),
    );
    const projectsWhichUserIsNotOwner = projectsWithMembers.filter((p) =>
      p.projectMembers.find(
        (pm) =>
          pm.role !== 'owner' &&
          userAsWorkspaceMembersIds.includes(pm.workspaceMemberId),
      ),
    );

    return {
      projectsWithOneMember,
      projectsWithMembers,
      projectsWhichUserIsOwner,
      projectsWhichUserIsNotOwner,
    };
  }

  findNewOwnerForProject(project, userAsWorkspaceMembersIds) {
    const currentOwner = project.projectMembers.find(
      (pm) =>
        pm.role === 'owner' &&
        userAsWorkspaceMembersIds.includes(pm.workspaceMemberId),
    );

    if (!currentOwner?.id)
      throw boom.notFound(`No current owner found for project ${project.name}`);

    const candidates = project.projectMembers.filter(
      (pm) =>
        !userAsWorkspaceMembersIds.includes(pm.workspaceMemberId) &&
        pm.role !== 'owner' &&
        pm.role !== 'viewer',
    );

    const newOwner =
      candidates.find((pm) => pm.role === 'admin') ||
      candidates.find((pm) => pm.role === 'member');

    if (!newOwner?.id)
      throw boom.notFound(`No new owner found for project ${project.name}`);

    if (currentOwner.id === newOwner.id)
      throw boom.badRequest(
        `Current owner and new owner are the same in the project ${
          project.name
        }`,
      );

    return { currentOwner, newOwner };
  }

  async transferOwnershipForProjects(
    newOwnerByProject,
    userAsCurrentOwnerByProject,
    userAsWorkspaceMembersIds,
  ) {
    return Promise.all(
      newOwnerByProject.map(async (newOwner) => {
        const currentOwner = userAsCurrentOwnerByProject.find(
          (co) =>
            co.projectId === newOwner.projectId &&
            userAsWorkspaceMembersIds.includes(co.workspaceMemberId),
        );
        return this.projectMemberRepository.transferOwnership(
          newOwner.projectId,
          currentOwner,
          newOwner,
        );
      }),
    );
  }

  async leaveProjectsHandler(workspacesWithMembers, userAsWorkspaceMembersIds) {
    const {
      projectsWithMembers,
      projectsWithOneMember,
      projectsWhichUserIsNotOwner,
      projectsWhichUserIsOwner,
    } = this.groupUserProjectsByCase(
      workspacesWithMembers,
      userAsWorkspaceMembersIds,
    );

    if (projectsWithOneMember.length > 0) {
      throw boom.badRequest(
        `You are the only member of the following projects: ${projectsWithOneMember
          .map((p) => p.name)
          .join(
            ', ',
          )}. Please remove them before deleting your account, or add a member if you do not want to delete a project.`,
      );
    }

    if (projectsWithMembers.length === 0) return 1;

    const userAsProjectMemberIds = [];

    if (projectsWhichUserIsOwner.length > 0) {
      const userAsCurrentOwnerByProject = [];
      const newOwnerByProject = [];

      projectsWhichUserIsOwner.forEach((project) => {
        const { currentOwner, newOwner } = this.findNewOwnerForProject(
          project,
          userAsWorkspaceMembersIds,
        );

        userAsCurrentOwnerByProject.push(currentOwner);
        newOwnerByProject.push(newOwner);
      });

      if (newOwnerByProject.length >= 1) {
        await this.transferOwnershipForProjects(
          newOwnerByProject,
          userAsCurrentOwnerByProject,
          userAsWorkspaceMembersIds,
        );
      }

      userAsProjectMemberIds.push(
        userAsCurrentOwnerByProject.map((co) => co.id),
      );
    }

    if (projectsWhichUserIsNotOwner.length > 0) {
      userAsProjectMemberIds.push(
        projectsWhichUserIsNotOwner.map(
          (p) =>
            p.projectMembers.find((pm) =>
              userAsWorkspaceMembersIds.includes(pm.workspaceMemberId),
            ).id,
        ),
      );
    }
    return this.deleteUserFromProjects(userAsProjectMemberIds.flat());
  }

  groupUserTeamsByCase(workspacesWithMembers, userAsWorkspaceMembersIds) {
    const teamsWithOneMember = workspacesWithMembers
      .map((w) => w.teams)
      .flat()
      .filter(
        (t) =>
          t.teamMembers.length === 1 &&
          userAsWorkspaceMembersIds.includes(
            t.teamMembers[0]?.workspaceMemberId,
          ),
      );

    const teamsWithMembers = workspacesWithMembers
      .map((w) => w.teams)
      .flat()
      .filter(
        (t) =>
          t.teamMembers.length > 1 &&
          t.teamMembers.find((tm) =>
            userAsWorkspaceMembersIds.includes(tm.workspaceMemberId),
          ),
      );

    const teamsWhichUserIsOwner = teamsWithMembers.filter((t) =>
      t.teamMembers.find(
        (tm) =>
          tm.role === 'owner' &&
          userAsWorkspaceMembersIds.includes(tm.workspaceMemberId),
      ),
    );
    const teamsWhichUserIsNotOwner = teamsWithMembers.filter((t) =>
      t.teamMembers.find(
        (tm) =>
          tm.role !== 'owner' &&
          userAsWorkspaceMembersIds.includes(tm.workspaceMemberId),
      ),
    );

    return {
      teamsWithOneMember,
      teamsWithMembers,
      teamsWhichUserIsOwner,
      teamsWhichUserIsNotOwner,
    };
  }

  findNewOwnerForTeams(team, userAsWorkspaceMembersIds) {
    const currentOwner = team.teamMembers.find(
      (tm) =>
        tm.role === 'owner' &&
        userAsWorkspaceMembersIds.includes(tm.workspaceMemberId),
    );
    if (!currentOwner?.id)
      throw boom.notFound(`No current owner found for team ${team.name}`);

    const candidates = team.teamMembers.filter(
      (tm) =>
        !userAsWorkspaceMembersIds.includes(tm.workspaceMemberId) &&
        tm.role !== 'owner' &&
        tm.role !== 'viewer',
    );
    const newOwner =
      candidates.find((tm) => tm.role === 'admin') ||
      candidates.find((tm) => tm.role === 'member');

    if (!newOwner?.id)
      throw boom.notFound(`No new owner found for team ${team.name}`);
    if (currentOwner.id === newOwner.id)
      throw boom.badRequest(
        `Current owner and new owner are the same in the team ${team.name}`,
      );

    return { currentOwner, newOwner };
  }

  async transferOwnershipForTeams(
    newOwnerByTeam,
    userAsCurrentOwnerByTeam,
    userAsWorkspaceMembersIds,
  ) {
    return Promise.all(
      newOwnerByTeam.map(async (newOwner) => {
        const currentOwner = userAsCurrentOwnerByTeam.find(
          (co) =>
            co.teamId === newOwner.teamId &&
            userAsWorkspaceMembersIds.includes(co.workspaceMemberId),
        );
        return this.teamMemberRepository.transferOwnership(
          newOwner.teamId,
          currentOwner,
          newOwner,
        );
      }),
    );
  }

  async leaveTeamsHandler(workspacesWithMembers, userAsWorkspaceMembersIds) {
    const {
      teamsWithOneMember,
      teamsWithMembers,
      teamsWhichUserIsNotOwner,
      teamsWhichUserIsOwner,
    } = this.groupUserTeamsByCase(
      workspacesWithMembers,
      userAsWorkspaceMembersIds,
    );

    if (teamsWithOneMember.length > 0) {
      throw boom.badRequest(
        `You are the only member of the following teams: ${teamsWithOneMember
          .map((t) => t.name)
          .join(
            ', ',
          )}. Please remove them before deleting your account, or add a member if you do not want to delete a team.`,
      );
    }

    if (teamsWithMembers.length === 0) return 1;

    const userAsTeamMemberIds = [];

    if (teamsWhichUserIsOwner.length > 0) {
      const userAsCurrentOwnerByTeam = [];
      const newOwnerByTeam = [];

      teamsWhichUserIsOwner.forEach((team) => {
        const { currentOwner, newOwner } = this.findNewOwnerForTeams(
          team,
          userAsWorkspaceMembersIds,
        );

        userAsCurrentOwnerByTeam.push(currentOwner);
        newOwnerByTeam.push(newOwner);
      });

      if (newOwnerByTeam.length > 0) {
        await this.transferOwnershipForTeams(
          newOwnerByTeam,
          userAsCurrentOwnerByTeam,
          userAsWorkspaceMembersIds,
        );
      }

      userAsTeamMemberIds.push(userAsCurrentOwnerByTeam.map((co) => co.id));
    }

    if (teamsWhichUserIsNotOwner.length > 0) {
      userAsTeamMemberIds.push(
        teamsWhichUserIsNotOwner.map(
          (t) =>
            t.teamMembers.find((tm) =>
              userAsWorkspaceMembersIds.includes(tm.workspaceMemberId),
            ).id,
        ),
      );
    }

    return this.deleteUserFromTeams(userAsTeamMemberIds.flat());
  }

  groupUserWorkspacesByCase(workspaces, user) {
    const workspacesWithOneMember = workspaces?.filter(
      (w) =>
        w.workspaceMembers.length === 1 &&
        w.workspaceMembers[0].userId === user.id,
    );

    const workspacesWithMultiMembers = workspaces?.filter(
      (w) => w.workspaceMembers.length > 1,
    );

    const workspacesWhichUserIsOwner = workspacesWithMultiMembers.filter((w) =>
      w.workspaceMembers.find(
        (wm) => wm.role === 'owner' && wm.userId === user.id,
      ),
    );

    const workspacesWhichUserIsNotOwner = workspacesWithMultiMembers.filter(
      (w) =>
        w.workspaceMembers.find(
          (wm) => wm.role !== 'owner' && wm.userId === user.id,
        ),
    );

    return {
      workspacesWithOneMember,
      workspacesWithMultiMembers,
      workspacesWhichUserIsOwner,
      workspacesWhichUserIsNotOwner,
    };
  }

  findNewOwnerForWorkspace(workspace, user) {
    const currentOwner = workspace.workspaceMembers.find(
      (wm) => wm.role === 'owner' && wm.userId === user.id,
    );
    if (!currentOwner?.id)
      throw boom.notFound(
        `No current owner found for workspace ${workspace.name}`,
      );

    const candidates = workspace.workspaceMembers.filter(
      (wm) =>
        wm.userId !== user.id && wm.role !== 'owner' && wm.role !== 'viewer',
    );
    const newOwner =
      candidates.find((wm) => wm.role === 'admin') ||
      candidates.find((wm) => wm.role === 'member');

    if (!newOwner?.id)
      throw boom.notFound(`No new owner found for workspace ${workspace.name}`);

    if (currentOwner.id === newOwner.id)
      throw boom.badRequest(
        `Current owner and new owner are the same in the workspace ${
          workspace.name
        }`,
      );

    return { currentOwner, newOwner };
  }

  getUserAsWorkspaceMemberIds(workspaces, user) {
    return workspaces
      .map((w) => w.workspaceMembers)
      .flat()
      .filter((wm) => wm.userId === user.id)
      .map((wm) => wm.id);
  }

  async transferOwnershipForWorkspaces(
    newOwnerByWorkspace,
    userAsCurrentOwnerByWorkspace,
    user,
  ) {
    return Promise.all(
      newOwnerByWorkspace.map(async (newOwner) => {
        const currentOwner = userAsCurrentOwnerByWorkspace.find(
          (co) =>
            co.workspaceId === newOwner.workspaceId && co.userId === user.id,
        );
        return this.workspaceMemberRepository.transferOwnership(
          currentOwner,
          newOwner,
        );
      }),
    );
  }

  async leaveWorkspacesHandler(workspaces, user) {
    const {
      workspacesWithOneMember,
      workspacesWithMultiMembers,
      workspacesWhichUserIsOwner,
      workspacesWhichUserIsNotOwner,
    } = this.groupUserWorkspacesByCase(workspaces, user);

    if (workspacesWithOneMember.length > 0) {
      const workspacesWithOneMemberIds = workspacesWithOneMember.map(
        (w) => w.id,
      );
      await this.deleteWorkspaces(workspacesWithOneMemberIds);
    }

    if (workspacesWithMultiMembers.length === 0) return 1;

    const userAsWorkspaceMembersIds = this.getUserAsWorkspaceMemberIds(
      workspacesWithMultiMembers,
      user,
    );

    if (workspacesWithMultiMembers.some((w) => w.projects?.length > 0)) {
      await this.leaveProjectsHandler(
        workspacesWithMultiMembers,
        userAsWorkspaceMembersIds,
      );
    }

    if (workspacesWithMultiMembers.some((w) => w.teams?.length > 0)) {
      await this.leaveTeamsHandler(
        workspacesWithMultiMembers,
        userAsWorkspaceMembersIds,
      );
    }

    const userAsWorkspaceMemberIds = [];

    if (workspacesWhichUserIsOwner.length > 0) {
      const userAsCurrentOwnerByWorkspace = [];
      const newOwnerByWorkspace = [];

      workspacesWhichUserIsOwner.forEach((workspace) => {
        const { currentOwner, newOwner } = this.findNewOwnerForWorkspace(
          workspace,
          user,
        );

        userAsCurrentOwnerByWorkspace.push(currentOwner);
        newOwnerByWorkspace.push(newOwner);
      });

      if (newOwnerByWorkspace.length >= 1) {
        await this.transferOwnershipForWorkspaces(
          newOwnerByWorkspace,
          userAsCurrentOwnerByWorkspace,
          user,
        );
      }

      userAsWorkspaceMemberIds.push(
        userAsCurrentOwnerByWorkspace.map((co) => co.id),
      );
    }

    if (workspacesWhichUserIsNotOwner.length > 0) {
      userAsWorkspaceMemberIds.push(
        workspacesWhichUserIsNotOwner.map(
          (w) => w.workspaceMembers.find((wm) => wm.userId === user.id)?.id,
        ),
      );
    }

    return this.deleteUserFromWorkspaces(userAsWorkspaceMemberIds.flat());
  }

  async deleteUser(userId) {
    const deletedUser = await this.userRepository.delete(userId);
    if (deletedUser === 0)
      throw boom.notFound(
        'Something went wrong deleting the user. Returned 0 rows deleted',
      );
    return deletedUser;
  }

  async deleteWorkspaces(workspaceIds) {
    const deletedRows = await this.workspaceRepository.bulkDelete(workspaceIds);
    if (deletedRows === 0)
      throw boom.notFound(
        'Something went wrong deleting the workspaces. Returned 0 rows deleted',
      );
    return deletedRows;
  }

  async deleteUserFromProjects(projectMemberIds) {
    const deletedRows =
      await this.projectMemberRepository.bulkDelete(projectMemberIds);
    if (deletedRows === 0)
      throw boom.notFound(
        'Something went wrong deleting the project members. Returned 0 rows deleted',
      );
    return deletedRows;
  }

  async deleteUserFromTeams(teamMemberIds) {
    const deletedRows =
      await this.teamMemberRepository.bulkDelete(teamMemberIds);
    if (deletedRows === 0)
      throw boom.notFound(
        'Something went wrong deleting the team members. Returned 0 rows deleted',
      );
    return deletedRows;
  }

  async deleteUserFromWorkspaces(workspaceMemberIds) {
    const deletedRows =
      await this.workspaceMemberRepository.bulkDelete(workspaceMemberIds);
    if (deletedRows === 0)
      throw boom.notFound(
        'Something went wrong deleting the workspace members. Returned 0 rows deleted',
      );
    return deletedRows;
  }
}

module.exports = DeleteAccountUseCase;
