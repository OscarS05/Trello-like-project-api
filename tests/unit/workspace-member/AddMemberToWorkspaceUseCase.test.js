jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuid } = require('uuid');

const AddMemberToWorkspaceUseCase = require('../../../api/src/application/use-cases/workspace-member/AddMemberToWorkspaceUseCase');
const {
  createWorkspace,
  createWorkspaceMember,
} = require('../../fake-data/fake-entities');

describe('AddMemberToWorkspaceUseCase', () => {
  let workspaceId;
  let userIdOfMemberToBeAdded;
  let addedWorkspaceMember;
  let useCaseResponse;
  let mockWorkspaceMemberRepository;
  let addMemberToWorkspaceUseCase;

  beforeEach(() => {
    workspaceId = createWorkspace().id;
    userIdOfMemberToBeAdded = createWorkspaceMember().userId;
    addedWorkspaceMember = createWorkspaceMember({ role: 'member' });
    uuid.mockReturnValue(addedWorkspaceMember.id);

    useCaseResponse = {
      ...addedWorkspaceMember,
      name: addedWorkspaceMember.user.name,
    };
    delete useCaseResponse.user;

    mockWorkspaceMemberRepository = {
      create: jest.fn().mockResolvedValue(addedWorkspaceMember),
    };

    addMemberToWorkspaceUseCase = new AddMemberToWorkspaceUseCase({
      workspaceMemberRepository: mockWorkspaceMemberRepository,
    });
  });

  test('It should return a successfully added workspace member', async () => {
    const result = await addMemberToWorkspaceUseCase.execute(
      workspaceId,
      userIdOfMemberToBeAdded,
    );

    expect(mockWorkspaceMemberRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceId,
        userId: userIdOfMemberToBeAdded,
      }),
    );
    expect(uuid).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(useCaseResponse);
  });

  test('It should return an error because workspaceId was not provided', async () => {
    try {
      await addMemberToWorkspaceUseCase.execute(
        undefined,
        userIdOfMemberToBeAdded,
      );

      expect(mockWorkspaceMemberRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because userId of the member to be added was not provided', async () => {
    try {
      await addMemberToWorkspaceUseCase.execute(
        userIdOfMemberToBeAdded,
        undefined,
      );

      expect(mockWorkspaceMemberRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty array because the create operation to the db failed', async () => {
    mockWorkspaceMemberRepository.create.mockResolvedValue([]);
    try {
      await addMemberToWorkspaceUseCase.execute(
        workspaceId,
        userIdOfMemberToBeAdded,
      );

      expect(mockWorkspaceMemberRepository.create).toHaveBeenCalledTimes(1);
    } catch (error) {
      expect(error.message).toMatch(/Something went wrong/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
