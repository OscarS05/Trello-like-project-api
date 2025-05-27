const TransferOwnershipUseCase = require('../../../api/src/application/use-cases/project-member/TransferOwnershipUseCase');
const {
  createProjectMember,
  createAnotherProjectMember,
} = require('../../fake-data/fake-entities');

describe('TransferOwnershipUseCase', () => {
  let projectId;
  let currentProjectOwner;
  let newProjectOwner;
  let mockWorkspaceMemberRepository;
  let transferOwnershipUseCase;

  beforeEach(() => {
    projectId = createProjectMember().projectId;
    currentProjectOwner = createProjectMember();
    newProjectOwner = createAnotherProjectMember();

    mockWorkspaceMemberRepository = {
      transferOwnership: jest.fn().mockResolvedValue(1),
    };

    transferOwnershipUseCase = new TransferOwnershipUseCase({
      projectMemberRepository: mockWorkspaceMemberRepository,
    });
  });

  test('It should return a successful 1', async () => {
    const result = await transferOwnershipUseCase.execute(
      projectId,
      currentProjectOwner,
      newProjectOwner,
    );

    expect(
      mockWorkspaceMemberRepository.transferOwnership,
    ).toHaveBeenCalledWith(projectId, currentProjectOwner, newProjectOwner);
    expect(result).toBeGreaterThanOrEqual(1);
  });

  test('It should return an error because currentProjectOwner was not provided', async () => {
    try {
      await transferOwnershipUseCase.execute(projectId, {}, newProjectOwner);
    } catch (error) {
      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because newProjectOwner was not provided', async () => {
    try {
      await transferOwnershipUseCase.execute(
        projectId,
        currentProjectOwner,
        {},
      );
    } catch (error) {
      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because the newProjectOwner does not belong to the workspace', async () => {
    newProjectOwner.workspaceId = 'incorrect-uuid';
    try {
      await transferOwnershipUseCase.execute(
        projectId,
        currentProjectOwner,
        newProjectOwner,
      );
    } catch (error) {
      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch(/does not belong/);
    }
  });

  test('It should return an error because the newProjectOwner does not belong to the workspace', async () => {
    currentProjectOwner.workspaceId = 'incorrect-uuid';
    try {
      await transferOwnershipUseCase.execute(
        projectId,
        currentProjectOwner,
        newProjectOwner,
      );
    } catch (error) {
      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch(/new project owner|does not belong/);
    }
  });

  test('It should return an error because the newProjectOwner being updated already has the newRole', async () => {
    newProjectOwner.role = 'owner';
    try {
      await transferOwnershipUseCase.execute(
        projectId,
        currentProjectOwner,
        newProjectOwner,
      );
    } catch (error) {
      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch(/ already has the owner role/);
    }
  });

  test('It should return an error because the currentOwner and the newOwner are the same person', async () => {
    newProjectOwner.id = currentProjectOwner.id;

    try {
      await transferOwnershipUseCase.execute(
        projectId,
        currentProjectOwner,
        newProjectOwner,
      );

      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/to yourself/);
    }
  });

  test('It should return an error because projectId was not provided', async () => {
    try {
      await transferOwnershipUseCase.execute(
        null,
        currentProjectOwner,
        newProjectOwner,
      );

      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because currentOwner has not the owner role', async () => {
    currentProjectOwner.role = 'admin';

    try {
      await transferOwnershipUseCase.execute(
        projectId,
        currentProjectOwner,
        newProjectOwner,
      );

      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/is not the owner of the project/);
    }
  });

  test('It should return an error because the db operation failed', async () => {
    mockWorkspaceMemberRepository.transferOwnership.mockResolvedValue(
      new Error('Something went wrong'),
    );
    try {
      await transferOwnershipUseCase.execute(
        projectId,
        currentProjectOwner,
        newProjectOwner,
      );
    } catch (error) {
      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).toHaveBeenCalledTimes(1);
      expect(error.message).toMatch(/Something went wrong/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
