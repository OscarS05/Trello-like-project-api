jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuid } = require('uuid');

const AddMemberToItemUseCase = require('../../../api/src/application/use-cases/checklist-item-member/AddMemberToItemUseCase');
const ChecklistItemMemberDto = require('../../../api/src/application/dtos/checklist-item-member.dto');
const {
  createChecklistItem,
  createChecklistItemMember,
} = require('../../fake-data/fake-entities');

describe('AddMemberToItemUseCase', () => {
  const fakeChecklistItemId = createChecklistItem().id;
  const fakeChecklistItemMemberId = 'fake-uuid';

  let availableMembersToBeAddedIds;
  let createdChecklistItemMembers;
  let mockChecklistItemMemberRepository;
  let addMemberToItemUseCase;

  beforeAll(() => {
    uuid.mockReturnValue(fakeChecklistItemMemberId);
  });

  beforeEach(() => {
    availableMembersToBeAddedIds = [createChecklistItemMember()];

    createdChecklistItemMembers = [
      createChecklistItemMember({ id: fakeChecklistItemMemberId }),
    ];

    mockChecklistItemMemberRepository = {
      bulkCreate: jest.fn().mockResolvedValue(createdChecklistItemMembers),
    };

    addMemberToItemUseCase = new AddMemberToItemUseCase({
      checklistItemMemberRepository: mockChecklistItemMemberRepository,
    });
  });

  test('It should return a created checklist item member', async () => {
    const result = await addMemberToItemUseCase.execute(
      fakeChecklistItemId,
      availableMembersToBeAddedIds,
    );

    expect(mockChecklistItemMemberRepository.bulkCreate).toHaveBeenCalledTimes(
      1,
    );
    expect(result).toMatchObject(
      createdChecklistItemMembers.map(
        (member) => new ChecklistItemMemberDto(member),
      ),
    );
  });

  test('It should return an error because checklistItemId was not provided', async () => {
    await expect(
      addMemberToItemUseCase.execute(null, availableMembersToBeAddedIds),
    ).rejects.toThrow(/was not provided/);
    expect(mockChecklistItemMemberRepository.bulkCreate).not.toHaveBeenCalled();
  });

  test('It should return an error because availableMembersToBeAddedIds is an empty array', async () => {
    const result = await addMemberToItemUseCase.execute(
      fakeChecklistItemId,
      [],
    );
    expect(mockChecklistItemMemberRepository.bulkCreate).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  test('It should return an empty array because the create operation failed', async () => {
    mockChecklistItemMemberRepository.bulkCreate.mockResolvedValue([]);

    const result = await addMemberToItemUseCase.execute(
      fakeChecklistItemId,
      availableMembersToBeAddedIds,
    );

    expect(mockChecklistItemMemberRepository.bulkCreate).toHaveBeenCalledTimes(
      1,
    );
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
