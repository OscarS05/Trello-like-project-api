const GetTeamsByWorkspaceUseCase = require('../../../api/src/application/use-cases/team/GetTeamsByWorkspaceUseCase');
const TeamDto = require('../../../api/src/application/dtos/team.dto');
const {
  createProject,
  createWorkspaceMember,
  createTeam,
  createTeamMember,
  createAnotherTeamMember,
  createAnotherWorkspaceMember,
  createAnotherUser,
  createUser,
} = require('../../fake-data/fake-entities');

describe('GetTeamsByWorkspaceUseCase', () => {
  let requesterAsWorkspaceMember;
  let dbResponse;
  let mockTeamRepository;
  let getTeamsByWorkspaceUseCase;

  beforeEach(() => {
    requesterAsWorkspaceMember = createWorkspaceMember();
    dbResponse = [
      {
        ...createTeam(),
        teamMembers: [
          createTeamMember({
            workspaceMember: createWorkspaceMember({ user: createUser() }),
          }),
          createAnotherTeamMember({
            workspaceMember: createAnotherWorkspaceMember({
              user: createAnotherUser(),
            }),
          }),
        ],
        projects: [createProject()],
      },
    ];

    mockTeamRepository = {
      findAllByWorkspace: jest.fn().mockResolvedValue(dbResponse),
    };

    getTeamsByWorkspaceUseCase = new GetTeamsByWorkspaceUseCase({
      teamRepository: mockTeamRepository,
    });
  });

  test('It should correctly return teams with data', async () => {
    const result = await getTeamsByWorkspaceUseCase.execute(
      requesterAsWorkspaceMember,
    );

    expect(mockTeamRepository.findAllByWorkspace).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(
      dbResponse.map((t) => TeamDto.WithData(t, requesterAsWorkspaceMember)),
    );
  });

  test('It should return an error because requesterAsWorkspaceMember was not provided', async () => {
    expect(getTeamsByWorkspaceUseCase.execute({})).rejects.toThrow(
      /was not provided/,
    );
    expect(mockTeamRepository.findAllByWorkspace).not.toHaveBeenCalled();
  });

  test('It should return an empty object because the db did not find anything', async () => {
    mockTeamRepository.findAllByWorkspace.mockResolvedValueOnce([]);

    const result = await getTeamsByWorkspaceUseCase.execute(
      requesterAsWorkspaceMember,
    );

    expect(mockTeamRepository.findAllByWorkspace).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
