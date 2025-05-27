const GetMemberByIdUseCase = require('../../../api/src/application/use-cases/project-member/GetMemberByIdUseCase');
const ProjectMemberDto = require('../../../api/src/application/dtos/projectMember.dto');
const {
  createProjectMember,
  createWorkspaceMember,
  createUser,
} = require('../../fake-data/fake-entities');

describe('GetMemberByIdUseCase', () => {
  let projectMemberId;
  let projectMember;
  let useCaseResponse;
  let mockProjectMemberRepository;
  let getMemberByIdUseCase;

  beforeEach(() => {
    projectMemberId = createProjectMember().id;
    projectMember = {
      ...createProjectMember(),
      workspaceMember: { ...createWorkspaceMember(), user: createUser() },
    };
    useCaseResponse = { ...projectMember };

    mockProjectMemberRepository = {
      findProjectMemberById: jest.fn().mockResolvedValue(projectMember),
    };

    getMemberByIdUseCase = new GetMemberByIdUseCase({
      projectMemberRepository: mockProjectMemberRepository,
    });
  });

  test('It should return a project member', async () => {
    const result = await getMemberByIdUseCase.execute(projectMemberId);

    expect(
      mockProjectMemberRepository.findProjectMemberById,
    ).toHaveBeenCalledWith(projectMemberId);
    expect(result).toMatchObject(new ProjectMemberDto(useCaseResponse));
  });

  test('It should return an error because projectMemberId was not provided', async () => {
    try {
      await getMemberByIdUseCase.execute(undefined);
    } catch (error) {
      expect(
        mockProjectMemberRepository.findProjectMemberById,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty object because the findProjectMemberById operation to the db does not find anything', async () => {
    mockProjectMemberRepository.findProjectMemberById.mockResolvedValue({});

    const result = await getMemberByIdUseCase.execute(projectMemberId);

    expect(
      mockProjectMemberRepository.findProjectMemberById,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
