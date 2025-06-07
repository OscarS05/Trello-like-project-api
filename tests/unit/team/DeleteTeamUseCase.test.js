const DeleteTeamUseCase = require('../../../api/src/application/use-cases/team/DeleteTeamUseCase');
const {
  createTeam,
  createProjectMember,
  createAnotherProjectMember,
} = require('../../fake-data/fake-entities');

describe('DeleteTeamUseCase', () => {
  let teamId;
  let projectMembersInTeam;
  let mockTeamRepository;
  let mockProjectMemberRepository;
  let deleteTeamUseCase;

  beforeEach(() => {
    teamId = createTeam().id;
    projectMembersInTeam = [
      createProjectMember(),
      createAnotherProjectMember(),
    ];

    mockTeamRepository = {
      delete: jest.fn().mockResolvedValue(1),
    };

    mockProjectMemberRepository = {
      bulkDelete: jest.fn().mockResolvedValue(2),
    };

    deleteTeamUseCase = new DeleteTeamUseCase({
      teamRepository: mockTeamRepository,
      projectMemberRepository: mockProjectMemberRepository,
    });
  });

  test('It should return a 1', async () => {
    const { teamDeleted, teamMembersDeletedFromProjects } =
      await deleteTeamUseCase.execute(teamId, projectMembersInTeam);

    expect(mockTeamRepository.delete).toHaveBeenCalledWith(teamId);
    expect(mockProjectMemberRepository.bulkDelete).toHaveBeenCalledTimes(1);
    expect(teamDeleted).toBe(1);
    expect(teamMembersDeletedFromProjects).toEqual(2);
  });

  test('It should return an error because teamId was not provided', async () => {
    try {
      await deleteTeamUseCase.execute(null, projectMembersInTeam);

      expect(mockTeamRepository.delete).not.toHaveBeenCalled();
      expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because projectMembersInTeam was not provided', async () => {
    try {
      await deleteTeamUseCase.execute(teamId, {});

      expect(mockTeamRepository.delete).not.toHaveBeenCalled();
      expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/is not an array/);
    }
  });

  test('It should return an error because the delete team operation failed', async () => {
    mockTeamRepository.delete.mockResolvedValue(0);

    try {
      await deleteTeamUseCase.execute(teamId, projectMembersInTeam);

      expect(mockTeamRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/Something went wrong|deleted zero rows/);
    }
  });

  test('It should return an error because the delete project members failed', async () => {
    mockProjectMemberRepository.bulkDelete.mockResolvedValueOnce(
      new Error('Something went wrong'),
    );

    try {
      await deleteTeamUseCase.execute(teamId, projectMembersInTeam);
    } catch (error) {
      expect(mockTeamRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockProjectMemberRepository.bulkDelete).toHaveBeenCalledTimes(2);
      expect(error.message).toMatch(/Something went wrong/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
