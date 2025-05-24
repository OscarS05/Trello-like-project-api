/* eslint-disable no-param-reassign */
const GetWorkspaceMembersUseCase = require('../../../api/src/application/use-cases/workspace-member/GetWorkspaceMembersUseCase');
const WorkspaceMemberDto = require('../../../api/src/application/dtos/workspaceMember.dto');
const {
  createWorkspaceMember,
  createAnotherWorkspaceMember,
} = require('../../fake-data/fake-entities');

describe('GetWorkspaceMembersUseCase', () => {
  let workspaceId;
  let workspaceMembers;
  let useCaseResponse;
  let mockWorkspaceMemberRepository;
  let getWorkspaceMembersUseCase;

  beforeEach(() => {
    workspaceId = createWorkspaceMember().workspaceId;
    workspaceMembers = [
      createWorkspaceMember(),
      createAnotherWorkspaceMember(),
    ];
    useCaseResponse = [...workspaceMembers];

    mockWorkspaceMemberRepository = {
      findAll: jest.fn().mockResolvedValue(workspaceMembers),
    };

    getWorkspaceMembersUseCase = new GetWorkspaceMembersUseCase({
      workspaceMemberRepository: mockWorkspaceMemberRepository,
    });
  });

  test('It should return a list of workspace members', async () => {
    const result = await getWorkspaceMembersUseCase.execute(workspaceId);

    expect(mockWorkspaceMemberRepository.findAll).toHaveBeenCalledWith(
      workspaceId,
    );
    expect(result).toMatchObject(
      useCaseResponse.map((wm) => new WorkspaceMemberDto(wm)),
    );
  });

  test('It should return an error because workspaceId was not provided', async () => {
    try {
      await getWorkspaceMembersUseCase.execute(undefined);

      expect(mockWorkspaceMemberRepository.findAll).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty array because the findAll operation to the db does not find anything', async () => {
    mockWorkspaceMemberRepository.findAll.mockResolvedValue([]);

    const result = await getWorkspaceMembersUseCase.execute(workspaceId);

    expect(mockWorkspaceMemberRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
