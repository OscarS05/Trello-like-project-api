const GetAllMembersByIdUseCase = require('../../../api/src/application/use-cases/project-member/GetAllMembersByIdUseCase');
const ProjectMemberDto = require('../../../api/src/application/dtos/projectMember.dto');
const {
  createProjectMember,
  createAnotherProjectMember,
} = require('../../fake-data/fake-entities');

describe('GetAllMembersByIdUseCase', () => {
  let projectMembersIds;
  let projectId;
  let projectMembers;
  let useCaseResponse;
  let mockProjectMemberRepository;
  let getAllMembersByIdUseCase;

  beforeEach(() => {
    projectMembersIds = [
      createProjectMember().id,
      createAnotherProjectMember().id,
    ];
    projectId = createProjectMember().projectId;
    projectMembers = [createProjectMember(), createAnotherProjectMember()];
    useCaseResponse = [...projectMembers];

    mockProjectMemberRepository = {
      findAllById: jest.fn().mockResolvedValue(projectMembers),
    };

    getAllMembersByIdUseCase = new GetAllMembersByIdUseCase({
      projectMemberRepository: mockProjectMemberRepository,
    });
  });

  test('It should return a list of project members', async () => {
    const result = await getAllMembersByIdUseCase.execute(
      projectMembersIds,
      projectId,
    );

    expect(mockProjectMemberRepository.findAllById).toHaveBeenCalledWith(
      projectMembersIds,
      projectId,
    );
    expect(result).toMatchObject(
      useCaseResponse.map((pm) => new ProjectMemberDto(pm)),
    );
  });

  test('It should return an error because projectMembersIds was not provided', async () => {
    try {
      await getAllMembersByIdUseCase.execute(null, projectId);
    } catch (error) {
      expect(mockProjectMemberRepository.findAllById).not.toHaveBeenCalled();
      expect(error.message).toMatch('There are no project member ids');
    }
  });

  test('It should return an error because projectId was not provided', async () => {
    try {
      await getAllMembersByIdUseCase.execute(projectMembersIds, null);
    } catch (error) {
      expect(mockProjectMemberRepository.findAllById).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty array because the findAllById operation to the db does not find anything', async () => {
    mockProjectMemberRepository.findAllById.mockResolvedValue([]);

    const result = await getAllMembersByIdUseCase.execute(
      projectMembersIds,
      projectId,
    );

    expect(mockProjectMemberRepository.findAllById).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
