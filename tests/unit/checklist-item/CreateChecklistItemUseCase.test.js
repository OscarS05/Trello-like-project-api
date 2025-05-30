jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuid } = require('uuid');

const CreateChecklistItemUseCase = require('../../../api/src/application/use-cases/checklist-item/CreateChecklistItemUseCase');
const ChecklistItemDto = require('../../../api/src/application/dtos/checklist-item.dto');
const {
  createChecklistItem,
  createChecklistItemMember,
  createProjectMember,
  createAnotherProjectMember,
} = require('../../fake-data/fake-entities');

describe('CreateChecklistItemUseCase', () => {
  const fakeChecklistId = createChecklistItem().checklistId;
  const fakeChecklistItemId = createChecklistItem().id;
  const fakeChecklistItemMemberId = createChecklistItemMember().id;

  let checklistItemData;
  let createdChecklistItem;
  let createdChecklistItemMembers;
  let mockChecklistItemRepository;
  let mockChecklistItemMemberRepository;
  let createChecklistItemUseCase;

  beforeAll(() => {
    uuid
      .mockReturnValueOnce(fakeChecklistItemId)
      .mockReturnValueOnce(fakeChecklistItemMemberId);
  });

  beforeEach(() => {
    checklistItemData = {
      name: 'checklist name',
      checklistId: fakeChecklistId,
      dueDate: null,
      assignedProjectMemberIds: [
        createProjectMember().id,
        createAnotherProjectMember().id,
      ],
    };

    createdChecklistItem = createChecklistItem({ id: fakeChecklistItemId });
    createdChecklistItemMembers = [
      createChecklistItemMember({ id: fakeChecklistItemMemberId }),
      createChecklistItemMember({
        id: fakeChecklistItemMemberId,
        projectMemberId: checklistItemData.assignedProjectMemberIds[1],
      }),
    ];

    mockChecklistItemRepository = {
      create: jest.fn().mockResolvedValue(createdChecklistItem),
    };

    mockChecklistItemMemberRepository = {
      bulkCreate: jest.fn().mockResolvedValue(createdChecklistItemMembers),
    };

    createChecklistItemUseCase = new CreateChecklistItemUseCase({
      checklistItemRepository: mockChecklistItemRepository,
      checklistItemMemberRepository: mockChecklistItemMemberRepository,
    });
  });

  test('case 1: Create item with members. It should return a created checklist item with item members', async () => {
    const result = await createChecklistItemUseCase.execute(checklistItemData);

    expect(mockChecklistItemRepository.create).toHaveBeenCalledTimes(1);
    expect(mockChecklistItemMemberRepository.bulkCreate).toHaveBeenCalledTimes(
      1,
    );
    expect(result).toMatchObject(
      new ChecklistItemDto({
        ...createdChecklistItem,
        assignedMembers: createdChecklistItemMembers,
      }),
    );
  });

  test('case 2: Create item WITHOUT members. It should return a created checklist item', async () => {
    delete checklistItemData.assignedProjectMemberIds;

    const result = await createChecklistItemUseCase.execute(checklistItemData);

    expect(mockChecklistItemRepository.create).toHaveBeenCalledTimes(1);
    expect(mockChecklistItemMemberRepository.bulkCreate).toHaveBeenCalledTimes(
      0,
    );
    expect(result).toMatchObject(
      new ChecklistItemDto({
        ...createdChecklistItem,
        assignedMembers: [],
      }),
    );
  });

  test('It should return an error because checklistId was not provided', async () => {
    checklistItemData.checklistId = null;

    await expect(
      createChecklistItemUseCase.execute(checklistItemData),
    ).rejects.toThrow(/was not provided/);
    expect(mockChecklistItemRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the create operation failed', async () => {
    mockChecklistItemRepository.create.mockResolvedValue({});

    await expect(
      createChecklistItemUseCase.execute(checklistItemData),
    ).rejects.toThrow(/Something went wrong/);

    expect(mockChecklistItemRepository.create).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
