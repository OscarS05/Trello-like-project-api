const UpdateWorkspaceUseCase = require('../../../api/src/application/use-cases/workspace/updateWorkspaceUseCase');
const { createWorkspace } = require('../../fake-data/fake-entities');

describe('UpdateWorkspaceUseCase', () => {
  let workspaceData;
  let updatedWorkspace;
  let mockWorkspaceRepository;
  let updateWorkspaceUseCase;

  beforeEach(() => {
    workspaceData = createWorkspace();
    delete workspaceData.createdAt;
    delete workspaceData.userId;

    updatedWorkspace = {
      ...createWorkspace(),
      name: 'GraphQL',
    };

    delete workspaceData.id;

    mockWorkspaceRepository = {
      update: jest.fn().mockResolvedValue([1, [updatedWorkspace]]),
    };

    updateWorkspaceUseCase = new UpdateWorkspaceUseCase({
      workspaceRepository: mockWorkspaceRepository,
    });
  });

  test('It should return a successfully updated workspace', async () => {
    const result = await updateWorkspaceUseCase.execute(
      updatedWorkspace.id,
      workspaceData,
    );

    expect(mockWorkspaceRepository.update).toHaveBeenCalledWith(
      updatedWorkspace.id,
      workspaceData,
    );
    expect(result).toMatchObject(updatedWorkspace);
  });

  test('It should return an error because workspaceId was not provided', async () => {
    try {
      await updateWorkspaceUseCase.execute(workspaceData.id, workspaceData);

      expect(mockWorkspaceRepository.update).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch('WorkspaceId was not provided');
    }
  });

  test('It should return an error because the provided name is not valid', async () => {
    try {
      await updateWorkspaceUseCase.execute(updatedWorkspace.id, {
        ...workspaceData,
        name: 'jo',
      });

      expect(mockWorkspaceRepository.update).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch('Invalid workspace name');
    }
  });

  test('It should return an error because the provided description is not valid', async () => {
    try {
      await updateWorkspaceUseCase.execute(updatedWorkspace.id, {
        ...workspaceData,
        description: 123,
      });

      expect(mockWorkspaceRepository.update).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch('Invalid workspace description');
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
