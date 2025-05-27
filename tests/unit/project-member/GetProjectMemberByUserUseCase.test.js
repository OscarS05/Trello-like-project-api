const GetProjectMemberByUserUseCase = require('../../../api/src/application/use-cases/project-member/GetProjectMemberByUserUseCase');
const { createProjectMember } = require('../../fake-data/fake-entities');

describe('GetProjectMemberByUserUseCase', () => {
  let userId;
  let workspaceId;
  let projectId;
  let projectMember;
  let useCaseResponse;
  let mockProjectMemberRepository;
  let getProjectMemberByUserUseCase;

  beforeEach(() => {
    userId = createProjectMember().userId;
    workspaceId = createProjectMember().workspaceId;
    projectId = createProjectMember().projectId;
    projectMember = createProjectMember();
    useCaseResponse = { ...projectMember };

    mockProjectMemberRepository = {
      findByUser: jest.fn().mockResolvedValue(projectMember),
    };

    getProjectMemberByUserUseCase = new GetProjectMemberByUserUseCase({
      projectMemberRepository: mockProjectMemberRepository,
    });
  });

  test('It should return a project member', async () => {
    const result = await getProjectMemberByUserUseCase.execute(
      userId,
      workspaceId,
      projectId,
    );

    expect(mockProjectMemberRepository.findByUser).toHaveBeenCalledWith(
      userId,
      workspaceId,
      projectId,
    );
    expect(result).toMatchObject(useCaseResponse);
  });

  test('It should return an error because projectId was not provided', async () => {
    try {
      await getProjectMemberByUserUseCase.execute(
        userId,
        workspaceId,
        undefined,
      );
    } catch (error) {
      expect(mockProjectMemberRepository.findByUser).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because workspaceId was not provided', async () => {
    try {
      await getProjectMemberByUserUseCase.execute(userId, undefined, projectId);
    } catch (error) {
      expect(mockProjectMemberRepository.findByUser).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because userId was not provided', async () => {
    try {
      await getProjectMemberByUserUseCase.execute(
        undefined,
        workspaceId,
        projectId,
      );
    } catch (error) {
      expect(mockProjectMemberRepository.findByUser).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty object because the findByUser operation to the db does not find anything', async () => {
    mockProjectMemberRepository.findByUser.mockResolvedValue({});

    const result = await getProjectMemberByUserUseCase.execute(
      userId,
      workspaceId,
      projectId,
    );

    expect(mockProjectMemberRepository.findByUser).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
