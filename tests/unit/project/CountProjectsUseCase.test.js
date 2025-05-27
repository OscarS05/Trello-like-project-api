const CountProjectsUseCase = require('../../../api/src/application/use-cases/project/CountProjectsUseCase');
const { createWorkspaceMember } = require('../../fake-data/fake-entities');

describe('CountProjectsUseCase', () => {
  let workspaceMemberId;
  let mockProjectRepository;
  let countProjectsUseCase;

  beforeEach(() => {
    workspaceMemberId = createWorkspaceMember().id;

    mockProjectRepository = {
      countProjects: jest.fn().mockResolvedValue(3),
    };

    countProjectsUseCase = new CountProjectsUseCase({
      projectRepository: mockProjectRepository,
    });
  });

  test('It should return a count of projects successfully', async () => {
    const result = await countProjectsUseCase.execute(workspaceMemberId);

    expect(mockProjectRepository.countProjects).toHaveBeenCalledWith(
      workspaceMemberId,
    );

    expect(result).toEqual(3);
  });

  test('It should return an error because workspaceMemberId was not provided', async () => {
    try {
      await countProjectsUseCase.execute(undefined);

      expect(mockProjectRepository.countProjects).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
