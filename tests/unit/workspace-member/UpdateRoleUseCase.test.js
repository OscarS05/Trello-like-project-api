const UpdateRoleUseCase = require('../../../api/src/application/use-cases/workspace-member/UpdateRoleUseCase');
const {
  createWorkspace,
  createWorkspaceMember,
} = require('../../fake-data/fake-entities');

describe('UpdateRoleUseCase', () => {
  let workspaceId;
  let workspaceMemberToBeUpdate;
  let newRole;
  let updatedWorkspaceMember;
  let useCaseResponse;
  let mockWorkspaceMemberRepository;
  let updateRoleUseCase;

  beforeEach(() => {
    workspaceId = createWorkspace().id;
    workspaceMemberToBeUpdate = createWorkspaceMember({ role: 'member' });
    newRole = 'admin';
    updatedWorkspaceMember = createWorkspaceMember({ role: 'admin' });
    useCaseResponse = {
      ...updatedWorkspaceMember,
      name: updatedWorkspaceMember.user.name,
    };
    delete useCaseResponse.user;

    mockWorkspaceMemberRepository = {
      updateRole: jest.fn().mockResolvedValue([1, [updatedWorkspaceMember]]),
    };

    updateRoleUseCase = new UpdateRoleUseCase({
      workspaceMemberRepository: mockWorkspaceMemberRepository,
    });
  });

  test('It should return a successfully updated workspace member', async () => {
    const result = await updateRoleUseCase.execute(
      workspaceId,
      workspaceMemberToBeUpdate,
      newRole,
    );

    expect(mockWorkspaceMemberRepository.updateRole).toHaveBeenCalledWith(
      workspaceMemberToBeUpdate.id,
      newRole,
    );
    expect(result).toMatchObject(useCaseResponse);
  });

  test('It should return an error because workspaceId was not provided', async () => {
    try {
      await updateRoleUseCase.execute(
        undefined,
        workspaceMemberToBeUpdate,
        newRole,
      );

      expect(mockWorkspaceMemberRepository.updateRole).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because workspaceMemberToBeUpdate was not provided', async () => {
    try {
      await updateRoleUseCase.execute(workspaceId, undefined, newRole);

      expect(mockWorkspaceMemberRepository.updateRole).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because newRole was not provided', async () => {
    try {
      await updateRoleUseCase.execute(
        workspaceId,
        workspaceMemberToBeUpdate,
        undefined,
      );

      expect(mockWorkspaceMemberRepository.updateRole).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because the member to be updated does not belong to the workspace', async () => {
    workspaceMemberToBeUpdate.workspaceId = 'incorrect-uuid';
    try {
      await updateRoleUseCase.execute(
        workspaceId,
        workspaceMemberToBeUpdate,
        newRole,
      );

      expect(mockWorkspaceMemberRepository.updateRole).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/does not belong to the workspace/);
    }
  });

  test('It should return an error because the newRole is owner', async () => {
    newRole = 'owner';
    try {
      await updateRoleUseCase.execute(
        workspaceId,
        workspaceMemberToBeUpdate,
        newRole,
      );

      expect(mockWorkspaceMemberRepository.updateRole).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/The owner role cannot be set/);
    }
  });

  test('It should return an error because the member to be updated is the owner', async () => {
    workspaceMemberToBeUpdate.role = 'owner';

    try {
      await updateRoleUseCase.execute(
        workspaceId,
        workspaceMemberToBeUpdate,
        newRole,
      );

      expect(mockWorkspaceMemberRepository.updateRole).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/You cannot change the owner's role/);
    }
  });

  test('It should return an error because the member being updated already has the newRole', async () => {
    newRole = 'member';

    try {
      await updateRoleUseCase.execute(
        workspaceId,
        workspaceMemberToBeUpdate,
        newRole,
      );

      expect(mockWorkspaceMemberRepository.updateRole).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/already has this role/);
    }
  });

  test('It should return an empty array because the updateRole operation to the db failed', async () => {
    mockWorkspaceMemberRepository.updateRole.mockResolvedValue([0, []]);
    try {
      await updateRoleUseCase.execute(
        workspaceId,
        workspaceMemberToBeUpdate,
        newRole,
      );

      expect(mockWorkspaceMemberRepository.updateRole).toHaveBeenCalledTimes(1);
    } catch (error) {
      expect(error.message).toMatch(/Something went wrong/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
