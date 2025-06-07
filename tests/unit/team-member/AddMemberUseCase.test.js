jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuid } = require('uuid');

const AddMemberUseCase = require('../../../api/src/application/use-cases/team-member/AddMemberUseCase');
const TeamMemberDto = require('../../../api/src/application/dtos/teamMember.dto');
const { createAnotherTeamMember } = require('../../fake-data/fake-entities');

describe('AddMemberUseCase', () => {
  let teamId;
  let dataOfNewTeamMember;
  let addedWorkspaceMember;
  let useCaseResponse;
  let mocktTeamMemberRepository;
  let addMemberUseCase;

  beforeEach(() => {
    teamId = createAnotherTeamMember().teamId;
    dataOfNewTeamMember = createAnotherTeamMember();
    addedWorkspaceMember = createAnotherTeamMember({ role: 'member' });
    uuid.mockReturnValue(addedWorkspaceMember.id);

    useCaseResponse = { ...addedWorkspaceMember };

    mocktTeamMemberRepository = {
      create: jest.fn().mockResolvedValue(addedWorkspaceMember),
      findByWorkspaceMemberId: jest.fn(),
    };

    addMemberUseCase = new AddMemberUseCase({
      teamMemberRepository: mocktTeamMemberRepository,
    });
  });

  test('It should return a successfully added team member', async () => {
    mocktTeamMemberRepository.findByWorkspaceMemberId.mockResolvedValue(null);

    const result = await addMemberUseCase.execute(teamId, dataOfNewTeamMember);

    expect(mocktTeamMemberRepository.create).toHaveBeenCalledWith(
      teamId,
      expect.objectContaining({
        workspaceMemberId: dataOfNewTeamMember.workspaceMemberId,
      }),
    );
    expect(uuid).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new TeamMemberDto(useCaseResponse));
  });

  test('It should return an error because teamId was not provided', async () => {
    await expect(
      addMemberUseCase.execute(undefined, dataOfNewTeamMember),
    ).rejects.toThrow(/was not provided/);
    expect(mocktTeamMemberRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because teamId was not provided in the data of the new member', async () => {
    dataOfNewTeamMember.teamId = null;

    await expect(
      addMemberUseCase.execute(teamId, dataOfNewTeamMember),
    ).rejects.toThrow(/was not provided/);
    expect(mocktTeamMemberRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because workspaceMemberId was not provided', async () => {
    dataOfNewTeamMember.workspaceMemberId = null;

    await expect(
      addMemberUseCase.execute(teamId, dataOfNewTeamMember),
    ).rejects.toThrow(/was not provided/);
    expect(mocktTeamMemberRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because workspaceId was not provided', async () => {
    dataOfNewTeamMember.workspaceId = null;

    await expect(
      addMemberUseCase.execute(teamId, dataOfNewTeamMember),
    ).rejects.toThrow(/was not provided/);
    expect(mocktTeamMemberRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the db operation failed', async () => {
    mocktTeamMemberRepository.create.mockResolvedValue({});

    await expect(
      addMemberUseCase.execute(teamId, dataOfNewTeamMember),
    ).rejects.toThrow(/Something went wrong/);
    expect(mocktTeamMemberRepository.create).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
