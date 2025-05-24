const RemoveWorkspaceMemberUseCase = require('../../../api/src/application/use-cases/workspace-member/RemoveWorkspaceMemberUseCase');
const {
  createWorkspaceMember,
  createAnotherWorkspaceMember,
  createProject,
  createTeam,
  createProjectMember,
  createAnotherProjectMember,
  createTeamMember,
  createAnotherTeamMember,
} = require('../../fake-data/fake-entities');

describe('RemoveWorkspaceMemberUseCase', () => {
  let requesterAsWorkspaceMember;
  let workspaceMemberToBeRemoved;
  let workspaceMembers;
  let projectsOfMemberToBeRemoved;
  let teamsOfMemberToBeRemoved;
  let projectsOfMemberToBeRemovedWithRolesChanged;
  let teamsOfMemberToBeRemovedWithRolesChanged;
  let soloProjectsOfMemberToBeRemovedWithRolesChanged;
  let soloTeamsOfMemberToBeRemovedWithRolesChanged;

  let mockWorkspaceMemberRepository;
  let mockProjectMemberRepository;
  let mockWorkspaceRepository;
  let mockTeamMemberRepository;
  let removeWorkspaceMemberUseCase;

  beforeEach(() => {
    requesterAsWorkspaceMember = createWorkspaceMember();
    workspaceMemberToBeRemoved = createAnotherWorkspaceMember();
    workspaceMembers = [
      createWorkspaceMember(),
      createAnotherWorkspaceMember(),
    ];
    projectsOfMemberToBeRemoved = [
      createProject({
        projectMembers: [createProjectMember(), createAnotherProjectMember()],
      }),
      createProject({
        projectMembers: [createProjectMember(), createAnotherProjectMember()],
      }),
    ];
    teamsOfMemberToBeRemoved = [
      createTeam({
        members: [createTeamMember(), createAnotherTeamMember()],
      }),
      createTeam({
        members: [createTeamMember(), createAnotherTeamMember()],
      }),
    ];

    projectsOfMemberToBeRemovedWithRolesChanged = [
      createProject({
        userId: createAnotherProjectMember().userId,
        workspaceMemberId: createAnotherProjectMember().workspaceMemberId,
        projectMembers: [
          createProjectMember({ role: 'admin' }),
          createAnotherProjectMember({ role: 'owner' }),
        ],
      }),
      createProject({
        userId: createAnotherProjectMember().userId,
        workspaceMemberId: createAnotherProjectMember().workspaceMemberId,
        projectMembers: [
          createProjectMember({ role: 'admin' }),
          createAnotherProjectMember({ role: 'owner' }),
        ],
      }),
    ];
    teamsOfMemberToBeRemovedWithRolesChanged = [
      createTeam({
        userId: createAnotherTeamMember().userId,
        workspaceMemberId: createAnotherTeamMember().workspaceMemberId,
        members: [
          createTeamMember({ role: 'admin' }),
          createAnotherTeamMember({ role: 'owner' }),
        ],
      }),
      createTeam({
        userId: createAnotherTeamMember().userId,
        workspaceMemberId: createAnotherTeamMember().workspaceMemberId,
        members: [
          createTeamMember({ role: 'admin' }),
          createAnotherTeamMember({ role: 'owner' }),
        ],
      }),
    ];

    soloProjectsOfMemberToBeRemovedWithRolesChanged = [
      createProject({
        userId: createAnotherProjectMember().userId,
        workspaceMemberId: createAnotherProjectMember().workspaceMemberId,
        projectMembers: [createAnotherProjectMember({ role: 'owner' })],
      }),
    ];
    soloTeamsOfMemberToBeRemovedWithRolesChanged = [
      createTeam({
        userId: createAnotherTeamMember().userId,
        workspaceMemberId: createAnotherTeamMember().workspaceMemberId,
        members: [createAnotherTeamMember({ role: 'owner' })],
      }),
    ];

    // Mocks
    mockWorkspaceMemberRepository = {
      delete: jest.fn().mockResolvedValue(1),
      transferOwnership: jest.fn().mockResolvedValue(1),
    };

    mockProjectMemberRepository = {
      transferOwnership: jest.fn().mockResolvedValue(1),
    };

    mockWorkspaceRepository = {
      delete: jest.fn().mockResolvedValue(1),
    };

    mockTeamMemberRepository = {
      transferOwnership: jest.fn().mockResolvedValue(1),
    };

    removeWorkspaceMemberUseCase = new RemoveWorkspaceMemberUseCase({
      workspaceMemberRepository: mockWorkspaceMemberRepository,
      projectMemberRepository: mockProjectMemberRepository,
      workspaceRepository: mockWorkspaceRepository,
      teamMemberRepository: mockTeamMemberRepository,
    });
  });

  test('case 1: Member to be removed is NOT the owner of the workspace, projects and teams, each with members. It should correctly return a 1', async () => {
    const result = await removeWorkspaceMemberUseCase.execute(
      requesterAsWorkspaceMember,
      workspaceMemberToBeRemoved,
      workspaceMembers,
      projectsOfMemberToBeRemoved,
      teamsOfMemberToBeRemoved,
    );

    expect(mockTeamMemberRepository.transferOwnership).not.toHaveBeenCalled();
    expect(
      mockProjectMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
    expect(mockWorkspaceRepository.delete).not.toHaveBeenCalled();
    expect(
      mockWorkspaceMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
    expect(mockWorkspaceMemberRepository.delete).toHaveBeenCalledWith(
      workspaceMemberToBeRemoved.id,
    );

    expect(result).toBe(1);
  });

  test('case 2: The owner wants to leave the workspace. This is also the owner of projects and teams, each with its members. It should correctly return a 1', async () => {
    workspaceMemberToBeRemoved = createWorkspaceMember();

    const result = await removeWorkspaceMemberUseCase.execute(
      requesterAsWorkspaceMember,
      workspaceMemberToBeRemoved,
      workspaceMembers,
      projectsOfMemberToBeRemoved,
      teamsOfMemberToBeRemoved,
    );

    expect(mockTeamMemberRepository.transferOwnership).toHaveBeenCalledTimes(2);
    expect(mockProjectMemberRepository.transferOwnership).toHaveBeenCalledTimes(
      2,
    );
    expect(mockWorkspaceRepository.delete).not.toHaveBeenCalled();
    expect(
      mockWorkspaceMemberRepository.transferOwnership,
    ).toHaveBeenCalledTimes(1);
    expect(mockWorkspaceMemberRepository.delete).toHaveBeenCalledWith(
      workspaceMemberToBeRemoved.id,
    );

    expect(result).toBe(1);
  });

  test('case 3: The owner wants to leave the workspace. This is the owner of projects but not of the teams, each with its members. It should correctly return a 1', async () => {
    workspaceMemberToBeRemoved = createWorkspaceMember();

    const result = await removeWorkspaceMemberUseCase.execute(
      requesterAsWorkspaceMember,
      workspaceMemberToBeRemoved,
      workspaceMembers,
      projectsOfMemberToBeRemoved,
      teamsOfMemberToBeRemovedWithRolesChanged,
    );

    expect(mockTeamMemberRepository.transferOwnership).toHaveBeenCalledTimes(0);
    expect(mockProjectMemberRepository.transferOwnership).toHaveBeenCalledTimes(
      2,
    );
    expect(mockWorkspaceRepository.delete).not.toHaveBeenCalled();
    expect(
      mockWorkspaceMemberRepository.transferOwnership,
    ).toHaveBeenCalledTimes(1);
    expect(mockWorkspaceMemberRepository.delete).toHaveBeenCalledWith(
      workspaceMemberToBeRemoved.id,
    );

    expect(result).toBe(1);
  });

  test('case 4: The owner wants to leave the workspace. This is the owner of teams but not of the projects, each with its members. It should correctly return a 1', async () => {
    workspaceMemberToBeRemoved = createWorkspaceMember();

    const result = await removeWorkspaceMemberUseCase.execute(
      requesterAsWorkspaceMember,
      workspaceMemberToBeRemoved,
      workspaceMembers,
      projectsOfMemberToBeRemovedWithRolesChanged,
      teamsOfMemberToBeRemoved,
    );

    expect(mockTeamMemberRepository.transferOwnership).toHaveBeenCalledTimes(2);
    expect(mockProjectMemberRepository.transferOwnership).toHaveBeenCalledTimes(
      0,
    );
    expect(mockWorkspaceRepository.delete).not.toHaveBeenCalled();
    expect(
      mockWorkspaceMemberRepository.transferOwnership,
    ).toHaveBeenCalledTimes(1);
    expect(mockWorkspaceMemberRepository.delete).toHaveBeenCalledWith(
      workspaceMemberToBeRemoved.id,
    );

    expect(result).toBe(1);
  });

  test('case 5: The owner wants to leave the workspace. This is NOT the owner of teams and projects, each with its members. It should correctly return a 1', async () => {
    workspaceMemberToBeRemoved = createWorkspaceMember();

    const result = await removeWorkspaceMemberUseCase.execute(
      requesterAsWorkspaceMember,
      workspaceMemberToBeRemoved,
      workspaceMembers,
      projectsOfMemberToBeRemovedWithRolesChanged,
      teamsOfMemberToBeRemovedWithRolesChanged,
    );

    expect(mockTeamMemberRepository.transferOwnership).toHaveBeenCalledTimes(0);
    expect(mockProjectMemberRepository.transferOwnership).toHaveBeenCalledTimes(
      0,
    );
    expect(mockWorkspaceRepository.delete).not.toHaveBeenCalled();
    expect(
      mockWorkspaceMemberRepository.transferOwnership,
    ).toHaveBeenCalledTimes(1);
    expect(mockWorkspaceMemberRepository.delete).toHaveBeenCalledWith(
      workspaceMemberToBeRemoved.id,
    );

    expect(result).toBe(1);
  });

  test('case 6: Member to be removed is NOT the owner of the workspace but IS the owner of teams and projects, each with its members. It should correctly return a 1', async () => {
    const result = await removeWorkspaceMemberUseCase.execute(
      requesterAsWorkspaceMember,
      workspaceMemberToBeRemoved,
      workspaceMembers,
      projectsOfMemberToBeRemovedWithRolesChanged,
      teamsOfMemberToBeRemovedWithRolesChanged,
    );

    expect(mockTeamMemberRepository.transferOwnership).toHaveBeenCalledTimes(2);
    expect(mockProjectMemberRepository.transferOwnership).toHaveBeenCalledTimes(
      2,
    );
    expect(mockWorkspaceRepository.delete).not.toHaveBeenCalled();
    expect(
      mockWorkspaceMemberRepository.transferOwnership,
    ).toHaveBeenCalledTimes(0);
    expect(mockWorkspaceMemberRepository.delete).toHaveBeenCalledWith(
      workspaceMemberToBeRemoved.id,
    );

    expect(result).toBe(1);
  });

  test('case 7: Member to be removed is NOT the owner of the workspace but IS the owner of teams and projects, each without members. It should return an error', async () => {
    try {
      await removeWorkspaceMemberUseCase.execute(
        requesterAsWorkspaceMember,
        workspaceMemberToBeRemoved,
        workspaceMembers,
        soloProjectsOfMemberToBeRemovedWithRolesChanged,
        soloTeamsOfMemberToBeRemovedWithRolesChanged,
      );

      expect(mockTeamMemberRepository.transferOwnership).not.toHaveBeenCalled();
      expect(
        mockProjectMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
      expect(mockWorkspaceRepository.delete).not.toHaveBeenCalled();
      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
      expect(mockWorkspaceMemberRepository.delete).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/You must assign/);
    }
  });

  test('case 8: Member with member role want to leave of the wkpc and does not belong in projects or tems. It should return a 1', async () => {
    requesterAsWorkspaceMember = createAnotherWorkspaceMember();
    workspaceMemberToBeRemoved = requesterAsWorkspaceMember;
    const result = await removeWorkspaceMemberUseCase.execute(
      requesterAsWorkspaceMember,
      workspaceMemberToBeRemoved,
      workspaceMembers,
      [],
      [],
    );

    expect(mockTeamMemberRepository.transferOwnership).not.toHaveBeenCalled();
    expect(
      mockProjectMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
    expect(mockWorkspaceRepository.delete).not.toHaveBeenCalled();
    expect(
      mockWorkspaceMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
    expect(mockWorkspaceMemberRepository.delete).toHaveBeenCalledTimes(1);
    expect(result).toBe(1);
  });

  test('It should return an error because requesterAsWorkspaceMember was not provided', async () => {
    workspaceMemberToBeRemoved = createWorkspaceMember();
    try {
      await removeWorkspaceMemberUseCase.execute(
        {},
        workspaceMemberToBeRemoved,
        workspaceMembers,
        projectsOfMemberToBeRemoved,
        teamsOfMemberToBeRemoved,
      );

      expect(mockWorkspaceMemberRepository.delete).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because workspaceMemberToBeRemoved was not provided', async () => {
    workspaceMemberToBeRemoved = createWorkspaceMember();
    try {
      await removeWorkspaceMemberUseCase.execute(
        requesterAsWorkspaceMember,
        {},
        workspaceMembers,
        projectsOfMemberToBeRemoved,
        teamsOfMemberToBeRemoved,
      );

      expect(mockWorkspaceMemberRepository.delete).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because workspaceMembers was not provided', async () => {
    workspaceMemberToBeRemoved = createWorkspaceMember();
    try {
      await removeWorkspaceMemberUseCase.execute(
        requesterAsWorkspaceMember,
        workspaceMemberToBeRemoved,
        [],
        projectsOfMemberToBeRemoved,
        teamsOfMemberToBeRemoved,
      );

      expect(mockWorkspaceMemberRepository.delete).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided|there are not members/);
    }
  });

  test('It should return an error because projectsOfMemberToBeRemoved was not provided', async () => {
    workspaceMemberToBeRemoved = createWorkspaceMember();
    try {
      await removeWorkspaceMemberUseCase.execute(
        requesterAsWorkspaceMember,
        workspaceMemberToBeRemoved,
        workspaceMembers,
        undefined,
        teamsOfMemberToBeRemoved,
      );

      expect(mockWorkspaceMemberRepository.delete).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because teamsOfMemberToBeRemoved was not provided', async () => {
    workspaceMemberToBeRemoved = createWorkspaceMember();
    try {
      await removeWorkspaceMemberUseCase.execute(
        requesterAsWorkspaceMember,
        workspaceMemberToBeRemoved,
        workspaceMembers,
        projectsOfMemberToBeRemoved,
        undefined,
      );

      expect(mockWorkspaceMemberRepository.delete).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because workspaceMemberToBeRemoved does not belong to the workspace', async () => {
    workspaceMemberToBeRemoved = {
      ...createWorkspaceMember(),
      workspaceId: 'incorrect-id',
    };
    try {
      await removeWorkspaceMemberUseCase.execute(
        requesterAsWorkspaceMember,
        workspaceMemberToBeRemoved,
        workspaceMembers,
        projectsOfMemberToBeRemoved,
        teamsOfMemberToBeRemoved,
      );

      expect(mockWorkspaceMemberRepository.delete).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/does not belong/);
    }
  });

  test('It should return an error because requester with admin role cannot remove the owner', async () => {
    requesterAsWorkspaceMember.role = 'admin';
    workspaceMemberToBeRemoved.role = 'owner';
    try {
      await removeWorkspaceMemberUseCase.execute(
        requesterAsWorkspaceMember,
        workspaceMemberToBeRemoved,
        workspaceMembers,
        projectsOfMemberToBeRemoved,
        teamsOfMemberToBeRemoved,
      );

      expect(mockWorkspaceMemberRepository.delete).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/cannot remove the owner/);
    }
  });

  test('It should return an error because requester cannot remove members with the member role', async () => {
    requesterAsWorkspaceMember.role = 'member';
    workspaceMemberToBeRemoved.role = 'member';
    try {
      await removeWorkspaceMemberUseCase.execute(
        requesterAsWorkspaceMember,
        workspaceMemberToBeRemoved,
        workspaceMembers,
        projectsOfMemberToBeRemoved,
        teamsOfMemberToBeRemoved,
      );

      expect(mockWorkspaceMemberRepository.delete).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/cannot remove another member/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
