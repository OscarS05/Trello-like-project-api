const UpdateRoleUseCase = require('../../../api/src/application/use-cases/project-member/UpdateRoleUseCase');
const ProjectMemberDto = require('../../../api/src/application/dtos/projectMember.dto');
const { createProjectMember } = require('../../fake-data/fake-entities');

describe('UpdateRoleUseCase', () => {
  let memberToBeUpdated;
  let newRole;
  let dbResponse;
  let useCaseResponse;
  let mockProjectMemberRepository;
  let updateRoleUseCase;

  beforeEach(() => {
    memberToBeUpdated = { ...createProjectMember(), role: 'member' };
    newRole = 'admin';
    dbResponse = createProjectMember({ role: 'admin' });
    useCaseResponse = { ...dbResponse };

    mockProjectMemberRepository = {
      updateRole: jest.fn().mockResolvedValue([1, [dbResponse]]),
    };

    updateRoleUseCase = new UpdateRoleUseCase({
      projectMemberRepository: mockProjectMemberRepository,
    });
  });

  test('It should return a successfully updated project member', async () => {
    const result = await updateRoleUseCase.execute(memberToBeUpdated, newRole);

    expect(mockProjectMemberRepository.updateRole).toHaveBeenCalledWith(
      memberToBeUpdated.id,
      newRole,
    );
    expect(result).toMatchObject(new ProjectMemberDto(useCaseResponse));
  });

  test('It should return an error because memberToBeUpdated was not provided', async () => {
    try {
      await updateRoleUseCase.execute(null, newRole);
    } catch (error) {
      expect(mockProjectMemberRepository.updateRole).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because newRole was not provided', async () => {
    try {
      await updateRoleUseCase.execute(memberToBeUpdated, undefined);
    } catch (error) {
      expect(mockProjectMemberRepository.updateRole).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because memberToBeUpdated must NOT be the owner', async () => {
    memberToBeUpdated.role = 'owner';

    try {
      await updateRoleUseCase.execute(memberToBeUpdated, newRole);

      expect(mockProjectMemberRepository.updateRole).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/cannot change the owner's role/);
    }
  });

  test('It should return an error because the member to be updated already has the newRole', async () => {
    memberToBeUpdated.role = newRole;
    try {
      await updateRoleUseCase.execute(memberToBeUpdated, newRole);

      expect(mockProjectMemberRepository.updateRole).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/already has/);
    }
  });

  test('It should return an empty array because the updateRole operation to the db failed', async () => {
    mockProjectMemberRepository.updateRole.mockResolvedValue([0, []]);
    try {
      await updateRoleUseCase.execute(memberToBeUpdated, newRole, newRole);

      expect(mockProjectMemberRepository.updateRole).toHaveBeenCalledTimes(1);
    } catch (error) {
      expect(error.message).toMatch(/Something went wrong/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
