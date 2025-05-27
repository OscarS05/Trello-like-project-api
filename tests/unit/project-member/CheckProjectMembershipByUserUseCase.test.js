const CheckProjectMembershipByUserUseCase = require('../../../api/src/application/use-cases/project-member/CheckProjectMembershipByUserUseCase');
const ProjectMemberDto = require('../../../api/src/application/dtos/projectMember.dto');
const { createProjectMember } = require('../../fake-data/fake-entities');

describe('CheckProjectMembershipByUserUseCase', () => {
  let userId;
  let projectId;
  let dbResponse;
  let useCaseResponse;
  let mockProjectMemberRepository;
  let checkProjectMembershipByUserUseCase;

  beforeEach(() => {
    userId = createProjectMember().userId;
    projectId = createProjectMember().projectId;
    dbResponse = { ...createProjectMember() };
    useCaseResponse = { ...dbResponse };

    mockProjectMemberRepository = {
      checkProjectMemberByUser: jest.fn().mockResolvedValue(dbResponse),
    };

    checkProjectMembershipByUserUseCase =
      new CheckProjectMembershipByUserUseCase({
        projectMemberRepository: mockProjectMemberRepository,
      });
  });

  test('It should return a project member', async () => {
    const result = await checkProjectMembershipByUserUseCase.execute(
      userId,
      projectId,
    );

    expect(
      mockProjectMemberRepository.checkProjectMemberByUser,
    ).toHaveBeenCalledWith(userId, projectId);
    expect(result).toMatchObject(new ProjectMemberDto(useCaseResponse));
  });

  test('It should return an error because projectId was not provided', async () => {
    try {
      await checkProjectMembershipByUserUseCase.execute(userId, null);
    } catch (error) {
      expect(
        mockProjectMemberRepository.checkProjectMemberByUser,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because userId was not provided', async () => {
    try {
      await checkProjectMembershipByUserUseCase.execute(null, projectId);
    } catch (error) {
      expect(
        mockProjectMemberRepository.checkProjectMemberByUser,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty object because the checkProjectMemberByUser operation to the db does not find any project', async () => {
    mockProjectMemberRepository.checkProjectMemberByUser.mockResolvedValue({});

    const result = await checkProjectMembershipByUserUseCase.execute(
      userId,
      projectId,
    );

    expect(
      mockProjectMemberRepository.checkProjectMemberByUser,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
