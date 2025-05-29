const UpdateRoleUseCase = require('../../../api/src/application/use-cases/team-member/UpdateRoleUseCase');
const TeamMemberDto = require('../../../api/src/application/dtos/teamMember.dto');
const { createProjectMember } = require('../../fake-data/fake-entities');

describe('UpdateRoleUseCase', () => {
  let teamMember;
  let newRole;
  let dbResponse;
  let useCaseResponse;
  let mockTeamMemberRepository;
  let updateRoleUseCase;

  beforeEach(() => {
    teamMember = { ...createProjectMember(), role: 'member' };
    newRole = 'admin';
    dbResponse = createProjectMember({ role: 'admin' });
    useCaseResponse = { ...dbResponse };

    mockTeamMemberRepository = {
      updateRole: jest.fn().mockResolvedValue([1, [dbResponse]]),
    };

    updateRoleUseCase = new UpdateRoleUseCase({
      teamMemberRepository: mockTeamMemberRepository,
    });
  });

  test('It should return a successfully updated project member', async () => {
    const result = await updateRoleUseCase.execute(teamMember, newRole);

    expect(mockTeamMemberRepository.updateRole).toHaveBeenCalledWith(
      teamMember.id,
      newRole,
    );
    expect(result).toMatchObject(new TeamMemberDto(useCaseResponse));
  });

  test('It should return an error because teamMember was not provided', async () => {
    await expect(updateRoleUseCase.execute(null, newRole)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockTeamMemberRepository.updateRole).not.toHaveBeenCalled();
  });

  test('It should return an error because newRole was not provided', async () => {
    await expect(updateRoleUseCase.execute(teamMember, null)).rejects.toThrow(
      /invalid|was not provided/,
    );
    expect(mockTeamMemberRepository.updateRole).not.toHaveBeenCalled();
  });

  test('It should return an error because newRole was not provided', async () => {
    teamMember.role = 'owner';

    await expect(
      updateRoleUseCase.execute(teamMember, newRole),
    ).rejects.toThrow('You cannot change the role to the owner');
    expect(mockTeamMemberRepository.updateRole).not.toHaveBeenCalled();
  });

  test('It should return an error because newRole was not provided', async () => {
    teamMember.role = 'admin';
    newRole = 'admin';

    await expect(
      updateRoleUseCase.execute(teamMember, newRole),
    ).rejects.toThrow(/already has the role/);
    expect(mockTeamMemberRepository.updateRole).not.toHaveBeenCalled();
  });

  test('It should return an empty array because the updateRole operation to the db failed', async () => {
    mockTeamMemberRepository.updateRole.mockResolvedValue([0, []]);

    await expect(
      updateRoleUseCase.execute(teamMember, newRole),
    ).rejects.toThrow(/Something went wrong/);
    expect(mockTeamMemberRepository.updateRole).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
