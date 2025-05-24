const GetWorkspaceMembersWithDataUseCase = require('../../../api/src/application/use-cases/workspace-member/getWorkspaceMembersWithDataUseCase');
const WorkspaceMemberDto = require('../../../api/src/application/dtos/workspaceMember.dto');
const {
  createWorkspaceMember,
  createAnotherWorkspaceMember,
  createProject,
  createTeam,
} = require('../../fake-data/fake-entities');

describe('GetWorkspaceMembersWithDataUseCase', () => {
  let workspaceId;
  let workspaceMembers;
  let useCaseResponse;
  let mockWorkspaceMemberRepository;
  let getWorkspaceMembersWithDataUseCase;

  beforeEach(() => {
    workspaceId = createWorkspaceMember().workspaceId;
    workspaceMembers = [
      createWorkspaceMember({
        projects: [createProject()],
        teams: [createTeam()],
      }),
      createAnotherWorkspaceMember({ teams: [], projects: [createProject()] }),
      createAnotherWorkspaceMember({ name: 'Lolita' }),
    ];
    useCaseResponse = [...workspaceMembers];

    mockWorkspaceMemberRepository = {
      findAllWithData: jest.fn().mockResolvedValue(workspaceMembers),
    };

    getWorkspaceMembersWithDataUseCase = new GetWorkspaceMembersWithDataUseCase(
      {
        workspaceMemberRepository: mockWorkspaceMemberRepository,
      },
    );
  });

  test('It should return a list of workspace members', async () => {
    const result =
      await getWorkspaceMembersWithDataUseCase.execute(workspaceId);

    expect(mockWorkspaceMemberRepository.findAllWithData).toHaveBeenCalledWith(
      workspaceId,
    );
    expect(result).toMatchObject(
      useCaseResponse.map((wm) => WorkspaceMemberDto.withData(wm)),
    );
  });

  test('It should return an error because workspaceId was not provided', async () => {
    try {
      await getWorkspaceMembersWithDataUseCase.execute(undefined);

      expect(
        mockWorkspaceMemberRepository.findAllWithData,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty array because the findAllWithData operation to the db does not find anything', async () => {
    mockWorkspaceMemberRepository.findAllWithData.mockResolvedValue([]);

    const result =
      await getWorkspaceMembersWithDataUseCase.execute(workspaceId);

    expect(mockWorkspaceMemberRepository.findAllWithData).toHaveBeenCalledTimes(
      1,
    );
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
