const GetItemMembersByIdsUseCase = require('../../../api/src/application/use-cases/checklist-item-member/GetItemMembersByIdsUseCase');
const ChecklistItemMemberDto = require('../../../api/src/application/dtos/checklist-item-member.dto');
const {
  createChecklistItem,
  createChecklistItemMember,
  createUser,
} = require('../../fake-data/fake-entities');

describe('GetItemMembersByIdsUseCase', () => {
  const fakeChecklistItemId = createChecklistItem().id;
  const fakeChecklistItemMemberId = 'fake-uuid';

  let checklistItemMemberIds;
  let dbResponse;
  let mockChecklistItemMemberRepository;
  let getItemMembersByIdsUseCase;

  beforeEach(() => {
    checklistItemMemberIds = [
      fakeChecklistItemMemberId,
      fakeChecklistItemMemberId,
    ];

    dbResponse = [
      {
        ...createChecklistItemMember(),
        projectMember: {
          id: 'pm-uuid',
          workspaceMember: { id: 'wm-uuid', user: createUser() },
        },
      },
      {
        ...createChecklistItemMember(),
        projectMember: {
          id: 'pm-uuid',
          workspaceMember: { id: 'wm-uuid', user: createUser() },
        },
      },
    ];

    mockChecklistItemMemberRepository = {
      getByIds: jest.fn().mockResolvedValue(dbResponse),
    };

    getItemMembersByIdsUseCase = new GetItemMembersByIdsUseCase({
      checklistItemMemberRepository: mockChecklistItemMemberRepository,
    });
  });

  test('It should return a checklist item members', async () => {
    const result = await getItemMembersByIdsUseCase.execute(
      fakeChecklistItemId,
      checklistItemMemberIds,
    );

    expect(mockChecklistItemMemberRepository.getByIds).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(
      dbResponse.map((member) => new ChecklistItemMemberDto(member)),
    );
  });

  test('It should return an error because checklistItemId was not provided', async () => {
    await expect(
      getItemMembersByIdsUseCase.execute(null, checklistItemMemberIds),
    ).rejects.toThrow(/was not provided/);
    expect(mockChecklistItemMemberRepository.getByIds).not.toHaveBeenCalled();
  });

  test('It should return an error because checklistItemMemberIds is an empty array', async () => {
    const result = await getItemMembersByIdsUseCase.execute(
      fakeChecklistItemId,
      [],
    );
    expect(mockChecklistItemMemberRepository.getByIds).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  test('It should return an empty array because the create operation did not find anything', async () => {
    mockChecklistItemMemberRepository.getByIds.mockResolvedValue([]);

    const result = await getItemMembersByIdsUseCase.execute(
      fakeChecklistItemId,
      checklistItemMemberIds,
    );

    expect(mockChecklistItemMemberRepository.getByIds).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
