const DeleteCardMemberUseCase = require('../../../api/src/application/use-cases/card-member/DeleteCardMemberUseCase');
const { createCardMember } = require('../../fake-data/fake-entities');

describe('DeleteCardMemberUseCase', () => {
  let cardId;
  let cardMemberId;
  let mockCardMemberRepository;
  let deleteCardMemberUseCase;

  beforeEach(() => {
    cardId = createCardMember().cardId;
    cardMemberId = createCardMember().id;

    mockCardMemberRepository = {
      delete: jest.fn().mockResolvedValue(1),
    };

    deleteCardMemberUseCase = new DeleteCardMemberUseCase({
      cardMemberRepository: mockCardMemberRepository,
    });
  });

  test('It should return a card member', async () => {
    const result = await deleteCardMemberUseCase.execute(cardId, cardMemberId);

    expect(mockCardMemberRepository.delete).toHaveBeenCalledWith(
      cardId,
      cardMemberId,
    );
    expect(result).toBe(1);
  });

  test('It should return an error because cardId was not provided', async () => {
    await expect(
      deleteCardMemberUseCase.execute(null, cardMemberId),
    ).rejects.toThrow(/was not provided/);

    expect(mockCardMemberRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an error because cardMemberId was not provided', async () => {
    await expect(deleteCardMemberUseCase.execute(cardId, null)).rejects.toThrow(
      /was not provided/,
    );

    expect(mockCardMemberRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an empty object because the delete operation to the db failed', async () => {
    mockCardMemberRepository.delete.mockResolvedValue(0);

    await expect(
      deleteCardMemberUseCase.execute(cardId, cardMemberId),
    ).rejects.toThrow(/Something went wrong/);
    expect(mockCardMemberRepository.delete).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
