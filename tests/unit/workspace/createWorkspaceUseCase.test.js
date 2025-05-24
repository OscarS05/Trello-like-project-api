jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuidv4 } = require('uuid');

const CreateWorkspaceUseCase = require('../../../api/src/application/use-cases/workspace/createWorkspaceUseCase');
const { createWorkspace } = require('../../fake-data/fake-entities');

describe('CreateWorkspaceUseCase', () => {
  let createdWorkspace;
  let workspaceData;
  let mockWorkspaceRepository;
  let createWorkspaceUseCase;

  beforeEach(() => {
    createdWorkspace = createWorkspace();
    uuidv4.mockReturnValue(createdWorkspace.id);
    workspaceData = { ...createdWorkspace };
    delete workspaceData.id;

    mockWorkspaceRepository = {
      create: jest.fn().mockResolvedValue({ workspace: createdWorkspace }),
    };

    createWorkspaceUseCase = new CreateWorkspaceUseCase({
      workspaceRepository: mockWorkspaceRepository,
    });
  });

  test('It should return a successfully created workspace', async () => {
    const result = await createWorkspaceUseCase.execute(workspaceData);

    expect(uuidv4).toHaveBeenCalledTimes(1);
    expect(mockWorkspaceRepository.create).toHaveBeenCalledWith(
      expect.objectContaining(createdWorkspace),
    );
    expect(result).toMatchObject(createdWorkspace);
  });

  test('It should return an error because userId was not provided', async () => {
    try {
      await createWorkspaceUseCase.execute({
        ...workspaceData,
        userId: undefined,
      });

      expect(mockWorkspaceRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/UserId was not provided/);
    }
  });

  test('It should return an error because the provided name is not valid', async () => {
    try {
      await createWorkspaceUseCase.execute({
        ...workspaceData,
        name: 'ja',
      });

      expect(mockWorkspaceRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch('Invalid workspace name');
    }
  });

  test('It should return an error because the provided description is not valid', async () => {
    try {
      await createWorkspaceUseCase.execute({
        ...workspaceData,
        description: 123,
      });

      expect(mockWorkspaceRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch('Invalid workspace description');
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
