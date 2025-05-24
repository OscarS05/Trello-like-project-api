const TransferOwnershipUseCase = require('../../../api/src/application/use-cases/workspace-member/TransferOwnershipUseCase');
const {
  createWorkspaceMember,
  createAnotherWorkspaceMember,
} = require('../../fake-data/fake-entities');

describe('TransferOwnershipUseCase', () => {
  let currentOwner;
  let newOwner;
  let mockWorkspaceMemberRepository;
  let transferOwnershipUseCase;

  beforeEach(() => {
    currentOwner = createWorkspaceMember();
    newOwner = createAnotherWorkspaceMember();

    mockWorkspaceMemberRepository = {
      transferOwnership: jest.fn().mockResolvedValue([1]),
    };

    transferOwnershipUseCase = new TransferOwnershipUseCase({
      workspaceMemberRepository: mockWorkspaceMemberRepository,
    });
  });

  test('It should return a successful 1', async () => {
    const result = await transferOwnershipUseCase.execute(
      currentOwner,
      newOwner,
    );

    expect(
      mockWorkspaceMemberRepository.transferOwnership,
    ).toHaveBeenCalledWith(currentOwner, newOwner);
    expect(result).toBeGreaterThanOrEqual(1);
  });

  test('It should return an error because currentOwner was not provided', async () => {
    try {
      await transferOwnershipUseCase.execute({}, newOwner);

      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because newOwner was not provided', async () => {
    try {
      await transferOwnershipUseCase.execute(currentOwner, {});

      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because the newOwner does not belong to the workspace', async () => {
    newOwner.workspaceId = 'incorrect-uuid';
    try {
      await transferOwnershipUseCase.execute(currentOwner, newOwner);

      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/does not belong/);
    }
  });

  test('It should return an error because the newOwner being updated already has the newRole', async () => {
    newOwner = { ...currentOwner };
    try {
      await transferOwnershipUseCase.execute(currentOwner, newOwner);

      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/transfer the ownership to yourself/);
    }
  });

  test('It should return an error because the newOwner being updated already has the newRole', async () => {
    newOwner = { ...newOwner, role: 'owner' };
    try {
      await transferOwnershipUseCase.execute(currentOwner, newOwner);

      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/already has the owner role/);
    }
  });

  test('It should return an empty array because the transferOwnership operation to the db failed', async () => {
    mockWorkspaceMemberRepository.transferOwnership.mockResolvedValue([0]);
    try {
      await transferOwnershipUseCase.execute(currentOwner, newOwner);

      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).toHaveBeenCalledTimes(1);
    } catch (error) {
      expect(error.message).toMatch(/Something went wrong/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
