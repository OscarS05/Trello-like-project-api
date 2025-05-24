const DeleteAccountUseCase = require('../../../api/src/application/use-cases/user/DeleteAccountUseCase');
const {
  createUserWithWorkspaces,
} = require('../../fake-data/fake-composite-entities');
const {
  createUser,
  createWorkspaceMember,
  createAnotherWorkspaceMember,
  createWorkspace,
  createProject,
  createProjectMember,
  createAnotherProjectMember,
  createTeam,
  createTeamMember,
  createAnotherTeamMember,
} = require('../../fake-data/fake-entities');

describe('deleteAccountUseCase', () => {
  let userData;
  let workspaceData;
  let workspaceMemberData;
  let anotherWorkspaceMemberData;
  let userWorkspacesWithOneMember;
  let userWorkspacesWithMembers;
  let userWorkspacesWithoutProjectsAndTeams;
  let projectData;
  let projectMemberData;
  let anotherProjectMemberData;
  let teamData;
  let teamMemberData;
  let anotherTeamMemberData;
  let userProjectsWithOneMember;
  let userProjectsWithMembers;
  let userTeamsWithOneMember;
  let userTeamsWithMembers;

  let userWorkspacesAsAdmin;
  let userWithManyWorkspaces;
  let userWithMixInHisRoles;
  let userWithSoloTeams;

  let deleteAccountUseCase;
  let mockUserRepository;
  let mockWorkspaceRepository;
  let mockWorkspaceMemberRepository;
  let mockTeamMemberRepository;
  let mockProjectMemberRepository;

  beforeEach(() => {
    // DATA
    userData = createUser();
    workspaceData = createWorkspace();
    workspaceMemberData = createWorkspaceMember();
    anotherWorkspaceMemberData = createAnotherWorkspaceMember();
    userWorkspacesWithOneMember = createUserWithWorkspaces({
      includeProjects: false,
      includeTeams: false,
      includeOtherWorkspaceMembers: false,
    });
    userWorkspacesWithMembers = createUserWithWorkspaces();
    userWorkspacesWithoutProjectsAndTeams = createUserWithWorkspaces({
      includeProjects: false,
      includeTeams: false,
    });
    projectData = createProject();
    projectMemberData = createProjectMember();
    anotherProjectMemberData = createAnotherProjectMember();
    teamData = createTeam();
    teamMemberData = createTeamMember();
    anotherTeamMemberData = createAnotherTeamMember();
    userProjectsWithOneMember = createUserWithWorkspaces({
      includeProjects: true,
      includeTeams: false,
      includeOtherProjectMembers: false,
    });
    userProjectsWithMembers = createUserWithWorkspaces({
      includeProjects: true,
      includeTeams: false,
      includeOtherProjectMembers: true,
    });
    userTeamsWithOneMember = createUserWithWorkspaces({
      includeProjects: false,
      includeTeams: true,
      includeOtherTeamMembers: false,
    });
    userTeamsWithMembers = createUserWithWorkspaces({
      includeProjects: false,
      includeTeams: true,
      includeOtherTeamMembers: true,
    });
    userWorkspacesAsAdmin = createUserWithWorkspaces({
      workspaceData: { userId: createAnotherWorkspaceMember().userId },
      workspaceMemberData: { role: 'admin' },
      anotherWorkspaceMemberData: { role: 'owner' },
      projectData: { userId: createAnotherWorkspaceMember().userId },
      projectMemberData: { role: 'admin' },
      anotherProjectMemberData: { role: 'owner' },
      teamData: { userId: createAnotherWorkspaceMember().userId },
      teamMemberData: { role: 'admin' },
      anotherTeamMemberData: { role: 'owner' },
    });
    userWithManyWorkspaces = createUserWithWorkspaces({
      howMuchWorkspaces: 5,
      howMuchProjects: 2,
      howMuchTeams: 3,
    });
    userWithMixInHisRoles = createUserWithWorkspaces({
      howMuchWorkspaces: 2,
      workspaceData: { userId: createAnotherWorkspaceMember().userId },
      workspaceMemberData: { role: 'admin' },
      anotherWorkspaceMemberData: { role: 'owner' },
      teamData: { userId: createAnotherWorkspaceMember().userId },
      teamMemberData: { role: 'admin' },
      anotherTeamMemberData: { role: 'owner' },
    });
    userWithSoloTeams = createUserWithWorkspaces({
      howMuchTeams: 2,
      includeOtherTeamMembers: false,
    });

    // MOCKS
    mockUserRepository = {
      findAllWorkspacesByUserId: jest.fn(),
      delete: jest.fn(),
    };

    mockWorkspaceRepository = { bulkDelete: jest.fn() };

    mockWorkspaceMemberRepository = {
      transferOwnership: jest.fn(),
      bulkDelete: jest.fn(),
    };

    mockTeamMemberRepository = {
      transferOwnership: jest.fn(),
      bulkDelete: jest.fn(),
    };

    mockProjectMemberRepository = {
      transferOwnership: jest.fn(),
      bulkDelete: jest.fn(),
    };

    deleteAccountUseCase = new DeleteAccountUseCase({
      userRepository: mockUserRepository,
      workspaceRepository: mockWorkspaceRepository,
      workspaceMemberRepository: mockWorkspaceMemberRepository,
      teamMemberRepository: mockTeamMemberRepository,
      projectMemberRepository: mockProjectMemberRepository,
    });

    jest.clearAllMocks();
  });

  describe('Basic cases', () => {
    test('should fail because user not found', async () => {
      mockUserRepository.findAllWorkspacesByUserId.mockResolvedValue({});

      expect(deleteAccountUseCase.execute(userData.id)).rejects.toMatchObject({
        output: { statusCode: 404 },
        message: 'User not found',
      });
      expect(mockUserRepository.findAllWorkspacesByUserId).toHaveBeenCalledWith(
        userData.id,
      );
      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });

    test('Should remove the user because user does not belong to any workspace', async () => {
      mockUserRepository.findAllWorkspacesByUserId.mockResolvedValue({
        ...userData,
        workspaces: [],
      });
      mockUserRepository.delete.mockResolvedValue(1);

      const result = await deleteAccountUseCase.execute(userData.id);
      expect(mockUserRepository.findAllWorkspacesByUserId).toHaveBeenCalledWith(
        userData.id,
      );
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userData.id);
      expect(result).toBe(1);
    });
  });

  describe('First case: user belongs to a workspace', () => {
    test('It should remove the user because he belongs to workspaces where he is the only member', async () => {
      mockUserRepository.findAllWorkspacesByUserId.mockResolvedValue(
        userWorkspacesWithOneMember,
      );
      mockWorkspaceRepository.bulkDelete.mockResolvedValue(1);
      mockUserRepository.delete.mockResolvedValue(1);

      const result = await deleteAccountUseCase.execute(userData.id);
      expect(mockUserRepository.findAllWorkspacesByUserId).toHaveBeenCalledWith(
        userData.id,
      );
      expect(mockWorkspaceRepository.bulkDelete).toHaveBeenCalledWith([
        workspaceData.id,
      ]);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userData.id);
      expect(result).toBe(1);
    });

    test('case: user is owner of workspaces with members. Should remove the user', async () => {
      mockUserRepository.findAllWorkspacesByUserId.mockResolvedValue(
        userWorkspacesWithoutProjectsAndTeams,
      );
      mockWorkspaceMemberRepository.transferOwnership.mockResolvedValue(1);
      mockWorkspaceMemberRepository.bulkDelete.mockResolvedValue(1);
      mockUserRepository.delete.mockResolvedValue(1);

      const result = await deleteAccountUseCase.execute(userData.id);

      expect(mockUserRepository.findAllWorkspacesByUserId).toHaveBeenCalledWith(
        userData.id,
      );

      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).toHaveBeenCalledWith(workspaceMemberData, anotherWorkspaceMemberData);

      expect(mockWorkspaceMemberRepository.bulkDelete).toHaveBeenCalledWith([
        workspaceMemberData.id,
      ]);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userData.id);

      expect(
        mockProjectMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();

      expect(mockTeamMemberRepository.transferOwnership).not.toHaveBeenCalled();
      expect(result).toBe(1);
    });
  });

  describe('Second case: user belongs to a projects', () => {
    test('it should fail because the user is the only member of the projects', async () => {
      mockUserRepository.findAllWorkspacesByUserId.mockResolvedValue(
        userProjectsWithOneMember,
      );

      try {
        await deleteAccountUseCase.execute(userData.id);
      } catch (error) {
        await expect(deleteAccountUseCase.execute(userData.id)).rejects.toThrow(
          /You are the only member of the following projects:/,
        );
        expect(
          mockProjectMemberRepository.transferOwnership,
        ).not.toHaveBeenCalled();

        expect(mockProjectMemberRepository.bulkDelete).not.toHaveBeenCalled();

        expect(
          mockWorkspaceMemberRepository.transferOwnership,
        ).not.toHaveBeenCalled();

        expect(mockWorkspaceMemberRepository.bulkDelete).not.toHaveBeenCalled();
      }
    });

    test('case: user is owner of projects with members. It should remove and transfer his ownership', async () => {
      mockUserRepository.findAllWorkspacesByUserId.mockResolvedValue(
        userProjectsWithMembers,
      );
      mockProjectMemberRepository.transferOwnership.mockResolvedValue(1);
      mockProjectMemberRepository.bulkDelete.mockResolvedValue(1);
      mockWorkspaceMemberRepository.transferOwnership.mockResolvedValue(1);
      mockWorkspaceMemberRepository.bulkDelete.mockResolvedValue(1);
      mockUserRepository.delete.mockResolvedValue(1);

      const result = await deleteAccountUseCase.execute(userData.id);

      expect(mockUserRepository.findAllWorkspacesByUserId).toHaveBeenCalledWith(
        userData.id,
      );

      expect(
        mockProjectMemberRepository.transferOwnership,
      ).toHaveBeenCalledWith(
        projectData.id,
        projectMemberData,
        anotherProjectMemberData,
      );

      expect(mockProjectMemberRepository.bulkDelete).toHaveBeenCalledWith([
        projectMemberData.id,
      ]);

      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).toHaveBeenCalledWith(workspaceMemberData, anotherWorkspaceMemberData);

      expect(mockWorkspaceMemberRepository.bulkDelete).toHaveBeenCalledWith([
        workspaceMemberData.id,
      ]);

      expect(mockTeamMemberRepository.transferOwnership).not.toHaveBeenCalled();
      expect(mockTeamMemberRepository.bulkDelete).not.toHaveBeenCalled();
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userData.id);
      expect(result).toBe(1);
    });
  });

  describe('Third case: user belongs to a teams', () => {
    test('it should fail because the user is the only member of the teams', async () => {
      mockUserRepository.findAllWorkspacesByUserId.mockResolvedValue(
        userTeamsWithOneMember,
      );

      try {
        await deleteAccountUseCase.execute(userData.id);
      } catch (error) {
        await expect(deleteAccountUseCase.execute(userData.id)).rejects.toThrow(
          /You are the only member of the following teams:/,
        );

        expect(
          mockProjectMemberRepository.transferOwnership,
        ).not.toHaveBeenCalled();

        expect(mockProjectMemberRepository.bulkDelete).not.toHaveBeenCalled();

        expect(
          mockWorkspaceMemberRepository.transferOwnership,
        ).not.toHaveBeenCalled();

        expect(mockWorkspaceMemberRepository.bulkDelete).not.toHaveBeenCalled();
      }
    });

    test('case: user is owner of teams with members. It should remove and transfer his ownership', async () => {
      mockUserRepository.findAllWorkspacesByUserId.mockResolvedValue(
        userTeamsWithMembers,
      );
      mockTeamMemberRepository.transferOwnership.mockResolvedValue(1);
      mockTeamMemberRepository.bulkDelete.mockResolvedValue(1);
      mockWorkspaceMemberRepository.transferOwnership.mockResolvedValue(1);
      mockWorkspaceMemberRepository.bulkDelete.mockResolvedValue(1);
      mockUserRepository.delete.mockResolvedValue(1);

      const result = await deleteAccountUseCase.execute(userData.id);

      expect(mockUserRepository.findAllWorkspacesByUserId).toHaveBeenCalledWith(
        userData.id,
      );

      expect(mockTeamMemberRepository.transferOwnership).toHaveBeenCalledWith(
        teamData.id,
        teamMemberData,
        anotherTeamMemberData,
      );

      expect(mockTeamMemberRepository.bulkDelete).toHaveBeenCalledWith([
        teamMemberData.id,
      ]);

      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).toHaveBeenCalledWith(workspaceMemberData, anotherWorkspaceMemberData);

      expect(mockWorkspaceMemberRepository.bulkDelete).toHaveBeenCalledWith([
        workspaceMemberData.id,
      ]);

      expect(
        mockProjectMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();

      expect(mockProjectMemberRepository.bulkDelete).not.toHaveBeenCalled();
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userData.id);
      expect(result).toBe(1);
    });
  });

  describe('Fourth case: user belongs to a workspaces, projects and teams', () => {
    test('case: user is owner of teams with members. It should remove and transfer his ownership', async () => {
      mockUserRepository.findAllWorkspacesByUserId.mockResolvedValue(
        userWorkspacesWithMembers,
      );
      mockProjectMemberRepository.transferOwnership.mockResolvedValue(1);
      mockProjectMemberRepository.bulkDelete.mockResolvedValue(1);
      mockTeamMemberRepository.transferOwnership.mockResolvedValue(1);
      mockTeamMemberRepository.bulkDelete.mockResolvedValue(1);
      mockWorkspaceMemberRepository.transferOwnership.mockResolvedValue(1);
      mockWorkspaceMemberRepository.bulkDelete.mockResolvedValue(1);
      mockUserRepository.delete.mockResolvedValue(1);

      const result = await deleteAccountUseCase.execute(userData.id);

      expect(mockUserRepository.findAllWorkspacesByUserId).toHaveBeenCalledWith(
        userData.id,
      );

      expect(
        mockProjectMemberRepository.transferOwnership,
      ).toHaveBeenCalledWith(
        projectData.id,
        projectMemberData,
        anotherProjectMemberData,
      );
      expect(mockProjectMemberRepository.bulkDelete).toHaveBeenCalledWith([
        projectMemberData.id,
      ]);

      expect(mockTeamMemberRepository.transferOwnership).toHaveBeenCalledWith(
        teamData.id,
        teamMemberData,
        anotherTeamMemberData,
      );
      expect(mockTeamMemberRepository.bulkDelete).toHaveBeenCalledWith([
        teamMemberData.id,
      ]);

      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).toHaveBeenCalledWith(workspaceMemberData, anotherWorkspaceMemberData);
      expect(mockWorkspaceMemberRepository.bulkDelete).toHaveBeenCalledWith([
        workspaceMemberData.id,
      ]);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userData.id);
      expect(result).toBe(1);
    });

    test('case: Error with the transfer of ownership. It should return an error', async () => {
      mockUserRepository.findAllWorkspacesByUserId.mockResolvedValue(
        userWorkspacesWithMembers,
      );
      mockProjectMemberRepository.transferOwnership.mockResolvedValue(
        new Error('Transfer failed'),
      );
      mockProjectMemberRepository.bulkDelete.mockResolvedValue(1);
      mockTeamMemberRepository.transferOwnership.mockResolvedValue(1);
      mockTeamMemberRepository.bulkDelete.mockResolvedValue(1);
      mockWorkspaceMemberRepository.transferOwnership.mockResolvedValue(1);
      mockWorkspaceMemberRepository.bulkDelete.mockResolvedValue(1);
      mockUserRepository.delete.mockResolvedValue(1);

      try {
        await deleteAccountUseCase.execute(userData.id);
      } catch (error) {
        expect(
          mockUserRepository.findAllWorkspacesByUserId,
        ).toHaveBeenCalledWith(userData.id);

        expect(error.message).toMatch(/Transfer failed/);
        expect(mockProjectMemberRepository.bulkDelete).not.toHaveBeenCalled();

        expect(
          mockTeamMemberRepository.transferOwnership,
        ).not.toHaveBeenCalled();
        expect(mockTeamMemberRepository.bulkDelete).not.toHaveBeenCalled();

        expect(
          mockWorkspaceMemberRepository.transferOwnership,
        ).not.toHaveBeenCalled();
        expect(mockWorkspaceMemberRepository.bulkDelete).not.toHaveBeenCalled();

        expect(mockUserRepository.delete).not.toHaveBeenCalled();
      }
    });

    test('case: user is not owner of teams with members. It should only remove him.', async () => {
      mockUserRepository.findAllWorkspacesByUserId.mockResolvedValue(
        userWorkspacesAsAdmin,
      );

      mockProjectMemberRepository.bulkDelete.mockResolvedValue(1);
      mockTeamMemberRepository.bulkDelete.mockResolvedValue(1);
      mockWorkspaceMemberRepository.bulkDelete.mockResolvedValue(1);
      mockUserRepository.delete.mockResolvedValue(1);

      const result = await deleteAccountUseCase.execute(userData.id);

      expect(mockUserRepository.findAllWorkspacesByUserId).toHaveBeenCalledWith(
        userData.id,
      );

      expect(mockProjectMemberRepository.bulkDelete).toHaveBeenCalledWith([
        projectMemberData.id,
      ]);

      expect(mockTeamMemberRepository.bulkDelete).toHaveBeenCalledWith([
        teamMemberData.id,
      ]);

      expect(mockWorkspaceMemberRepository.bulkDelete).toHaveBeenCalledWith([
        workspaceMemberData.id,
      ]);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userData.id);
      expect(result).toBe(1);
    });

    test('case: user is owner of more than 2 workspaces, projects and teams with members. It should remove and transfer his ownership', async () => {
      mockUserRepository.findAllWorkspacesByUserId.mockResolvedValue(
        userWithManyWorkspaces,
      );
      mockProjectMemberRepository.transferOwnership.mockResolvedValue(10);
      mockProjectMemberRepository.bulkDelete.mockResolvedValue(1);
      mockTeamMemberRepository.transferOwnership.mockResolvedValue(15);
      mockTeamMemberRepository.bulkDelete.mockResolvedValue(1);
      mockWorkspaceMemberRepository.transferOwnership.mockResolvedValue(5);
      mockWorkspaceMemberRepository.bulkDelete.mockResolvedValue(1);
      mockUserRepository.delete.mockResolvedValue(1);

      const result = await deleteAccountUseCase.execute(userData.id);

      expect(mockUserRepository.findAllWorkspacesByUserId).toHaveBeenCalledWith(
        userData.id,
      );

      expect(
        mockProjectMemberRepository.transferOwnership,
      ).toHaveBeenCalledWith(
        projectData.id,
        projectMemberData,
        anotherProjectMemberData,
      );
      expect(
        mockProjectMemberRepository.transferOwnership,
      ).toHaveBeenCalledTimes(10);

      expect(mockProjectMemberRepository.bulkDelete).toHaveBeenCalledWith(
        Array.from({ length: 10 }, () => {
          return projectMemberData.id;
        }),
      );

      expect(mockProjectMemberRepository.bulkDelete).toHaveBeenCalledTimes(1);

      expect(mockTeamMemberRepository.transferOwnership).toHaveBeenCalledWith(
        teamData.id,
        teamMemberData,
        anotherTeamMemberData,
      );
      expect(mockTeamMemberRepository.transferOwnership).toHaveBeenCalledTimes(
        15,
      );

      expect(mockTeamMemberRepository.bulkDelete).toHaveBeenCalledWith(
        Array.from({ length: 15 }, () => {
          return teamMemberData.id;
        }),
      );

      expect(mockTeamMemberRepository.bulkDelete).toHaveBeenCalledTimes(1);

      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).toHaveBeenCalledWith(workspaceMemberData, anotherWorkspaceMemberData);
      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).toHaveBeenCalledTimes(5);

      expect(mockWorkspaceMemberRepository.bulkDelete).toHaveBeenCalledWith(
        Array.from({ length: 5 }, () => {
          return workspaceMemberData.id;
        }),
      );

      expect(mockWorkspaceMemberRepository.bulkDelete).toHaveBeenCalledTimes(1);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userData.id);
      expect(result).toBe(1);
    });

    test('case: user has mix in his roles(Owner in project, admin in the rest). It should remove and transfer his ownership', async () => {
      mockUserRepository.findAllWorkspacesByUserId.mockResolvedValue(
        userWithMixInHisRoles,
      );
      mockProjectMemberRepository.transferOwnership.mockResolvedValue(2);
      mockProjectMemberRepository.bulkDelete.mockResolvedValue(1);
      mockTeamMemberRepository.bulkDelete.mockResolvedValue(1);
      mockWorkspaceMemberRepository.bulkDelete.mockResolvedValue(1);
      mockUserRepository.delete.mockResolvedValue(1);

      const result = await deleteAccountUseCase.execute(userData.id);

      expect(mockUserRepository.findAllWorkspacesByUserId).toHaveBeenCalledWith(
        userData.id,
      );

      // ProjectMember
      expect(
        mockProjectMemberRepository.transferOwnership,
      ).toHaveBeenCalledWith(
        projectData.id,
        projectMemberData,
        anotherProjectMemberData,
      );
      expect(
        mockProjectMemberRepository.transferOwnership,
      ).toHaveBeenCalledTimes(2);

      expect(mockProjectMemberRepository.bulkDelete).toHaveBeenCalledWith(
        Array.from({ length: 2 }, () => {
          return projectMemberData.id;
        }),
      );

      expect(mockProjectMemberRepository.bulkDelete).toHaveBeenCalledTimes(1);

      // TeamMember
      expect(mockTeamMemberRepository.transferOwnership).not.toHaveBeenCalled();

      expect(mockTeamMemberRepository.bulkDelete).toHaveBeenCalledWith(
        Array.from({ length: 2 }, () => {
          return teamMemberData.id;
        }),
      );

      expect(mockTeamMemberRepository.bulkDelete).toHaveBeenCalledTimes(1);

      // WorkspaceMember
      expect(
        mockWorkspaceMemberRepository.transferOwnership,
      ).not.toHaveBeenCalledWith();

      expect(mockWorkspaceMemberRepository.bulkDelete).toHaveBeenCalledWith(
        Array.from({ length: 2 }, () => {
          return workspaceMemberData.id;
        }),
      );

      expect(mockWorkspaceMemberRepository.bulkDelete).toHaveBeenCalledTimes(1);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userData.id);
      expect(result).toBe(1);
    });

    test('case: user has solo teams. It should return an error', async () => {
      mockUserRepository.findAllWorkspacesByUserId.mockResolvedValue(
        userWithSoloTeams,
      );
      mockProjectMemberRepository.transferOwnership.mockResolvedValue(1);
      mockProjectMemberRepository.bulkDelete.mockResolvedValue(1);

      try {
        await deleteAccountUseCase.execute(userData.id);
      } catch (error) {
        expect(
          mockUserRepository.findAllWorkspacesByUserId,
        ).toHaveBeenCalledWith(userData.id);

        // ProjectMember
        expect(
          mockProjectMemberRepository.transferOwnership,
        ).toHaveBeenCalledWith(
          projectData.id,
          projectMemberData,
          anotherProjectMemberData,
        );
        expect(
          mockProjectMemberRepository.transferOwnership,
        ).toHaveBeenCalledTimes(1);

        expect(mockProjectMemberRepository.bulkDelete).toHaveBeenCalledWith([
          projectMemberData.id,
        ]);

        expect(mockProjectMemberRepository.bulkDelete).toHaveBeenCalledTimes(1);

        // TeamMember
        expect(
          mockTeamMemberRepository.transferOwnership,
        ).not.toHaveBeenCalled();

        expect(mockTeamMemberRepository.bulkDelete).not.toHaveBeenCalled();
        expect(error.message).toMatch(
          /You are the only member of the following teams:/,
        );

        // WorkspaceMember
        expect(
          mockWorkspaceMemberRepository.transferOwnership,
        ).not.toHaveBeenCalledWith();

        expect(mockWorkspaceMemberRepository.bulkDelete).not.toHaveBeenCalled();

        expect(mockUserRepository.delete).not.toHaveBeenCalled();
      }
    });
  });
});
