jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuid } = require('uuid');

const AddMemberToProjectUseCase = require('../../../api/src/application/use-cases/project-member/AddMemberToProjectUseCase');
const ProjectMemberDto = require('../../../api/src/application/dtos/projectMember.dto');
const { createAnotherProjectMember } = require('../../fake-data/fake-entities');

describe('AddMemberToProjectUseCase', () => {
  let projectId;
  let workspaceMemberId;
  let addedWorkspaceMember;
  let useCaseResponse;
  let mockProjectMemberRepository;
  let addMemberToProjectUseCase;

  beforeEach(() => {
    projectId = createAnotherProjectMember().projectId;
    workspaceMemberId = createAnotherProjectMember().workspaceMemberId;
    addedWorkspaceMember = createAnotherProjectMember({ role: 'member' });
    uuid.mockReturnValue(addedWorkspaceMember.id);

    useCaseResponse = { ...addedWorkspaceMember };

    mockProjectMemberRepository = {
      create: jest.fn().mockResolvedValue(addedWorkspaceMember),
    };

    addMemberToProjectUseCase = new AddMemberToProjectUseCase({
      projectMemberRepository: mockProjectMemberRepository,
    });
  });

  test('It should return a successfully added project member', async () => {
    const result = await addMemberToProjectUseCase.execute(
      projectId,
      workspaceMemberId,
    );

    expect(mockProjectMemberRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId,
        workspaceMemberId,
      }),
    );
    expect(uuid).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new ProjectMemberDto(useCaseResponse));
  });

  test('It should return an error because projectId was not provided', async () => {
    try {
      await addMemberToProjectUseCase.execute(undefined, workspaceMemberId);

      expect(mockProjectMemberRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because workspaceMemberId of the member to be added was not provided', async () => {
    try {
      await addMemberToProjectUseCase.execute(projectId, undefined);

      expect(mockProjectMemberRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because the db return an empty object because the create operation to the db failed', async () => {
    mockProjectMemberRepository.create.mockResolvedValue({});
    try {
      await addMemberToProjectUseCase.execute(projectId, workspaceMemberId);

      expect(mockProjectMemberRepository.create).toHaveBeenCalledTimes(1);
    } catch (error) {
      expect(error.message).toMatch(/Something went wrong/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
