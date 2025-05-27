const RemoveMemberUseCase = require('../../../api/src/application/use-cases/project-member/RemoveMemberUseCase');
const {
  createProjectMember,
  createAnotherProjectMember,
} = require('../../fake-data/fake-entities');

describe('RemoveMemberUseCase', () => {
  let requesterAsProjectMember;
  let projectMemberToBeRemoved;
  let projectMembers;
  let mockProjectMemberRepository;
  let mockProjectRepository;
  let removeMemberUseCase;

  beforeEach(() => {
    requesterAsProjectMember = createProjectMember();
    projectMemberToBeRemoved = createAnotherProjectMember();
    projectMembers = [createProjectMember(), createAnotherProjectMember()];

    mockProjectMemberRepository = {
      transferOwnership: jest.fn().mockResolvedValue(1),
      delete: jest.fn().mockResolvedValue(1),
    };

    mockProjectRepository = {
      delete: jest.fn().mockResolvedValue(1),
    };

    removeMemberUseCase = new RemoveMemberUseCase({
      projectMemberRepository: mockProjectMemberRepository,
      projectRepository: mockProjectRepository,
    });
  });

  test('case 1: requester and memberToBeRemoved have NOT the same id(requester has permissions to remove an admin or member). It should return a successful 1', async () => {
    const result = await removeMemberUseCase.execute(
      requesterAsProjectMember,
      projectMemberToBeRemoved,
      projectMembers,
    );

    expect(mockProjectMemberRepository.delete).toHaveBeenCalledWith(
      projectMemberToBeRemoved.id,
    );
    expect(
      mockProjectMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
    expect(result).toBe(1);
  });

  test('case 2: Requester(NOT owner) want to leave to the project. It should remove him/her returning an 1.', async () => {
    requesterAsProjectMember.role = 'member';
    projectMemberToBeRemoved = requesterAsProjectMember;

    const result = await removeMemberUseCase.execute(
      requesterAsProjectMember,
      projectMemberToBeRemoved,
      projectMembers,
    );

    expect(mockProjectMemberRepository.delete).toHaveBeenCalledWith(
      projectMemberToBeRemoved.id,
    );
    expect(
      mockProjectMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
    expect(result).toBe(1);
  });

  test('case 3: Requester(IS owner) want to leave to the project. It should trasnfer the ownership and remove him/her returning an 1.', async () => {
    projectMemberToBeRemoved = requesterAsProjectMember;

    const result = await removeMemberUseCase.execute(
      requesterAsProjectMember,
      projectMemberToBeRemoved,
      projectMembers,
    );

    expect(mockProjectMemberRepository.delete).toHaveBeenCalledWith(
      projectMemberToBeRemoved.id,
    );
    expect(mockProjectMemberRepository.transferOwnership).toHaveBeenCalledWith(
      projectMemberToBeRemoved.projectId,
      requesterAsProjectMember,
      projectMembers[1], // Assuming the second member is the new owner
    );
    expect(result).toBe(1);
  });

  test('case 4: Requester(IS owner) want to leave to the project without other members. It only should delete the project returning an 1', async () => {
    projectMemberToBeRemoved = requesterAsProjectMember;
    projectMembers = [projectMemberToBeRemoved]; // Only one member in the project

    const result = await removeMemberUseCase.execute(
      requesterAsProjectMember,
      projectMemberToBeRemoved,
      projectMembers,
    );

    expect(mockProjectRepository.delete).toHaveBeenCalledWith(
      projectMemberToBeRemoved.projectId,
    );
    expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
    expect(
      mockProjectMemberRepository.transferOwnership,
    ).not.toHaveBeenCalled();
    expect(result).toBe(1);
  });

  test('It should return an error because requester was not provided', async () => {
    try {
      await removeMemberUseCase.execute(
        {},
        projectMemberToBeRemoved,
        projectMembers,
      );
    } catch (error) {
      expect(mockProjectRepository.delete).not.toHaveBeenCalled();
      expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
      expect(
        mockProjectMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because MemberToBeRemoved was not provided', async () => {
    try {
      await removeMemberUseCase.execute(
        requesterAsProjectMember,
        {},
        projectMembers,
      );
    } catch (error) {
      expect(mockProjectRepository.delete).not.toHaveBeenCalled();
      expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
      expect(
        mockProjectMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because projectMembers is a empty array', async () => {
    try {
      await removeMemberUseCase.execute(
        requesterAsProjectMember,
        projectMemberToBeRemoved,
        [],
      );
    } catch (error) {
      expect(mockProjectRepository.delete).not.toHaveBeenCalled();
      expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
      expect(
        mockProjectMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch(/invalid|Invalid/);
    }
  });

  test('It should return an error because requester with admin role cannot remove the owner', async () => {
    requesterAsProjectMember.role = 'admin';
    projectMemberToBeRemoved.role = 'owner';

    try {
      await removeMemberUseCase.execute(
        requesterAsProjectMember,
        projectMemberToBeRemoved,
        projectMembers,
      );
    } catch (error) {
      expect(mockProjectRepository.delete).not.toHaveBeenCalled();
      expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
      expect(
        mockProjectMemberRepository.transferOwnership,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch('You cannot remove the owner');
    }
  });

  test('It should return an error because the transferOwnership operation failed', async () => {
    mockProjectMemberRepository.transferOwnership.mockResolvedValue(
      new Error('Something went wrong'),
    );
    try {
      await removeMemberUseCase.execute(
        requesterAsProjectMember,
        projectMemberToBeRemoved,
        projectMembers,
      );
    } catch (error) {
      expect(mockProjectRepository.delete).not.toHaveBeenCalled();
      expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
      expect(
        mockProjectMemberRepository.transferOwnership,
      ).toHaveBeenCalledTimes(1);
      expect(error.message).toMatch(/Something/);
    }
  });

  test('It should return an error because the delete project operation failed', async () => {
    mockProjectRepository.delete.mockResolvedValue(0);
    try {
      await removeMemberUseCase.execute(
        requesterAsProjectMember,
        projectMemberToBeRemoved,
        projectMembers,
      );
    } catch (error) {
      expect(mockProjectRepository.delete).not.toHaveBeenCalled();
      expect(mockProjectMemberRepository.delete).not.toHaveBeenCalled();
      expect(
        mockProjectMemberRepository.transferOwnership,
      ).toHaveBeenCalledTimes(1);
      expect(error.message).toMatch(/Something went wrong/);
    }
  });

  test('It should return an error because the delete projectMember operation failed', async () => {
    mockProjectMemberRepository.delete.mockResolvedValue(0);

    try {
      await removeMemberUseCase.execute(
        requesterAsProjectMember,
        projectMemberToBeRemoved,
        projectMembers,
      );
    } catch (error) {
      expect(mockProjectRepository.delete).not.toHaveBeenCalled();
      expect(
        mockProjectMemberRepository.transferOwnership,
      ).toHaveBeenCalledTimes(0);
      expect(mockProjectMemberRepository.delete).toHaveBeenCalledTimes(1);
      expect(error.message).toMatch(/Something went wrong/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
