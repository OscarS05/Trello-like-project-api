const TransferOwnershipUseCase = require('../../../api/src/application/use-cases/team-member/DeleteTeamMemberUseCase');
const {
  createTeamMember,
  createAnotherTeamMember,
} = require('../../fake-data/fake-entities');

describe('TransferOwnershipUseCase', () => {
  let requesterAsTeamMember;
  let memberToBeRemoved;
  let teamMembers;
  let mockTeamMemberRepository;
  let mockTeamRepository;
  let transferOwnershipUseCase;

  beforeEach(() => {
    requesterAsTeamMember = createTeamMember();
    memberToBeRemoved = createAnotherTeamMember({ role: 'admin' });
    teamMembers = [
      createTeamMember(),
      createAnotherTeamMember(),
      createAnotherTeamMember({
        name: 'Aurelio',
        userId: 'fake-usrId',
        id: 'fake-id',
        workspaceMemberId: 'fake-wm-id',
      }),
    ];

    mockTeamMemberRepository = {
      delete: jest.fn().mockResolvedValue(1),
      transferOwnership: jest.fn().mockResolvedValue(memberToBeRemoved),
    };

    mockTeamRepository = {
      delete: jest.fn().mockResolvedValue(1),
    };

    transferOwnershipUseCase = new TransferOwnershipUseCase({
      teamMemberRepository: mockTeamMemberRepository,
      teamRepository: mockTeamRepository,
    });
  });

  test('case 1: An admin or owner going to remove another team member. It should return a 1', async () => {
    const result = await transferOwnershipUseCase.execute(
      requesterAsTeamMember,
      memberToBeRemoved,
      teamMembers,
    );

    expect(mockTeamMemberRepository.delete).toHaveBeenCalledWith(
      memberToBeRemoved.id,
    );
    expect(mockTeamRepository.delete).not.toHaveBeenCalled();
    expect(mockTeamMemberRepository.transferOwnership).not.toHaveBeenCalled();
    expect(result).toBe(1);
  });

  test('case 2: team member(NOT owner) want to leave the team. It should return a 1', async () => {
    const result = await transferOwnershipUseCase.execute(
      requesterAsTeamMember,
      memberToBeRemoved,
      teamMembers,
    );

    expect(mockTeamMemberRepository.delete).toHaveBeenCalledWith(
      memberToBeRemoved.id,
    );
    expect(mockTeamRepository.delete).not.toHaveBeenCalled();
    expect(mockTeamMemberRepository.transferOwnership).not.toHaveBeenCalled();
    expect(result).toBe(1);
  });

  test('case 3: team member(IS owner) want to leave the team, but he/she is the only one on the team. It should return a 1', async () => {
    teamMembers.splice(1, 2);
    memberToBeRemoved = requesterAsTeamMember;

    const result = await transferOwnershipUseCase.execute(
      requesterAsTeamMember,
      memberToBeRemoved,
      teamMembers,
    );

    expect(mockTeamMemberRepository.delete).not.toHaveBeenCalled();
    expect(mockTeamRepository.delete).toHaveBeenCalledWith(
      memberToBeRemoved.teamId,
    );
    expect(mockTeamMemberRepository.transferOwnership).not.toHaveBeenCalled();
    expect(result).toBe(1);
  });

  test('case 4: team member(IS owner) want to leave the team with members. It should return a 1 and transfer the ownership', async () => {
    memberToBeRemoved = requesterAsTeamMember;

    const result = await transferOwnershipUseCase.execute(
      requesterAsTeamMember,
      memberToBeRemoved,
      teamMembers,
    );

    expect(mockTeamMemberRepository.transferOwnership).toHaveBeenCalledWith(
      memberToBeRemoved.teamId,
      memberToBeRemoved,
      teamMembers[1],
    );
    expect(mockTeamMemberRepository.delete).toHaveBeenCalledWith(
      memberToBeRemoved.id,
    );
    expect(mockTeamRepository.delete).not.toHaveBeenCalled();
    expect(result).toBe(1);
  });

  test('It should return an error because requesterAsTeamMember was not provided', async () => {
    await expect(
      transferOwnershipUseCase.execute({}, memberToBeRemoved, teamMembers),
    ).rejects.toThrow(/was not provided/);
    expect(mockTeamMemberRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an error because memberToBeRemoved was not provided', async () => {
    await expect(
      transferOwnershipUseCase.execute(requesterAsTeamMember, {}, teamMembers),
    ).rejects.toThrow(/was not provided/);
    expect(mockTeamMemberRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an error because the teamMembers is not an array', async () => {
    await expect(
      transferOwnershipUseCase.execute(
        requesterAsTeamMember,
        memberToBeRemoved,
        {},
      ),
    ).rejects.toThrow(/is not an array/);
    expect(mockTeamMemberRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an error because the teamMembers is not valid', async () => {
    await expect(
      transferOwnershipUseCase.execute(
        requesterAsTeamMember,
        memberToBeRemoved,
        [],
      ),
    ).rejects.toThrow(/is not valid/);
    expect(mockTeamMemberRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an error because the memberToBeRemoved does not belong to the team', async () => {
    memberToBeRemoved.teamId = 'wrong-id';

    await expect(
      transferOwnershipUseCase.execute(
        requesterAsTeamMember,
        memberToBeRemoved,
        teamMembers,
      ),
    ).rejects.toThrow(/does not belong/);
    expect(mockTeamMemberRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an error because the memberToBeRemoved does not belong to the team', async () => {
    requesterAsTeamMember.role = 'admin';
    memberToBeRemoved.role = 'owner';

    await expect(
      transferOwnershipUseCase.execute(
        requesterAsTeamMember,
        memberToBeRemoved,
        teamMembers,
      ),
    ).rejects.toThrow('You cannot remove the team owner');
    expect(mockTeamMemberRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an error because the delete teamMember operation failed', async () => {
    mockTeamMemberRepository.delete.mockResolvedValue(0);

    await expect(
      transferOwnershipUseCase.execute(
        requesterAsTeamMember,
        memberToBeRemoved,
        teamMembers,
      ),
    ).rejects.toThrow(/Something went wrong/);
    expect(mockTeamMemberRepository.delete).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
