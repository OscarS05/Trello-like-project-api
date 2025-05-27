const GetProjectsByWorkspaceMemberUseCase = require('../../../api/src/application/use-cases/project/GetProjectsByWorkspaceMemberUseCase');
const ProjectDto = require('../../../api/src/application/dtos/project.dto');
const {
  createProjectMember,
  createProject,
  createAnotherProjectMember,
} = require('../../fake-data/fake-entities');

describe('GetProjectsByWorkspaceMemberUseCase', () => {
  let workspaceId;
  let workspaceMemberId;
  let projectsWithItsMembers;
  let mockProjectRepository;
  let getProjectsByWorkspaceMemberUseCase;

  beforeEach(() => {
    workspaceId = createProjectMember().workspaceId;
    workspaceMemberId = createProjectMember().workspaceMemberId;
    projectsWithItsMembers = [
      createProject({
        projectMembers: [createProjectMember(), createAnotherProjectMember()],
      }),
      createProject({
        projectMembers: [createProjectMember(), createAnotherProjectMember()],
      }),
    ];

    mockProjectRepository = {
      findAllByWorkspaceMember: jest
        .fn()
        .mockResolvedValue(projectsWithItsMembers),
    };

    getProjectsByWorkspaceMemberUseCase =
      new GetProjectsByWorkspaceMemberUseCase({
        projectRepository: mockProjectRepository,
      });
  });

  test('It should correctly return an projects with members', async () => {
    const result = await getProjectsByWorkspaceMemberUseCase.execute(
      workspaceId,
      workspaceMemberId,
    );

    expect(mockProjectRepository.findAllByWorkspaceMember).toHaveBeenCalledWith(
      workspaceId,
      workspaceMemberId,
    );
    expect(result).toMatchObject(
      projectsWithItsMembers.map((project) =>
        ProjectDto.withProjectMembers(project),
      ),
    );
  });

  test('It should return an error because workspaceId was not provided', async () => {
    try {
      await getProjectsByWorkspaceMemberUseCase.execute(
        null,
        workspaceMemberId,
      );

      expect(
        mockProjectRepository.findAllByWorkspaceMember,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided|is required/);
    }
  });

  test('It should return an error because workspaceMemberId was not provided', async () => {
    try {
      await getProjectsByWorkspaceMemberUseCase.execute(workspaceId, null);

      expect(
        mockProjectRepository.findAllByWorkspaceMember,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided|is required/);
    }
  });

  test('It should return an empty array because the db did not find anything', async () => {
    mockProjectRepository.findAllByWorkspaceMember.mockResolvedValueOnce({});

    const result = await getProjectsByWorkspaceMemberUseCase.execute(
      workspaceId,
      workspaceMemberId,
    );

    expect(
      mockProjectRepository.findAllByWorkspaceMember,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
