const {
  createUser,
  createWorkspace,
  createWorkspaceMember,
  createAnotherWorkspaceMember,
  createProject,
  createProjectMember,
  createAnotherProjectMember,
  createTeam,
  createTeamMember,
  createAnotherTeamMember,
} = require('./fake-entities');

const createUserWithWorkspaces = ({
  includeUser = true,
  includeWorkspace = true,
  includeProjects = true,
  includeTeams = true,
  includeOtherWorkspaceMembers = true,
  includeOtherProjectMembers = true,
  includeOtherTeamMembers = true,
  workspaceData = {},
  workspaceMemberData = {},
  anotherWorkspaceMemberData = {},
  projectData = {},
  projectMemberData = {},
  anotherProjectMemberData = {},
  teamData = {},
  teamMemberData = {},
  anotherTeamMemberData = {},
  howMuchUsers = 1,
  howMuchWorkspaces = 1,
  howMuchProjects = 1,
  howMuchTeams = 1,
} = {}) => {
  let user = null;
  if (includeUser) {
    user =
      howMuchUsers > 1
        ? Array.from({ length: howMuchUsers }, () => createUser())
        : createUser();
  }

  const workspace = includeWorkspace ? createWorkspace(workspaceData) : null;
  const workspaceMembers = [
    createWorkspaceMember(workspaceMemberData),
    ...(includeOtherWorkspaceMembers
      ? [
          createWorkspaceMember(
            createAnotherWorkspaceMember(anotherWorkspaceMemberData),
          ),
        ]
      : []),
  ];
  const project = includeProjects
    ? {
        ...createProject(projectData),
        projectMembers: [
          createProjectMember(projectMemberData),
          ...(includeOtherProjectMembers
            ? [
                createProjectMember(
                  createAnotherProjectMember(anotherProjectMemberData),
                ),
              ]
            : []),
        ],
      }
    : null;

  const team = includeTeams
    ? {
        ...createTeam(teamData),
        teamMembers: [
          createTeamMember(teamMemberData),
          ...(includeOtherTeamMembers
            ? [createTeamMember(createAnotherTeamMember(anotherTeamMemberData))]
            : []),
        ],
      }
    : null;

  return {
    ...user,
    workspaces: Array.from({ length: howMuchWorkspaces }, () => ({
      ...workspace,
      workspaceMembers,
      projects: project
        ? Array.from({ length: howMuchProjects }, () => ({ ...project }))
        : [],
      teams: team
        ? Array.from({ length: howMuchTeams }, () => ({ ...team }))
        : [],
    })),
  };
};

module.exports = {
  createUserWithWorkspaces,
};
