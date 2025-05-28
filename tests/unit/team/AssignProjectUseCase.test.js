jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuidv4 } = require('uuid');

const AssignProjectUseCase = require('../../../api/src/application/use-cases/team/AssignProjectUseCase');
const ProjectMemberDto = require('../../../api/src/application/dtos/projectMember.dto');
const {
  createProject,
  createTeam,
  createTeamMember,
  createAnotherTeamMember,
  createProjectMember,
  createAnotherProjectMember,
} = require('../../fake-data/fake-entities');

describe('AssignProjectUseCase', () => {
  let teamMembers;
  let projectMembers;
  let teamId;
  let projectId;
  let assignProjectDbResponse;
  let addedMemberDbResponse;
  let mockTeamRepository;
  let mockProjectMemberRepository;
  let assignProjectUseCase;

  beforeEach(() => {
    teamMembers = [createTeamMember(), createAnotherTeamMember()];
    projectMembers = [createProjectMember(), createAnotherProjectMember()];
    teamId = createTeam().id;
    projectId = createProject().id;
    uuidv4.mockReturnValue('fake-uuid');

    assignProjectDbResponse = { teamId, projectId };
    addedMemberDbResponse = [
      createProjectMember(),
      createAnotherProjectMember(),
    ];

    mockTeamRepository = {
      assignProject: jest.fn().mockResolvedValue(assignProjectDbResponse),
    };

    mockProjectMemberRepository = {
      create: jest.fn(),
    };

    assignProjectUseCase = new AssignProjectUseCase({
      teamRepository: mockTeamRepository,
      projectMemberRepository: mockProjectMemberRepository,
    });
  });

  test('case 1: All team members already belong to the project.', async () => {
    const result = await assignProjectUseCase.execute(
      teamMembers,
      projectMembers,
      teamId,
      projectId,
    );

    expect(mockTeamRepository.assignProject).toHaveBeenCalledWith(
      teamId,
      projectId,
    );
    expect(mockProjectMemberRepository.create).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      assignedProject: assignProjectDbResponse,
      addedMembers: [],
    });
  });

  test('case 2: no team members is not yet belong of the project.', async () => {
    mockProjectMemberRepository.create
      .mockResolvedValueOnce(createProjectMember())
      .mockResolvedValueOnce(createAnotherProjectMember());

    projectMembers = [];

    const result = await assignProjectUseCase.execute(
      teamMembers,
      projectMembers,
      teamId,
      projectId,
    );

    expect(mockTeamRepository.assignProject).toHaveBeenCalledTimes(1);
    expect(mockProjectMemberRepository.create).toHaveBeenCalledTimes(2); // There are 2 team members
    expect(mockProjectMemberRepository.create).toHaveBeenCalledWith(
      expect.objectContaining(
        ...teamMembers.map((tm) => ({
          workspaceMemberId: tm.workspaceMemberId,
        })),
      ),
    );

    expect(result).toMatchObject(
      expect.objectContaining({
        assignedProject: assignProjectDbResponse,
        addedMembers: addedMemberDbResponse.map(
          (member) => new ProjectMemberDto(member),
        ),
      }),
    );
  });

  test('case 3: Only 1 of the 2 team members is not yet belong of the project', async () => {
    projectMembers = [createProjectMember()];

    mockProjectMemberRepository.create.mockResolvedValue(
      createAnotherProjectMember(),
    );

    const result = await assignProjectUseCase.execute(
      teamMembers,
      projectMembers,
      teamId,
      projectId,
    );

    expect(mockTeamRepository.assignProject).toHaveBeenCalledTimes(1);
    expect(mockProjectMemberRepository.create).toHaveBeenCalledTimes(1); // Only 1 of the 2 team members is not yet belong
    expect(mockProjectMemberRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceMemberId: createAnotherProjectMember().workspaceMemberId,
      }),
    );

    expect(result).toMatchObject(
      expect.objectContaining({
        assignedProject: assignProjectDbResponse,
        addedMembers: [new ProjectMemberDto(createAnotherProjectMember())],
      }),
    );
  });

  test('It should return an error because teamMembers is not an array', async () => {
    try {
      await assignProjectUseCase.execute({}, projectMembers, teamId, projectId);

      expect(mockTeamRepository.assignProject).not.toHaveBeenCalled();
      expect(mockProjectMemberRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/is not an array/);
    }
  });

  test('It should return an error because projectMembers is not an array', async () => {
    try {
      await assignProjectUseCase.execute(teamMembers, {}, teamId, projectId);

      expect(mockTeamRepository.assignProject).not.toHaveBeenCalled();
      expect(mockProjectMemberRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/is not an array/);
    }
  });

  test('It should return an error because teamId was not provided', async () => {
    try {
      await assignProjectUseCase.execute(
        teamMembers,
        projectMembers,
        null,
        projectId,
      );

      expect(mockTeamRepository.assignProject).not.toHaveBeenCalled();
      expect(mockProjectMemberRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because projectId was not provided', async () => {
    try {
      await assignProjectUseCase.execute(
        teamMembers,
        projectMembers,
        teamId,
        null,
      );

      expect(mockTeamRepository.assignProject).not.toHaveBeenCalled();
      expect(mockProjectMemberRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
