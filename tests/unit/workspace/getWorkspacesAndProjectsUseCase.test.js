/* eslint-disable no-param-reassign */
const GetWorkspacesAndProjectsUseCase = require('../../../api/src/application/use-cases/workspace/getWorkspacesAndProjectsUseCase');
const {
  createWorkspace,
  createWorkspaceMember,
  createProject,
  createProjectMember,
} = require('../../fake-data/fake-entities');

describe('GetWorkspacesAndProjectsUseCase', () => {
  let userId;
  let userAsWorkspaceMembers;
  let useCaseResponse;
  let mockWorkspaceRepository;
  let getWorkspacesAndProjectsUseCase;

  beforeEach(() => {
    userId = createWorkspace().id;

    const mockProjectWithGet = (changesProject = {}, changesMember = {}) => {
      const baseProject = createProject(changesProject);
      return {
        ...baseProject,
        projectMembers: [createProjectMember(changesMember)],
        get: jest.fn(() => ({
          ...baseProject,
        })),
      };
    };

    const mockWorkspaceWithGet = () => {
      const baseWorkspace = createWorkspace();
      return {
        ...baseWorkspace,
        projects: [
          mockProjectWithGet(),
          mockProjectWithGet(
            {
              workspaceMemberId: '3e5c0b17-1ab4-41dc-b36a-e47f6ad9ec02',
            },
            {
              userId: '81f72543-69d9-4764-9b73-57e0cf785731',
              workspaceMemberId: '3e5c0b17-1ab4-41dc-b36a-e47f6ad9ec02',
            },
          ),
        ],
        get: jest.fn(() => ({
          ...baseWorkspace,
        })),
      };
    };

    userAsWorkspaceMembers = [
      {
        ...createWorkspaceMember(),
        workspace: mockWorkspaceWithGet(),
      },
      {
        ...createWorkspaceMember(),
        workspace: mockWorkspaceWithGet(),
      },
    ];

    useCaseResponse = [
      {
        ...createWorkspace(),
        projects: [
          { ...createProject(), access: true },
          {
            ...createProject({
              workspaceMemberId: '3e5c0b17-1ab4-41dc-b36a-e47f6ad9ec02',
            }),
            access: false,
          },
        ],
      },
      {
        ...createWorkspace(),
        projects: [
          { ...createProject(), access: true },
          {
            ...createProject({
              workspaceMemberId: '3e5c0b17-1ab4-41dc-b36a-e47f6ad9ec02',
            }),
            access: false,
          },
        ],
      },
    ];

    useCaseResponse.forEach((w) => {
      delete w.createdAt;
      w.projects.forEach((p) => {
        delete p.createdAt;
        delete p.workspaceMemberId;
      });
    });

    mockWorkspaceRepository = {
      findAll: jest.fn().mockResolvedValue(userAsWorkspaceMembers),
    };

    getWorkspacesAndProjectsUseCase = new GetWorkspacesAndProjectsUseCase({
      workspaceRepository: mockWorkspaceRepository,
    });
  });

  test('It should return a successful 1', async () => {
    const result = await getWorkspacesAndProjectsUseCase.execute(userId);

    expect(mockWorkspaceRepository.findAll).toHaveBeenCalledWith(userId);
    expect(result).toMatchObject(useCaseResponse);
    expect(result[0].projects[0].access).toBe(true);
    expect(result[0].projects[1].access).toBe(false);
  });

  test('It should return an error because userId was not provided', async () => {
    try {
      await getWorkspacesAndProjectsUseCase.execute(undefined);

      expect(mockWorkspaceRepository.findAll).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty array because the findAll to the db does does not find anything', async () => {
    mockWorkspaceRepository.findAll.mockResolvedValue([]);
    const result = await getWorkspacesAndProjectsUseCase.execute(userId);

    expect(mockWorkspaceRepository.findAll).toHaveBeenCalledWith(userId);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
