const TransferOwnershipUseCase = require('../../../api/src/application/use-cases/team-member/TransferOwnershipUseCase');
const {
  createTeamMember,
  createAnotherTeamMember,
} = require('../../fake-data/fake-entities');

describe('TransferOwnershipUseCase', () => {
  let currentTeamMember;
  let newTeamMember;
  let mockTeamMemberRepository;
  let transferOwnershipUseCase;

  beforeEach(() => {
    currentTeamMember = createTeamMember();
    newTeamMember = createAnotherTeamMember();

    mockTeamMemberRepository = {
      transferOwnership: jest.fn().mockResolvedValue(newTeamMember),
    };

    transferOwnershipUseCase = new TransferOwnershipUseCase({
      teamMemberRepository: mockTeamMemberRepository,
    });
  });

  test('It should return a successful newTeamMember', async () => {
    const result = await transferOwnershipUseCase.execute(
      currentTeamMember,
      newTeamMember,
    );

    expect(mockTeamMemberRepository.transferOwnership).toHaveBeenCalledWith(
      newTeamMember.teamId,
      currentTeamMember,
      newTeamMember,
    );
    expect(result).toMatchObject(newTeamMember);
  });

  test('It should return an error because currentTeamMember was not provided', async () => {
    await expect(
      transferOwnershipUseCase.execute({}, newTeamMember),
    ).rejects.toThrow(/was not provided/);
    expect(mockTeamMemberRepository.transferOwnership).not.toHaveBeenCalled();
  });

  test('It should return an error because newTeamMember was not provided', async () => {
    await expect(
      transferOwnershipUseCase.execute(currentTeamMember, {}),
    ).rejects.toThrow(/was not provided/);
    expect(mockTeamMemberRepository.transferOwnership).not.toHaveBeenCalled();
  });

  test('It should return an error because the newTeamMember does not belong to the team', async () => {
    newTeamMember.teamId = 'wrong-Id';

    await expect(
      transferOwnershipUseCase.execute(currentTeamMember, newTeamMember),
    ).rejects.toThrow(/does not belong to the team/);
    expect(mockTeamMemberRepository.transferOwnership).not.toHaveBeenCalled();
  });

  test('It should return an error because the newTeamMember does not belong to the team', async () => {
    newTeamMember.id = currentTeamMember.id;

    await expect(
      transferOwnershipUseCase.execute(currentTeamMember, newTeamMember),
    ).rejects.toThrow(/transfer ownership yourself/);
    expect(mockTeamMemberRepository.transferOwnership).not.toHaveBeenCalled();
  });

  test('It should return an error because the newTeamMember does not belong to the team', async () => {
    newTeamMember.role = 'owner';

    await expect(
      transferOwnershipUseCase.execute(currentTeamMember, newTeamMember),
    ).rejects.toThrow(/already has the role/);
    expect(mockTeamMemberRepository.transferOwnership).not.toHaveBeenCalled();
  });

  test('It should return an error because the newTeamMember does not belong to the team', async () => {
    mockTeamMemberRepository.transferOwnership.mockResolvedValue([0, []]);

    await expect(
      transferOwnershipUseCase.execute(currentTeamMember, newTeamMember),
    ).rejects.toThrow(/Something went wrong/);
    expect(mockTeamMemberRepository.transferOwnership).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
