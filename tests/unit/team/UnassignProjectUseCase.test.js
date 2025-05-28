const UnassignProjectUseCase = require('../../../api/src/application/use-cases/team/UnassignProjectUseCase');
const {
  createTeamMember,
  createAnotherTeamMember,
  createProjectMember,
  createAnotherProjectMember,
} = require('../../fake-data/fake-entities');

describe('UnassignProjectUseCase', () => {
  let removeTeamMembersFromProject;
  let teamMembers;
  let projectMembers;
  let teamId;
  let projectId;

  let mockTeamRepository;
  let mockProjectMemberRepository;
  let unassignProjectUseCase;

  beforeEach(() => {
    removeTeamMembersFromProject = false;
    teamMembers = [createTeamMember(), createAnotherTeamMember()];
    projectMembers = [createProjectMember(), createAnotherProjectMember()];
    teamId = createTeamMember().teamId;
    projectId = createProjectMember().projectId;

    mockTeamRepository = {
      unassignProject: jest.fn().mockResolvedValue(1),
    };

    mockProjectMemberRepository = {
      delete: jest.fn().mockResolvedValue(1),
      transferOwnership: jest.fn().mockResolvedValue(1),
    };

    unassignProjectUseCase = new UnassignProjectUseCase({
      teamRepository: mockTeamRepository,
      projectMemberRepository: mockProjectMemberRepository,
    });
  });

  test('case 1: Unassign the project team without removing members. It should return a 1', async () => {
    const result = await unassignProjectUseCase.execute(
      removeTeamMembersFromProject,
      teamMembers,
      projectMembers,
      teamId,
      projectId,
    );

    expect(mockTeamRepository.unassignProject).toHaveBeenCalledWith(
      teamId,
      projectId,
    );
    expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
    expect(
      mockProjectMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
    expect(result).toBe(1);
  });

  test('case 2: It should return a 1 and [] because there are no team members in the project', async () => {
    removeTeamMembersFromProject = true;
    projectMembers = [];

    const result = await unassignProjectUseCase.execute(
      removeTeamMembersFromProject,
      teamMembers,
      projectMembers,
      teamId,
      projectId,
    );

    expect(mockTeamRepository.unassignProject).toHaveBeenCalledWith(
      teamId,
      projectId,
    );
    expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
    expect(
      mockProjectMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
    expect(result).toMatchObject({ unassignedProject: 1, removedMembers: [] });
  });

  test('case 3: It should return an error because the project only has as members the project members to be removed', async () => {
    removeTeamMembersFromProject = true;

    await expect(
      unassignProjectUseCase.execute(
        removeTeamMembersFromProject,
        teamMembers,
        projectMembers,
        teamId,
        projectId,
      ),
    ).rejects.toThrow(/all project members are part of the team/);

    expect(mockTeamRepository.unassignProject).not.toHaveBeenCalled();
    expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
    expect(
      mockProjectMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
  });

  test('case 4: The team member is the owner in the project. It should return a 1 and [1, 1] and transfer the ownership', async () => {
    removeTeamMembersFromProject = true;
    projectMembers.push(
      createAnotherProjectMember({
        userId: 'fake-userId',
        id: 'fake-id',
        role: 'admin',
        workspaceMemberId: 'fake-wmId',
      }),
    );

    const result = await unassignProjectUseCase.execute(
      removeTeamMembersFromProject,
      teamMembers,
      projectMembers,
      teamId,
      projectId,
    );

    expect(mockTeamRepository.unassignProject).toHaveBeenCalledTimes(1);
    expect(mockProjectMemberRepository.delete).toHaveBeenCalledTimes(2);
    expect(mockProjectMemberRepository.transferOwnership).toHaveBeenCalledTimes(
      1,
    );
    expect(mockProjectMemberRepository.transferOwnership).toHaveBeenCalledWith(
      projectId,
      projectMembers[0],
      projectMembers[2],
    );
    expect(result).toMatchObject({
      unassignedProject: 1,
      removedMembers: [1, 1],
    });
  });

  test('case 5: The team member is NOT the owner in the project. It should return a 1 and [1, 1] but not transfer the ownership', async () => {
    removeTeamMembersFromProject = true;
    projectMembers.push(
      createAnotherProjectMember({
        userId: 'fake-userId',
        id: 'fake-id',
        role: 'owner',
        workspaceMemberId: 'fake-wmId',
      }),
    );
    projectMembers[0].role = 'admin';

    const result = await unassignProjectUseCase.execute(
      removeTeamMembersFromProject,
      teamMembers,
      projectMembers,
      teamId,
      projectId,
    );

    expect(mockTeamRepository.unassignProject).toHaveBeenCalledTimes(1);
    expect(mockProjectMemberRepository.delete).toHaveBeenCalledTimes(2);
    expect(
      mockProjectMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      unassignedProject: 1,
      removedMembers: [1, 1],
    });
  });

  test('It should return an error because teamMembers is not an array', async () => {
    await expect(
      unassignProjectUseCase.execute(
        removeTeamMembersFromProject,
        {},
        projectMembers,
        teamId,
        projectId,
      ),
    ).rejects.toThrow(/is not an array/);

    expect(mockTeamRepository.unassignProject).not.toHaveBeenCalled();
    expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
    expect(
      mockProjectMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
  });

  test('It should return an error because projectMembers is not an array', async () => {
    await expect(
      unassignProjectUseCase.execute(
        removeTeamMembersFromProject,
        teamMembers,
        {},
        teamId,
        projectId,
      ),
    ).rejects.toThrow(/is not an array/);

    expect(mockTeamRepository.unassignProject).not.toHaveBeenCalled();
    expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
    expect(
      mockProjectMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
  });

  test('It should return an error because teamId was not provided', async () => {
    await expect(
      unassignProjectUseCase.execute(
        removeTeamMembersFromProject,
        teamMembers,
        projectMembers,
        null,
        projectId,
      ),
    ).rejects.toThrow(/was not provided/);

    expect(mockTeamRepository.unassignProject).not.toHaveBeenCalled();
    expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
    expect(
      mockProjectMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
  });

  test('It should return an error because projectId was not provided', async () => {
    await expect(
      unassignProjectUseCase.execute(
        removeTeamMembersFromProject,
        teamMembers,
        projectMembers,
        teamId,
        null,
      ),
    ).rejects.toThrow(/was not provided/);

    expect(mockTeamRepository.unassignProject).not.toHaveBeenCalled();
    expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
    expect(
      mockProjectMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
  });

  test('It should return an error because removeTeamMembersFromProject is not a boolean', async () => {
    await expect(
      unassignProjectUseCase.execute(
        'false',
        teamMembers,
        projectMembers,
        teamId,
        projectId,
      ),
    ).rejects.toThrow(/must be a boolean/);

    expect(mockTeamRepository.unassignProject).not.toHaveBeenCalled();
    expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
    expect(
      mockProjectMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
