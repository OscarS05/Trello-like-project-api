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
  createList,
  createCard,
  createCardAttachment,
  createCardMember,
  createChecklist,
  createChecklistItem,
  createLabel,
  createChecklistItemMember,
  createLabelByCard,
} = require('./fake-entities');

const createUserWithWorkspaces = ({
  includeUser = true,
  includeWorkspace = true,
  includeProjects = true,
  includeTeams = true,
  includeOtherWorkspaceMembers = true,
  includeOtherProjectMembers = true,
  includeOtherTeamMembers = true,
  includeLists = true,
  includeCards = true,
  includeLabels = true,
  includeLabelsByCard = true,
  includeCardAttachments = true,
  includeCardMembers = true,
  includeChecklists = true,
  includeChecklistItems = true,
  includeChecklistItemMembers = true,
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
  howMuchLists = 1,
  howMuchCards = 1,
  howMuchLabels = 1,
  howMuchLabelsByCard = 1,
  howMuchCardAttachments = 1,
  howMuchCardMembers = 1,
  howMuchChecklists = 1,
  howMuchChecklistItems = 1,
  howMuchChecklistItemMembers = 1,
  listData = {},
  cardData = {},
  labelData = {},
  labelByCardData = {},
  cardAttachmentData = {},
  cardMemberData = {},
  checklistData = {},
  checklistItemData = {},
  checklistItemMemberData = {},
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

  const list = includeLists
    ? {
        ...createList(listData),
        cards: includeCards
          ? Array.from({ length: howMuchCards }, () => {
              const card = createCard(cardData);
              return {
                ...card,
                labels: includeLabels
                  ? Array.from({ length: howMuchLabels }, () => {
                      const label = createLabel(labelData);
                      return {
                        ...label,
                        cardLabel: includeLabelsByCard
                          ? Array.from({ length: howMuchLabelsByCard }, () =>
                              createLabelByCard(labelByCardData),
                            )
                          : [],
                      };
                    })
                  : [],
                attachments: includeCardAttachments
                  ? Array.from({ length: howMuchCardAttachments }, () =>
                      createCardAttachment(cardAttachmentData),
                    )
                  : [],
                members: includeCardMembers
                  ? Array.from({ length: howMuchCardMembers }, () =>
                      createCardMember(cardMemberData),
                    )
                  : [],
                checklists: includeChecklists
                  ? Array.from({ length: howMuchChecklists }, () => {
                      const checklist = createChecklist(checklistData);
                      return {
                        ...checklist,
                        items: includeChecklistItems
                          ? Array.from(
                              { length: howMuchChecklistItems },
                              () => {
                                const checklistItem =
                                  createChecklistItem(checklistItemData);
                                return {
                                  ...checklistItem,
                                  members: includeChecklistItemMembers
                                    ? Array.from(
                                        { length: howMuchChecklistItemMembers },
                                        () =>
                                          createChecklistItemMember(
                                            checklistItemMemberData,
                                          ),
                                      )
                                    : [],
                                };
                              },
                            )
                          : [],
                      };
                    })
                  : [],
              };
            })
          : [],
      }
    : null;

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
        lists: includeLists
          ? Array.from({ length: howMuchLists }, () => ({
              ...list,
            }))
          : [],
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
