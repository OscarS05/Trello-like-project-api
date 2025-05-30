const GetAllByProjectMemberUseCase = require('../../../api/src/application/use-cases/checklist-item-member/GetAllByProjectMemberUseCase');
const ChecklistItemMemberDto = require('../../../api/src/application/dtos/checklist-item-member.dto');
const {
  createChecklistItem,
  createChecklistItemMember,
  createProjectMember,
} = require('../../fake-data/fake-entities');

describe('GetAllByProjectMemberUseCase', () => {
  const fakeChecklistItemId = createChecklistItem().id;
  // const fakeChecklistItemMemberId = 'fake-uuid';

  let fakeProjectMemberIds;
  let dbResponse;
  let mockChecklistItemMemberRepository;
  let getAllByProjectMemberUseCase;

  beforeEach(() => {
    fakeProjectMemberIds = [createProjectMember().id, createProjectMember().id];
    dbResponse = [createChecklistItemMember(), createChecklistItemMember()];

    mockChecklistItemMemberRepository = {
      findAllByProjectMember: jest.fn().mockResolvedValue(dbResponse),
    };

    getAllByProjectMemberUseCase = new GetAllByProjectMemberUseCase({
      checklistItemMemberRepository: mockChecklistItemMemberRepository,
    });
  });

  test('It should return a checklist item members', async () => {
    const result = await getAllByProjectMemberUseCase.execute(
      fakeChecklistItemId,
      fakeProjectMemberIds,
    );

    expect(
      mockChecklistItemMemberRepository.findAllByProjectMember,
    ).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(
      dbResponse.map((member) => new ChecklistItemMemberDto(member)),
    );
  });

  test('It should return an error because ProjectMemberIds was not provided', async () => {
    await expect(
      getAllByProjectMemberUseCase.execute(null, fakeProjectMemberIds),
    ).rejects.toThrow(/was not provided/);
    expect(
      mockChecklistItemMemberRepository.findAllByProjectMember,
    ).not.toHaveBeenCalled();
  });

  test('It should return an error because ProjectMemberIds was not provided', async () => {
    await expect(
      getAllByProjectMemberUseCase.execute(fakeChecklistItemId, {}),
    ).rejects.toThrow(/was not provided/);
    expect(
      mockChecklistItemMemberRepository.findAllByProjectMember,
    ).not.toHaveBeenCalled();
  });

  test('It should return an error because ProjectMemberIds was not provided', async () => {
    const result = await getAllByProjectMemberUseCase.execute(
      fakeChecklistItemId,
      [],
    );

    expect(
      mockChecklistItemMemberRepository.findAllByProjectMember,
    ).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  test('It should return an empty array because the create operation did not find anything', async () => {
    mockChecklistItemMemberRepository.findAllByProjectMember.mockResolvedValue(
      [],
    );

    const result = await getAllByProjectMemberUseCase.execute(
      fakeChecklistItemId,
      fakeProjectMemberIds,
    );

    expect(
      mockChecklistItemMemberRepository.findAllByProjectMember,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
