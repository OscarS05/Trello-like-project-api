/* eslint-disable no-param-reassign */
const GetWorkspaceAndItsProjectsUseCase = require('../../../api/src/application/use-cases/workspace/getWorkspaceAndItsProjectsUseCase');
const {
  createWorkspace,
  createWorkspaceMember,
  createProject,
  createProjectMember,
} = require('../../fake-data/fake-entities');

describe('GetWorkspaceAndItsProjectsUseCase', () => {
  let workspaceMember;
  let workspaceWithItsProjects;
  let useCaseResponse;
  let mockWorkspaceRepository;
  let getWorkspaceAndItsProjectsUseCase;

  beforeEach(() => {
    workspaceMember = createWorkspaceMember();

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
        })),
      };
    };

    workspaceWithItsProjects = { ...mockWorkspaceWithGet() };

    useCaseResponse = {
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
    };

    delete useCaseResponse.createdAt;
    useCaseResponse.projects.forEach((p) => {
      delete p.createdAt;
      delete p.workspaceMemberId;
    });

    mockWorkspaceRepository = {
      findById: jest.fn().mockResolvedValue(workspaceWithItsProjects),
    };

    getWorkspaceAndItsProjectsUseCase = new GetWorkspaceAndItsProjectsUseCase({
      workspaceRepository: mockWorkspaceRepository,
    });
  });

  test('It should return a successful data', async () => {
    const result =
      await getWorkspaceAndItsProjectsUseCase.execute(workspaceMember);

    expect(mockWorkspaceRepository.findById).toHaveBeenCalledWith(
      workspaceMember,
    );
    expect(result).toMatchObject(useCaseResponse);
    expect(result.projects[0].access).toBe(true);
    expect(result.projects[1].access).toBe(false);
  });

  test('It should return an error because workspaceMember was not provided', async () => {
    try {
      await getWorkspaceAndItsProjectsUseCase.execute(undefined);

      expect(mockWorkspaceRepository.findById).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty array because the findById to the db does does not find anything', async () => {
    mockWorkspaceRepository.findById.mockResolvedValue([]);
    const result =
      await getWorkspaceAndItsProjectsUseCase.execute(workspaceMember);

    expect(mockWorkspaceRepository.findById).toHaveBeenCalledWith(
      workspaceMember,
    );
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
