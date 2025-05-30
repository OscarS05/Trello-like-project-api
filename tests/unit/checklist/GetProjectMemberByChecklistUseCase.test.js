const GetProjectMemberByChecklistUseCase = require('../../../api/src/application/use-cases/checklist/GetProjectMemberByChecklistUseCase');
const ProjectMemberDto = require('../../../api/src/application/dtos/projectMember.dto');
const {
  createChecklist,
  createCard,
  createList,
  createProjectMember,
} = require('../../fake-data/fake-entities');

describe('GetProjectMemberByChecklistUseCase', () => {
  let userId;
  let checklistId;
  let checklistDbResponse;
  let projectMemberDbResponse;
  let mockChecklistRepository;
  let mockProjectMemberRepository;
  let getProjectMemberByChecklistUseCase;

  beforeEach(() => {
    userId = 'fake-user-uuid';
    checklistId = 'fake-checklist-uuid';

    checklistDbResponse = {
      ...createChecklist(),
      card: { ...createCard(), list: { ...createList() } },
    };

    projectMemberDbResponse = createProjectMember();

    mockChecklistRepository = {
      findOneByIdWithData: jest.fn().mockResolvedValue(checklistDbResponse),
    };

    mockProjectMemberRepository = {
      checkProjectMemberByUser: jest
        .fn()
        .mockResolvedValue(projectMemberDbResponse),
    };

    getProjectMemberByChecklistUseCase = new GetProjectMemberByChecklistUseCase(
      {
        checklistRepository: mockChecklistRepository,
        projectMemberRepository: mockProjectMemberRepository,
      },
    );
  });

  test('It should return a project member', async () => {
    const result = await getProjectMemberByChecklistUseCase.execute(
      userId,
      checklistId,
    );

    expect(mockChecklistRepository.findOneByIdWithData).toHaveBeenCalledWith(
      checklistId,
    );

    expect(
      mockProjectMemberRepository.checkProjectMemberByUser,
    ).toHaveBeenCalledWith(userId, checklistDbResponse.card.list.projectId);
    expect(result).toMatchObject(new ProjectMemberDto(projectMemberDbResponse));
  });

  test('It should return an error because userId was not provided', async () => {
    userId = null;

    await expect(
      getProjectMemberByChecklistUseCase.execute(userId, checklistId),
    ).rejects.toThrow(/was not provided/);
    expect(mockChecklistRepository.findOneByIdWithData).not.toHaveBeenCalled();
  });

  test('It should return an error because checklistId was not provided', async () => {
    checklistId = null;

    await expect(
      getProjectMemberByChecklistUseCase.execute(userId, checklistId),
    ).rejects.toThrow(/was not provided/);
    expect(mockChecklistRepository.findOneByIdWithData).not.toHaveBeenCalled();
  });

  test('It should return an error because the find operation failed', async () => {
    mockChecklistRepository.findOneByIdWithData.mockResolvedValue({});

    await expect(
      getProjectMemberByChecklistUseCase.execute(userId, checklistId),
    ).rejects.toThrow(/was not found/);

    expect(mockChecklistRepository.findOneByIdWithData).toHaveBeenCalledTimes(
      1,
    );
    expect(
      mockProjectMemberRepository.checkProjectMemberByUser,
    ).toHaveBeenCalledTimes(0);
  });

  test('It should return an error because the find operation failed', async () => {
    mockProjectMemberRepository.checkProjectMemberByUser.mockResolvedValue({});

    const result = await getProjectMemberByChecklistUseCase.execute(
      userId,
      checklistId,
    );

    expect(mockChecklistRepository.findOneByIdWithData).toHaveBeenCalledTimes(
      1,
    );
    expect(
      mockProjectMemberRepository.checkProjectMemberByUser,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
