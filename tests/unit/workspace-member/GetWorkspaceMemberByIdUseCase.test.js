const GetWorkspaceMemberByIdUseCase = require('../../../api/src/application/use-cases/workspace-member/getWorkspaceMemberByIdUseCase');
const {
  createWorkspaceMember,
  createAnotherWorkspaceMember,
} = require('../../fake-data/fake-entities');

describe('GetWorkspaceMemberByIdUseCase', () => {
  let workspaceMemberId;
  let workspaceMember;
  let useCaseResponse;
  let mockWorkspaceMemberRepository;
  let getWorkspaceMemberByIdUseCase;

  beforeEach(() => {
    workspaceMemberId = createAnotherWorkspaceMember().id;
    workspaceMember = createWorkspaceMember();
    useCaseResponse = { ...workspaceMember, name: workspaceMember.user.name };
    delete useCaseResponse.addedAt;
    delete useCaseResponse.user;

    mockWorkspaceMemberRepository = {
      findWorkspaceMemberById: jest.fn().mockResolvedValue(workspaceMember),
    };

    getWorkspaceMemberByIdUseCase = new GetWorkspaceMemberByIdUseCase({
      workspaceMemberRepository: mockWorkspaceMemberRepository,
    });
  });

  test('It should return a successful workspace member', async () => {
    const result =
      await getWorkspaceMemberByIdUseCase.execute(workspaceMemberId);

    expect(
      mockWorkspaceMemberRepository.findWorkspaceMemberById,
    ).toHaveBeenCalledWith(workspaceMemberId);
    expect(result).toMatchObject(useCaseResponse);
  });

  test('It should return an error because workspaceMemberId was not provided', async () => {
    try {
      await getWorkspaceMemberByIdUseCase.execute(undefined);

      expect(
        mockWorkspaceMemberRepository.findWorkspaceMemberById,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty object because the findWorkspaceMemberById operation to the db does not find anything', async () => {
    mockWorkspaceMemberRepository.findWorkspaceMemberById.mockResolvedValue({});

    const result =
      await getWorkspaceMemberByIdUseCase.execute(workspaceMemberId);

    expect(
      mockWorkspaceMemberRepository.findWorkspaceMemberById,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
