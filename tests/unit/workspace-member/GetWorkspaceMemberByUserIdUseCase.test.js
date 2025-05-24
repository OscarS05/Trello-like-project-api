const GetWorkspaceMemberByUserIdUseCase = require('../../../api/src/application/use-cases/workspace-member/getWorkspaceMemberByUserIdUseCase');
const { createWorkspaceMember } = require('../../fake-data/fake-entities');

describe('GetWorkspaceMemberByUserIdUseCase', () => {
  let workspaceId;
  let userId;
  let workspaceMember;
  let mockWorkspaceMemberRepository;
  let getWorkspaceMemberByUserIdUseCase;

  beforeEach(() => {
    workspaceId = createWorkspaceMember().workspaceId;
    userId = createWorkspaceMember().userId;
    workspaceMember = createWorkspaceMember();

    mockWorkspaceMemberRepository = {
      findWorkspaceMemberByUserId: jest.fn().mockResolvedValue(workspaceMember),
    };

    getWorkspaceMemberByUserIdUseCase = new GetWorkspaceMemberByUserIdUseCase({
      workspaceMemberRepository: mockWorkspaceMemberRepository,
    });
  });

  test('It should return a successful workspace member', async () => {
    const result = await getWorkspaceMemberByUserIdUseCase.execute(
      workspaceId,
      userId,
    );

    expect(
      mockWorkspaceMemberRepository.findWorkspaceMemberByUserId,
    ).toHaveBeenCalledWith(workspaceId, userId);
    expect(result).toMatchObject(workspaceMember);
  });

  test('It should return an error because workspaceId was not provided', async () => {
    try {
      await getWorkspaceMemberByUserIdUseCase.execute(undefined, userId);

      expect(
        mockWorkspaceMemberRepository.findWorkspaceMemberByUserId,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because userId was not provided', async () => {
    try {
      await getWorkspaceMemberByUserIdUseCase.execute(workspaceId, undefined);

      expect(
        mockWorkspaceMemberRepository.findWorkspaceMemberByUserId,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty object because the findWorkspaceMemberByUserId operation to the db does not find anything', async () => {
    mockWorkspaceMemberRepository.findWorkspaceMemberByUserId.mockResolvedValue(
      {},
    );

    const result = await getWorkspaceMemberByUserIdUseCase.execute(
      workspaceId,
      userId,
    );

    expect(
      mockWorkspaceMemberRepository.findWorkspaceMemberByUserId,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
