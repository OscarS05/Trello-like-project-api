const GetProjectMembersOfWorkspaceMemberUseCase = require('../../../api/src/application/use-cases/project-member/GetProjectMembersOfWorkspaceMemberUseCase');
const ProjectMemberDto = require('../../../api/src/application/dtos/projectMember.dto');
const {
  createProjectMember,
  createProject,
} = require('../../fake-data/fake-entities');

describe('GetProjectMembersOfWorkspaceMemberUseCase', () => {
  let workspaceMemberId;
  let projectMembers;
  let useCaseResponse;
  let mockProjectMemberRepository;
  let getProjectMembersOfWorkspaceMemberUseCase;

  beforeEach(() => {
    workspaceMemberId = createProjectMember().workspaceMemberId;
    projectMembers = [
      { ...createProjectMember(), project: createProject() },
      { ...createProjectMember(), project: createProject() },
    ];
    useCaseResponse = [...projectMembers];

    mockProjectMemberRepository = {
      findAll: jest.fn().mockResolvedValue(projectMembers),
    };

    getProjectMembersOfWorkspaceMemberUseCase =
      new GetProjectMembersOfWorkspaceMemberUseCase({
        projectMemberRepository: mockProjectMemberRepository,
      });
  });

  test('It should return a list of project members', async () => {
    const result =
      await getProjectMembersOfWorkspaceMemberUseCase.execute(
        workspaceMemberId,
      );

    expect(mockProjectMemberRepository.findAll).toHaveBeenCalledWith(
      workspaceMemberId,
    );
    expect(result).toMatchObject(
      useCaseResponse.map((pm) => ProjectMemberDto.withProject(pm)),
    );
  });

  test('It should return an error because workspaceMemberId was not provided', async () => {
    try {
      await getProjectMembersOfWorkspaceMemberUseCase.execute(null);
    } catch (error) {
      expect(mockProjectMemberRepository.findAll).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty array because the findAll operation to the db does not find anything', async () => {
    mockProjectMemberRepository.findAll.mockResolvedValue([]);

    const result =
      await getProjectMembersOfWorkspaceMemberUseCase.execute(
        workspaceMemberId,
      );

    expect(mockProjectMemberRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
