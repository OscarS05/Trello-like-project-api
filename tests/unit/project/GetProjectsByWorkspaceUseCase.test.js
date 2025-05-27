const GetProjectsByWorkspaceMemberUseCase = require('../../../api/src/application/use-cases/project/GetProjectsByWorkspaceUseCase');
const ProjectDto = require('../../../api/src/application/dtos/project.dto');
const {
  createProjectMember,
  createProject,
} = require('../../fake-data/fake-entities');

describe('GetProjectsByWorkspaceMemberUseCase', () => {
  let workspaceId;
  let projects;
  let mockProjectRepository;
  let getProjectsByWorkspaceMemberUseCase;

  beforeEach(() => {
    workspaceId = createProjectMember().workspaceId;
    projects = [createProject(), createProject()];

    mockProjectRepository = {
      findAllByWorkspace: jest.fn().mockResolvedValue(projects),
    };

    getProjectsByWorkspaceMemberUseCase =
      new GetProjectsByWorkspaceMemberUseCase({
        projectRepository: mockProjectRepository,
      });
  });

  test('It should correctly return projects', async () => {
    const result =
      await getProjectsByWorkspaceMemberUseCase.execute(workspaceId);

    expect(mockProjectRepository.findAllByWorkspace).toHaveBeenCalledWith(
      workspaceId,
    );
    expect(result).toMatchObject(
      projects.map((project) => new ProjectDto(project)),
    );
  });

  test('It should return an error because workspaceId was not provided', async () => {
    try {
      await getProjectsByWorkspaceMemberUseCase.execute(null);

      expect(mockProjectRepository.findAllByWorkspace).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided|is required/);
    }
  });

  test('It should return an empty array because the db did not find anything', async () => {
    mockProjectRepository.findAllByWorkspace.mockResolvedValueOnce([]);

    const result =
      await getProjectsByWorkspaceMemberUseCase.execute(workspaceId);

    expect(mockProjectRepository.findAllByWorkspace).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
