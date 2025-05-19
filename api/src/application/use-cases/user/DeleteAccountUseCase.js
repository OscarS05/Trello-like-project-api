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
    if (!user.id) throw boom.notFound('User not found');

    if (!user.workspaces?.length === 0) return this.deleteUser(userId);

    if (user.workspaces?.length > 0)
      await this.leaveWorkspacesHandler(user.workspaces, user);

    await this.deleteUser(userId);
    return 1;
  }

  async leaveProjectsHandler(workspacesWithMembers, userAsWorkspaceMembersIds) {
    const projectsWithOneMemberWhichUserBelongs = workspacesWithMembers
      .map((w) => w.projects)
      .flat()
      .filter(
        (p) =>
          p.projectMembers.length === 1 &&
          userAsWorkspaceMembersIds.includes(
            p.projectMembers[0].workspaceMemberId,
          ),
      );

    if (projectsWithOneMemberWhichUserBelongs.length > 0) {
      throw boom.badRequest(
        `You are the only member of the following projects: ${projectsWithOneMemberWhichUserBelongs
          .map((p) => p.name)
          .join(
            ', ',
          )}. Please remove them before deleting your account, or add a member if you do not want to delete a project.`,
      );
    }

    const projectsWithMembersWhichUserBelongs = workspacesWithMembers
      .map((w) => w.projects)
      .flat()
      .filter(
        (p) =>
          p.projectMembers.length > 1 &&
          p.projectMembers.find((pm) =>
            userAsWorkspaceMembersIds.includes(pm.workspaceMemberId),
          ),
      );

    if (projectsWithMembersWhichUserBelongs.length === 0) return 1;

    const projectsWhichUserIsOwner = projectsWithMembersWhichUserBelongs.filter(
      (p) =>
        p.projectMembers.find(
          (pm) =>
            pm.role === 'owner' &&
            userAsWorkspaceMembersIds.includes(pm.workspaceMemberId),
        ),
    );
    const projectsWhichUserIsNotOwner =
      projectsWithMembersWhichUserBelongs.filter((p) =>
        p.projectMembers.find(
          (pm) =>
            pm.role !== 'owner' &&
            userAsWorkspaceMembersIds.includes(pm.workspaceMemberId),
        ),
      );

    const userAsProjectMemberIds = [];

    if (projectsWhichUserIsOwner.length > 0) {
      const userAsCurrentOwnerByProject = [];
      const newOwnerByProject = [];

      projectsWhichUserIsOwner.forEach((project) => {
        const currentOwner = project.projectMembers.find(
          (pm) =>
            pm.role === 'owner' &&
            userAsWorkspaceMembersIds.includes(pm.workspaceMemberId),
        );
        if (!currentOwner?.id)
          throw boom.notFound(
            `No current owner found for project ${project.name}`,
          );

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

        userAsCurrentOwnerByProject.push(currentOwner);
        newOwnerByProject.push(newOwner);
      });

      await Promise.all(
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

  async leaveTeamsHandler(workspacesWithMembers, userAsWorkspaceMembersIds) {
    const teamsWithOneMemberWhichUserBelongs = workspacesWithMembers
      .map((w) => w.teams)
      .flat()
      .filter(
        (t) =>
          t.teamMembers.length === 1 &&
          userAsWorkspaceMembersIds.includes(
            t.teamMembers[0]?.workspaceMemberId,
          ),
      );

    if (teamsWithOneMemberWhichUserBelongs.length > 0) {
      throw boom.badRequest(
        `You are the only member of the following teams: ${teamsWithOneMemberWhichUserBelongs
          .map((t) => t.name)
          .join(
            ', ',
          )}. Please remove them before deleting your account, or add a member if you do not want to delete a team.`,
      );
    }

    const teamsWithMembersWhichUserBelongs = workspacesWithMembers
      .map((w) => w.teams)
      .flat()
      .filter(
        (t) =>
          t.teamMembers.length > 1 &&
          t.teamMembers.find((tm) =>
            userAsWorkspaceMembersIds.includes(tm.workspaceMemberId),
          ),
      );

    if (teamsWithMembersWhichUserBelongs.length === 0) return 1;

    const teamsWhichUserIsOwner = teamsWithMembersWhichUserBelongs.filter((t) =>
      t.teamMembers.find(
        (tm) =>
          tm.role === 'owner' &&
          userAsWorkspaceMembersIds.includes(tm.workspaceMemberId),
      ),
    );
    const teamsWhichUserIsNotOwner = teamsWithMembersWhichUserBelongs.filter(
      (t) =>
        t.teamMembers.find(
          (tm) =>
            tm.role !== 'owner' &&
            userAsWorkspaceMembersIds.includes(tm.workspaceMemberId),
        ),
    );

    const userAsTeamMemberIds = [];

    if (teamsWhichUserIsOwner.length > 0) {
      const userAsCurrentOwnerByTeam = [];
      const newOwnerByTeam = [];

      teamsWhichUserIsOwner.forEach((team) => {
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

        userAsCurrentOwnerByTeam.push(currentOwner);
        newOwnerByTeam.push(newOwner);
      });

      await Promise.all(
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

  async leaveWorkspacesHandler(workspaces, user) {
    const workspacesWithOneMemberWhichUserBelongs = workspaces?.filter(
      (w) =>
        w.workspaceMembers.length === 1 &&
        w.workspaceMembers[0].userId === user.id,
    );
    if (workspacesWithOneMemberWhichUserBelongs.length > 0) {
      const workspacesWithOneMemberIds =
        workspacesWithOneMemberWhichUserBelongs.map((w) => w.id);
      await this.deleteWorkspaces(workspacesWithOneMemberIds);
    }

    const workspacesWithMembersWhichUserBelongs = workspaces?.filter(
      (w) => w.workspaceMembers.length > 1,
    );
    if (workspacesWithMembersWhichUserBelongs.length === 0) return 1;

    if (workspacesWithMembersWhichUserBelongs.length > 0) {
      const userAsWorkspaceMembersIds = workspacesWithMembersWhichUserBelongs
        .map((w) => w.workspaceMembers)
        .flat()
        .filter((wm) => wm.userId === user.id)
        .map((wm) => wm.id);

      if (
        workspacesWithMembersWhichUserBelongs.map((w) => w.projects?.length > 0)
      ) {
        await this.leaveProjectsHandler(
          workspacesWithMembersWhichUserBelongs,
          userAsWorkspaceMembersIds,
        );
      }

      if (
        workspacesWithMembersWhichUserBelongs.map((w) => w.teams?.length > 0)
      ) {
        await this.leaveTeamsHandler(
          workspacesWithMembersWhichUserBelongs,
          userAsWorkspaceMembersIds,
        );
      }
    }

    const workspacesWhichUserIsOwner =
      workspacesWithMembersWhichUserBelongs.filter((w) =>
        w.workspaceMembers.find(
          (wm) => wm.role === 'owner' && wm.userId === user.id,
        ),
      );
    const workspacesWhichUserIsNotOwner =
      workspacesWithMembersWhichUserBelongs.filter((w) =>
        w.workspaceMembers.find(
          (wm) => wm.role !== 'owner' && wm.userId === user.id,
        ),
      );

    const userAsWorkspaceMemberIds = [];

    if (workspacesWhichUserIsOwner.length > 0) {
      const userAsCurrentOwnerByWorkspace = [];
      const newOwnerByWorkspace = [];

      workspacesWhichUserIsOwner.forEach((workspace) => {
        const currentOwner = workspace.workspaceMembers.find(
          (wm) => wm.role === 'owner' && wm.userId === user.id,
        );
        if (!currentOwner?.id)
          throw boom.notFound(
            `No current owner found for workspace ${workspace.name}`,
          );

        const candidates = workspace.workspaceMembers.filter(
          (wm) =>
            wm.userId !== user.id &&
            wm.role !== 'owner' &&
            wm.role !== 'viewer',
        );
        const newOwner =
          candidates.find((wm) => wm.role === 'admin') ||
          candidates.find((wm) => wm.role === 'member');

        if (!newOwner?.id)
          throw boom.notFound(
            `No new owner found for workspace ${workspace.name}`,
          );
        if (currentOwner.id === newOwner.id)
          throw boom.badRequest(
            `Current owner and new owner are the same in the workspace ${
              workspace.name
            }`,
          );

        userAsCurrentOwnerByWorkspace.push(currentOwner);
        newOwnerByWorkspace.push(newOwner);
      });

      await Promise.all(
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
