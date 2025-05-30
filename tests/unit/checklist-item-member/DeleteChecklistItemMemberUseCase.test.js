const DeleteChecklistItemUseCase = require('../../../api/src/application/use-cases/checklist-item-member/DeleteChecklistItemUseCase');
const { createChecklistItem } = require('../../fake-data/fake-entities');

describe('DeleteChecklistItemUseCase', () => {
  const fakeChecklistItemId = createChecklistItem().id;
  const fakeProjectMemberId = 'fake-uuid';

  let mockChecklistItemMemberRepository;
  let deleteChecklistItemUseCase;

  beforeEach(() => {
    mockChecklistItemMemberRepository = {
      delete: jest.fn().mockResolvedValue(1),
    };

    deleteChecklistItemUseCase = new DeleteChecklistItemUseCase({
      checklistItemMemberRepository: mockChecklistItemMemberRepository,
    });
  });

  test('It should return a 1', async () => {
    const result = await deleteChecklistItemUseCase.execute(
      fakeChecklistItemId,
      fakeProjectMemberId,
    );

    expect(mockChecklistItemMemberRepository.delete).toHaveBeenCalledTimes(1);
    expect(result).toBe(1);
  });

  test('It should return an error because checklistItemId was not provided', async () => {
    await expect(
      deleteChecklistItemUseCase.execute(null, fakeProjectMemberId),
    ).rejects.toThrow(/was not provided/);
    expect(mockChecklistItemMemberRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an error because ProjectMemberId was not provided', async () => {
    await expect(
      deleteChecklistItemUseCase.execute(fakeChecklistItemId, null),
    ).rejects.toThrow(/was not provided/);
    expect(mockChecklistItemMemberRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an empty array because the create operation did not find anything', async () => {
    mockChecklistItemMemberRepository.delete.mockResolvedValue(0);

    await expect(
      deleteChecklistItemUseCase.execute(
        fakeChecklistItemId,
        fakeProjectMemberId,
      ),
    ).rejects.toThrow(/Something went wrong/);
    expect(mockChecklistItemMemberRepository.delete).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
