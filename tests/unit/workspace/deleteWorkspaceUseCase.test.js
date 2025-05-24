const DeleteWorkspaceUseCase = require('../../../api/src/application/use-cases/workspace/deleteWorkspaceUseCase');
const { createWorkspace } = require('../../fake-data/fake-entities');

describe('DeleteWorkspaceUseCase', () => {
  let workspaceId;
  let mockWorkspaceRepository;
  let deleteWorkspaceUseCase;

  beforeEach(() => {
    workspaceId = createWorkspace().id;

    mockWorkspaceRepository = {
      delete: jest.fn().mockResolvedValue(1),
    };

    deleteWorkspaceUseCase = new DeleteWorkspaceUseCase({
      workspaceRepository: mockWorkspaceRepository,
    });
  });

  test('It should return a successful 1', async () => {
    const result = await deleteWorkspaceUseCase.execute(workspaceId);

    expect(mockWorkspaceRepository.delete).toHaveBeenCalledWith(workspaceId);
    expect(result).toBe(1);
  });

  test('It should return an error because workspaceId was not provided', async () => {
    try {
      await deleteWorkspaceUseCase.execute(undefined);

      expect(mockWorkspaceRepository.delete).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided./);
    }
  });

  test('It should return an error because the update to the db failed', async () => {
    mockWorkspaceRepository.delete.mockResolvedValue(0);
    try {
      await deleteWorkspaceUseCase.execute(workspaceId);

      expect(mockWorkspaceRepository.delete).toHaveBeenCalledWith(workspaceId);
    } catch (error) {
      expect(error.message).toMatch('Workspace not found');
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
