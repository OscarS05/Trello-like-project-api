const GetAllItemMembersUseCase = require('../../../api/src/application/use-cases/checklist-item-member/GetAllItemMembersUseCase');
const ChecklistItemMemberDto = require('../../../api/src/application/dtos/checklist-item-member.dto');
const {
  createChecklistItem,
  createChecklistItemMember,
  createUser,
} = require('../../fake-data/fake-entities');

describe('GetAllItemMembersUseCase', () => {
  const fakeChecklistItemId = createChecklistItem().id;
  // const fakeChecklistItemMemberId = 'fake-uuid';

  let dbResponse;
  let mockChecklistItemMemberRepository;
  let getAllItemMembersUseCase;

  beforeEach(() => {
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
      findAll: jest.fn().mockResolvedValue(dbResponse),
    };

    getAllItemMembersUseCase = new GetAllItemMembersUseCase({
      checklistItemMemberRepository: mockChecklistItemMemberRepository,
    });
  });

  test('It should return a checklist item members', async () => {
    const result = await getAllItemMembersUseCase.execute(fakeChecklistItemId);

    expect(mockChecklistItemMemberRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(
      dbResponse.map((member) => new ChecklistItemMemberDto(member)),
    );
  });

  test('It should return an error because checklistItemId was not provided', async () => {
    await expect(getAllItemMembersUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockChecklistItemMemberRepository.findAll).not.toHaveBeenCalled();
  });

  test('It should return an empty array because the create operation did not find anything', async () => {
    mockChecklistItemMemberRepository.findAll.mockResolvedValue([]);

    const result = await getAllItemMembersUseCase.execute(fakeChecklistItemId);

    expect(mockChecklistItemMemberRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
