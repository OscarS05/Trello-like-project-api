const UpdateProjectUseCase = require('../../../api/src/application/use-cases/project/UpdateProjectUseCase');
const ProjectDto = require('../../../api/src/application/dtos/project.dto');
const { createProject } = require('../../fake-data/fake-entities');

describe('UpdateProjectUseCase', () => {
  let projectData;
  let updatedProject;
  let mockProjectRepository;
  let updateProjectUseCase;

  beforeEach(() => {
    projectData = createProject();

    updatedProject = {
      ...projectData,
      name: 'GraphQL',
    };

    mockProjectRepository = {
      update: jest.fn().mockResolvedValue([1, [updatedProject]]),
    };

    updateProjectUseCase = new UpdateProjectUseCase({
      projectRepository: mockProjectRepository,
    });
  });

  test('It should return a successfully updated workspace', async () => {
    const result = await updateProjectUseCase.execute(
      projectData.id,
      projectData,
    );

    expect(mockProjectRepository.update).toHaveBeenCalledWith(projectData.id, {
      name: projectData.name,
      visibility: projectData.visibility,
    });
    expect(result).toMatchObject(new ProjectDto(updatedProject));
  });

  test('It should return an error because projectId was not provided', async () => {
    try {
      await updateProjectUseCase.execute(undefined, projectData);

      expect(mockProjectRepository.update).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because the changes do not contain "name" or "visibility"', async () => {
    delete projectData.name;
    delete projectData.visibility;

    try {
      await updateProjectUseCase.execute(updatedProject.id, projectData);

      expect(mockProjectRepository.update).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/At least one/);
    }
  });

  test('It should return an error because the db operation failed', async () => {
    mockProjectRepository.update.mockResolvedValue([0, []]);

    try {
      await updateProjectUseCase.execute(updatedProject.id, projectData);

      expect(mockProjectRepository.update).toHaveBeenCalled(1);
    } catch (error) {
      expect(error.message).toMatch(/Something went wrong/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
