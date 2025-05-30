jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuid } = require('uuid');

const UpdateChecklistItemUseCase = require('../../../api/src/application/use-cases/checklist-item/UpdateChecklistItemUseCase');
const ChecklistItemDto = require('../../../api/src/application/dtos/checklist-item.dto');
const {
  createChecklistItem,
  createChecklistItemMember,
  createProjectMember,
  createAnotherProjectMember,
} = require('../../fake-data/fake-entities');

describe('UpdateChecklistItemUseCase', () => {
  const fakeChecklistItemId = createChecklistItem().id;
  const fakeChecklistItemMemberId = createChecklistItemMember().id;

  let checklistItemData;
  let updatedChecklistItem;
  let newChecklistItemMembers;
  let mockChecklistItemRepository;
  let mockChecklistItemMemberRepository;
  let updateChecklistItemUseCase;

  beforeAll(() => {
    uuid
      .mockReturnValueOnce(fakeChecklistItemId)
      .mockReturnValueOnce(fakeChecklistItemMemberId);
  });

  beforeEach(() => {
    checklistItemData = {
      name: 'checklist name',
      dueDate: null,
      assignedProjectMemberIds: [
        createProjectMember().id,
        createAnotherProjectMember().id,
      ],
    };

    updatedChecklistItem = createChecklistItem({
      id: fakeChecklistItemId,
      name: checklistItemData.name,
    });
    newChecklistItemMembers = [
      createChecklistItemMember({ id: fakeChecklistItemMemberId }),
      createChecklistItemMember({
        id: fakeChecklistItemMemberId,
        projectMemberId: checklistItemData.assignedProjectMemberIds[1],
      }),
    ];

    mockChecklistItemRepository = {
      update: jest.fn().mockResolvedValue([1, [updatedChecklistItem]]),
    };

    mockChecklistItemMemberRepository = {
      bulkCreate: jest.fn().mockResolvedValue(newChecklistItemMembers),
    };

    updateChecklistItemUseCase = new UpdateChecklistItemUseCase({
      checklistItemRepository: mockChecklistItemRepository,
      checklistItemMemberRepository: mockChecklistItemMemberRepository,
    });
  });

  test('case 1: Updating an item and adding members. It should return a updated checklist item with item members', async () => {
    const result = await updateChecklistItemUseCase.execute(
      fakeChecklistItemId,
      checklistItemData,
    );

    expect(mockChecklistItemRepository.update).toHaveBeenCalledTimes(1);
    expect(mockChecklistItemMemberRepository.bulkCreate).toHaveBeenCalledTimes(
      1,
    );
    expect(result).toMatchObject(
      new ChecklistItemDto({
        ...updatedChecklistItem,
        assignedMembers: newChecklistItemMembers,
      }),
    );
  });

  test('case 2: Updating item WITHOUT adding members. It should return a updated checklist item', async () => {
    delete checklistItemData.assignedProjectMemberIds;

    const result = await updateChecklistItemUseCase.execute(
      fakeChecklistItemId,
      checklistItemData,
    );

    expect(mockChecklistItemRepository.update).toHaveBeenCalledTimes(1);
    expect(mockChecklistItemMemberRepository.bulkCreate).toHaveBeenCalledTimes(
      0,
    );
    expect(result).toMatchObject(
      new ChecklistItemDto({
        ...updatedChecklistItem,
        assignedMembers: [],
      }),
    );
  });

  test('It should return an error because checklistItemId was not provided', async () => {
    // checklistItemId = null;

    await expect(
      updateChecklistItemUseCase.execute(null, checklistItemData),
    ).rejects.toThrow(/was not provided/);
    expect(mockChecklistItemRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because the update operation failed', async () => {
    mockChecklistItemRepository.update.mockResolvedValue([0, []]);

    await expect(
      updateChecklistItemUseCase.execute(
        fakeChecklistItemId,
        checklistItemData,
      ),
    ).rejects.toThrow(/Something went wrong/);

    expect(mockChecklistItemRepository.update).toHaveBeenCalledTimes(1);
    expect(mockChecklistItemMemberRepository.bulkCreate).toHaveBeenCalledTimes(
      0,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
