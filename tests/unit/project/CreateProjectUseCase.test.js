jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuidv4 } = require('uuid');

const CreateProjectUseCase = require('../../../api/src/application/use-cases/project/CreateProjectUseCase');
const ProjectDto = require('../../../api/src/application/dtos/project.dto');
const { createProject } = require('../../fake-data/fake-entities');

describe('CreateProjectUseCase', () => {
  let projectData;
  let createdProject;
  let mockProjectRepository;
  let createProjectUseCase;

  beforeEach(() => {
    createdProject = createProject();
    uuidv4.mockReturnValue(createdProject.id);
    projectData = { ...createdProject };

    mockProjectRepository = {
      create: jest.fn().mockResolvedValue(createdProject),
    };

    createProjectUseCase = new CreateProjectUseCase({
      projectRepository: mockProjectRepository,
    });
  });

  test('It should return a successfully created project', async () => {
    const result = await createProjectUseCase.execute(projectData);

    expect(uuidv4).toHaveBeenCalledTimes(2);
    expect(mockProjectRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new ProjectDto(createdProject));
  });

  test('It should return an error because workspaceId was not provided', async () => {
    try {
      await createProjectUseCase.execute({
        ...projectData,
        workspaceId: undefined,
      });

      expect(mockProjectRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because workspaceMemberId was not provided', async () => {
    try {
      await createProjectUseCase.execute({
        ...projectData,
        workspaceMemberId: undefined,
      });

      expect(mockProjectRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because the provided name is not valid', async () => {
    try {
      await createProjectUseCase.execute({
        ...projectData,
        name: ' ja     ',
      });

      expect(mockProjectRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/must be between 3 and 50 characters/);
    }
  });

  test('It should return an error because the provided name is a number', async () => {
    try {
      await createProjectUseCase.execute({
        ...projectData,
        name: 123,
      });

      expect(mockProjectRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/must be a non-empty string/);
    }
  });

  test('It should return an error because the provided visibility is not valid', async () => {
    try {
      await createProjectUseCase.execute({
        ...projectData,
        visibility: 'Public', // Is not a valid visibility. Only 'private' or 'workspace' are valid.
      });

      expect(mockProjectRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/Invalid visibility value/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
