/* eslint-disable no-param-reassign */
const GetProjectMembersByProjectUseCase = require('../../../api/src/application/use-cases/project-member/GetProjectMembersByProjectUseCase');
const ProjectMemberDto = require('../../../api/src/application/dtos/projectMember.dto');
const {
  createProjectMember,
  createAnotherProjectMember,
} = require('../../fake-data/fake-entities');

describe('GetProjectMembersByProjectUseCase', () => {
  let projectId;
  let projectMembers;
  let useCaseResponse;
  let mockProjectMemberRepository;
  let getProjectMembersByProjectUseCase;

  beforeEach(() => {
    projectId = createProjectMember().projectId;
    projectMembers = [createProjectMember(), createAnotherProjectMember()];
    useCaseResponse = [...projectMembers];

    mockProjectMemberRepository = {
      findAllByProject: jest.fn().mockResolvedValue(projectMembers),
    };

    getProjectMembersByProjectUseCase = new GetProjectMembersByProjectUseCase({
      projectMemberRepository: mockProjectMemberRepository,
    });
  });

  test('It should return a list of project members', async () => {
    const result = await getProjectMembersByProjectUseCase.execute(projectId);

    expect(mockProjectMemberRepository.findAllByProject).toHaveBeenCalledWith(
      projectId,
    );
    expect(result).toMatchObject(
      useCaseResponse.map((pm) => new ProjectMemberDto(pm)),
    );
  });

  test('It should return an error because projectId was not provided', async () => {
    try {
      await getProjectMembersByProjectUseCase.execute(undefined);
    } catch (error) {
      expect(
        mockProjectMemberRepository.findAllByProject,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty array because the findAllByProject operation to the db does not find anything', async () => {
    mockProjectMemberRepository.findAllByProject.mockResolvedValue([]);

    const result = await getProjectMembersByProjectUseCase.execute(projectId);

    expect(mockProjectMemberRepository.findAllByProject).toHaveBeenCalledTimes(
      1,
    );
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
