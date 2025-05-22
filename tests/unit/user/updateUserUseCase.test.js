const UpdateUserUseCase = require('../../../api/src/application/use-cases/user/updateUserUseCase');

const mockFindById = jest.fn();
const mockUpdateUser = jest.fn();

describe('updateUserUseCase', () => {
  let userData;
  let userUpdated;
  let changes;
  let updateUserUseCase;
  let mockUserRepository;

  beforeEach(() => {
    userData = {
      id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
      email: 'John@email.com',
      name: 'John Doe',
      role: 'basic',
      isVerified: false,
      createdAt: new Date(),
    };

    changes = {
      role: 'premium',
      isVerified: true,
    };

    userUpdated = {
      ...userData,
      ...changes,
    };

    mockUserRepository = {
      findById: mockFindById,
      update: mockUpdateUser,
    };

    updateUserUseCase = new UpdateUserUseCase({
      userRepository: mockUserRepository,
    });
    jest.clearAllMocks();
  });

  test('should update a user', async () => {
    mockUserRepository.findById.mockResolvedValue(userData);
    mockUserRepository.update.mockResolvedValue(userUpdated);

    const result = await updateUserUseCase.execute(userData.id, changes);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userData.id);
    expect(mockUserRepository.update).toHaveBeenCalledWith(
      userUpdated.id,
      expect.objectContaining(changes),
    );
    expect(result.role).toEqual(userUpdated.role);
    expect(result.isVerified).toEqual(userUpdated.isVerified);
  });

  test('should not update a user by user not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(updateUserUseCase.execute('bad-id', changes)).rejects.toThrow(
      'User not found',
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith('bad-id');
  });
});
