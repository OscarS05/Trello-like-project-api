const GetProjectMemberByWorkspaceMemberUseCase = require('../../../api/src/application/use-cases/project-member/GetProjectMemberByWorkspaceMemberUseCase');
const { createProjectMember } = require('../../fake-data/fake-entities');

describe('GetProjectMemberByWorkspaceMemberUseCase', () => {
  let workspaceMemberId;
  let projectId;
  let projectMember;
  let useCaseResponse;
  let mockProjectMemberRepository;
  let getProjectMemberByWorkspaceMemberUseCase;

  beforeEach(() => {
    workspaceMemberId = createProjectMember().workspaceMemberId;
    projectId = createProjectMember().projectId;
    projectMember = createProjectMember();
    useCaseResponse = { ...projectMember };

    mockProjectMemberRepository = {
      findByWorkspaceMember: jest.fn().mockResolvedValue(projectMember),
    };

    getProjectMemberByWorkspaceMemberUseCase =
      new GetProjectMemberByWorkspaceMemberUseCase({
        projectMemberRepository: mockProjectMemberRepository,
      });
  });

  test('It should return a project member', async () => {
    const result = await getProjectMemberByWorkspaceMemberUseCase.execute(
      workspaceMemberId,
      projectId,
    );

    expect(
      mockProjectMemberRepository.findByWorkspaceMember,
    ).toHaveBeenCalledWith(workspaceMemberId, projectId);
    expect(result).toMatchObject(useCaseResponse);
  });

  test('It should return an error because workspaceMemberId was not provided', async () => {
    try {
      await getProjectMemberByWorkspaceMemberUseCase.execute(null, projectId);
    } catch (error) {
      expect(
        mockProjectMemberRepository.findByWorkspaceMember,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because projectId was not provided', async () => {
    try {
      await getProjectMemberByWorkspaceMemberUseCase.execute(
        workspaceMemberId,
        null,
      );
    } catch (error) {
      expect(
        mockProjectMemberRepository.findByWorkspaceMember,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty object because the findByWorkspaceMember operation to the db does not find anything', async () => {
    mockProjectMemberRepository.findByWorkspaceMember.mockResolvedValue({});

    const result = await getProjectMemberByWorkspaceMemberUseCase.execute(
      workspaceMemberId,
      projectId,
    );

    expect(
      mockProjectMemberRepository.findByWorkspaceMember,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
