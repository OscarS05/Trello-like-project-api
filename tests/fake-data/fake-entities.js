const createUser = (overrides = {}) => ({
  id: `f81625ba-cee1-4b48-92a8-3f3065d219fb`,
  email: 'John@email.com',
  name: 'John Doe',
  role: 'basic',
  createdAt: '2025-04-23T23:40:07.036Z',
  ...overrides,
});

const createWorkspace = (overrides = {}) => ({
  id: 'e033629e-7fee-48e9-a28f-86a3ed4423b0',
  name: 'NestJS',
  userId: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
  ...overrides,
});

const createWorkspaceMember = (overrides = {}) => ({
  id: '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
  userId: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
  user: 'John Doe',
  role: 'owner',
  workspaceId: 'e033629e-7fee-48e9-a28f-86a3ed4423b0',
  addedAt: '2025-04-23T23:40:07.036Z',
  ...overrides,
});

const createAnotherWorkspaceMember = (overrides = {}) => ({
  id: '3e5c0b17-1ab4-41dc-b36a-e47f6ad9ec02',
  userId: '81f72543-69d9-4764-9b73-57e0cf785731',
  user: 'Pedro',
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
  user: 'John Doe',
  role: 'owner',
  workspaceId: 'e033629e-7fee-48e9-a28f-86a3ed4423b0',
  workspaceMemberId: '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
  projectId: '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
  ...overrides,
});

const createAnotherProjectMember = (overrides = {}) => ({
  id: 'b1c2d3e4-f5g6-7891-ba12-dc43fe678901',
  userId: '81f72543-69d9-4764-9b73-57e0cf785731',
  user: 'pedro',
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
  user: 'John Doe',
  role: 'owner',
  teamId: '9f4b8e1f-3a6e-4d4d-81f3-a5cb6bca72bd',
  workspaceMemberId: '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
  ...overrides,
});

const createAnotherTeamMember = (overrides = {}) => ({
  id: 'e5f6a7b8-c9d0-2345-9bcd-ef1234567890',
  userId: '81f72543-69d9-4764-9b73-57e0cf785731',
  user: 'Pedro',
  role: 'member',
  teamId: '9f4b8e1f-3a6e-4d4d-81f3-a5cb6bca72bd',
  workspaceId: 'e033629e-7fee-48e9-a28f-86a3ed4423b0',
  workspaceMemberId: '3e5c0b17-1ab4-41dc-b36a-e47f6ad9ec02',
  ...overrides,
});

module.exports = {
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
};
