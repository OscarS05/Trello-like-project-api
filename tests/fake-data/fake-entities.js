const mockJobWithBullMQ = (options = {}) => {
  const { overrides = {}, jobName = 'sendVerificationEmail' } = options;
  return {
    id: '1',
    name: jobName,
    ...overrides,
  };
};

const createUser = (overrides = {}) => ({
  id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
  email: 'John@email.com',
  name: 'John Doe',
  role: 'basic',
  createdAt: '2025-04-23T23:40:07.036Z',
  ...overrides,
});

const createAnotherUser = (overrides = {}) => ({
  id: '81f72543-69d9-4764-9b73-57e0cf785731',
  email: 'Pedro@email.com',
  name: 'Pedro',
  role: 'basic',
  createdAt: '2025-04-23T23:40:07.036Z',
  ...overrides,
});

const createWorkspace = (overrides = {}) => ({
  id: 'e033629e-7fee-48e9-a28f-86a3ed4423b0',
  name: 'NestJS',
  description: 'Personal project',
  userId: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
  createdAt: '2025-05-23T17:38:42.864Z',
  ...overrides,
});

const createWorkspaceMember = (overrides = {}) => ({
  id: '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
  userId: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
  user: { name: 'John Doe' },
  role: 'owner',
  workspaceId: 'e033629e-7fee-48e9-a28f-86a3ed4423b0',
  addedAt: '2025-04-23T23:40:07.036Z',
  ...overrides,
});

const createAnotherWorkspaceMember = (overrides = {}) => ({
  id: '3e5c0b17-1ab4-41dc-b36a-e47f6ad9ec02',
  userId: '81f72543-69d9-4764-9b73-57e0cf785731',
  user: { name: 'Pedro' },
  role: 'member',
  workspaceId: 'e033629e-7fee-48e9-a28f-86a3ed4423b0',
  addedAt: '2025-04-23T23:40:07.036Z',
  ...overrides,
});

const createProject = (overrides = {}) => ({
  id: '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
  name: 'Testing',
  visibility: 'private',
  backgroundUrl: 'https://unsplash.com',
  workspaceId: 'e033629e-7fee-48e9-a28f-86a3ed4423b0',
  workspaceMemberId: '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
  createdAt: '2025-04-23T23:40:07.036Z',
  ...overrides,
});

const createProjectMember = (overrides = {}) => ({
  id: 'a1f2b3c4-d5e6-7890-ab12-cd34ef567890',
  userId: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
  user: { name: 'John Doe' },
  role: 'owner',
  workspaceId: 'e033629e-7fee-48e9-a28f-86a3ed4423b0',
  workspaceMemberId: '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
  projectId: '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
  ...overrides,
});

const createAnotherProjectMember = (overrides = {}) => ({
  id: 'b1c2d3e4-f5g6-7891-ba12-dc43fe678901',
  userId: '81f72543-69d9-4764-9b73-57e0cf785731',
  user: { name: 'pedro' },
  role: 'member',
  workspaceId: 'e033629e-7fee-48e9-a28f-86a3ed4423b0',
  workspaceMemberId: '3e5c0b17-1ab4-41dc-b36a-e47f6ad9ec02',
  projectId: '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
  ...overrides,
});

const createTeam = (overrides = {}) => ({
  id: '9f4b8e1f-3a6e-4d4d-81f3-a5cb6bca72bd',
  name: 'Team QA',
  workspaceId: 'e033629e-7fee-48e9-a28f-86a3ed4423b0',
  workspaceMemberId: '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
  ...overrides,
});

const createTeamMember = (overrides = {}) => ({
  id: 'd4e5f6a7-b8c9-1234-9abc-def012345678',
  userId: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
  user: { name: 'John Doe' },
  role: 'owner',
  teamId: '9f4b8e1f-3a6e-4d4d-81f3-a5cb6bca72bd',
  workspaceMemberId: '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
  ...overrides,
});

