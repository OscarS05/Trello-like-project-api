const CountWorkspacesByUserUseCase = require('../../../api/src/application/use-cases/workspace/countWorkspacesByUserUseCase');
const { createUser } = require('../../fake-data/fake-entities');

describe('CountWorkspacesByUserUseCase', () => {
  let userData;
  let mockWorkspaceRepository;
  let countWorkspacesByUserUseCase;

  beforeEach(() => {
    userData = createUser();

    mockWorkspaceRepository = {
      countWorkspacesByUser: jest.fn(),
    };

    countWorkspacesByUserUseCase = new CountWorkspacesByUserUseCase({
      workspaceRepository: mockWorkspaceRepository,
    });
  });

  test('It should return a count of workspaces successfully', async () => {
    mockWorkspaceRepository.countWorkspacesByUser.mockResolvedValue(3);

    const result = await countWorkspacesByUserUseCase.execute(userData.id);

    expect(mockWorkspaceRepository.countWorkspacesByUser).toHaveBeenCalledWith(
      userData.id,
    );

    expect(result).toEqual(3);
  });

  test('It should return an error because userId was not provided', async () => {
    try {
      await countWorkspacesByUserUseCase.execute(undefined);

      expect(
        mockWorkspaceRepository.countWorkspacesByUser,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(
        /UserId was not provided to count workspaces/,
      );
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