const createAnotherTeamMember = (overrides = {}) => ({
  id: 'e5f6a7b8-c9d0-2345-9bcd-ef1234567890',
  userId: '81f72543-69d9-4764-9b73-57e0cf785731',
  user: { name: 'Pedro' },
  role: 'member',
  teamId: '9f4b8e1f-3a6e-4d4d-81f3-a5cb6bca72bd',
  workspaceId: 'e033629e-7fee-48e9-a28f-86a3ed4423b0',
  workspaceMemberId: '3e5c0b17-1ab4-41dc-b36a-e47f6ad9ec02',
  ...overrides,
});

const createList = (overrides = {}) => ({
  id: '1792d3bc-b24c-4727-acd2-45ff116d27cb',
  name: 'Done',
  projectId: '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
  createdAt: '2025-04-03T22:41:58.163Z',
  ...overrides,
});

const createCard = (overrides = {}) => ({
  id: '1a8ad354-e5bb-49f7-95b3-5cdfa0533233',
  name: 'Task 2',
  description: 'description',
  listId: '1792d3bc-b24c-4727-acd2-45ff116d27cb',
  createdAt: '2025-04-04T01:43:05.229Z',
  ...overrides,
});

const createCardAttachment = (overrides = {}) => ({
  id: 'dbb98467-81ad-4018-90f6-cbf581eac82d',
  filename: 'Agroplus-db-scheme.jpg',
  url: 'https://res.cloudinary.com/dfprxzekh/image/upload/v1744326304/card-attachments/file_ysjlp7.jpg',
  cardId: '1a8ad354-e5bb-49f7-95b3-5cdfa0533233',
  type: 'image/jpeg',
  publicId: 'card-attachment/Agroplus-db-scheme',
  createdAt: '2025-04-10T23:05:04.884Z',
  ...overrides,
});

const createCardMember = (overrides = {}) => ({
  id: '55ba6680-e21f-4416-a6cc-ce369000b1da',
  name: 'lilo',
  projectMemberId: 'b1c2d3e4-f5g6-7891-ba12-dc43fe678901',
  cardId: '1a8ad354-e5bb-49f7-95b3-5cdfa0533233',
  ...overrides,
});

const createLabel = (overrides = {}) => ({
  id: '28436f1c-b90e-4b0d-815f-0ad9016ce92b',
  name: 'In progress',
  color: '#FFFFFF',
  projectId: '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
  ...overrides,
});

const createLabelByCard = (overrides = {}) => ({
  id: '28436f1c-b90e-4b0d-815f-0ad9016ce92b',
  name: 'In progress',
  color: '#FFFFFF',
  projectId: '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
  isVisible: true,
  ...overrides,
});

const createChecklist = (overrides = {}) => ({
  id: '449f8ab9-1f3a-4d7d-af3d-40be1a8958eb',
  name: 'New checklist',
  cardId: '1a8ad354-e5bb-49f7-95b3-5cdfa0533233',
  createdAt: '2025-04-07T23:55:39.268Z',
  ...overrides,
});

const createChecklistItem = (overrides = {}) => ({
  id: '327c2217-6383-4305-b20a-ca6d9cb1758d',
  name: 'item 1',
  checklistId: '449f8ab9-1f3a-4d7d-af3d-40be1a8958eb',
  isChecked: false,
  dueDate: '2025-04-09T15:30:00.000Z',
  createdAt: '2025-04-09T00:57:42.275Z',
  ...overrides,
});

const createChecklistItemMember = (overrides = {}) => ({
  id: '93cb4c3c-c9c4-420d-8d2e-0268b74036b0',
  name: 'lilo',
  checklistItemId: '327c2217-6383-4305-b20a-ca6d9cb1758d',
  projectMemberId: 'e5f6a7b8-c9d0-2345-9bcd-ef1234567890',
  addedAt: '2025-04-09T00:57:42.282Z',
  ...overrides,
});

module.exports = {
  createUser,
  createAnotherUser,
  createWorkspace,
  createWorkspaceMember,
  createAnotherWorkspaceMember,
  createProject,
  createProjectMember,
  createAnotherProjectMember,
  createTeam,
  createTeamMember,
  createAnotherTeamMember,
  mockJobWithBullMQ,
  createList,
  createCard,
  createCardAttachment,
  createCardMember,
  createLabel,
  createLabelByCard,
  createChecklist,
  createChecklistItem,
  createChecklistItemMember,
};
