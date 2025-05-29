jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuid } = require('uuid');

const AddMemberToCardUseCase = require('../../../api/src/application/use-cases/card-member/AddMemberToCardUseCase');
const CardMemberDto = require('../../../api/src/application/dtos/card-member.dto');
const { createCardMember } = require('../../fake-data/fake-entities');

describe('AddMemberToCardUseCase', () => {
  let cardId;
  let projectMemberId;
  let dbResponse;
  let mockCardMemberRepository;
  let addMemberToCardUseCase;

  beforeEach(() => {
    cardId = createCardMember().cardId;
    projectMemberId = createCardMember().projectMemberId;
    dbResponse = createCardMember();
    uuid.mockReturnValue(dbResponse.id);

    mockCardMemberRepository = {
      create: jest.fn().mockResolvedValue(dbResponse),
    };

    addMemberToCardUseCase = new AddMemberToCardUseCase({
      cardMemberRepository: mockCardMemberRepository,
    });
  });

  test('It should return a successfully added project member', async () => {
    const result = await addMemberToCardUseCase.execute(
      cardId,
      projectMemberId,
    );

    expect(mockCardMemberRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        cardId,
        projectMemberId,
      }),
    );
    expect(uuid).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new CardMemberDto(dbResponse));
  });

  test('It should return an error because cardId was not provided', async () => {
    await expect(
      addMemberToCardUseCase.execute(null, projectMemberId),
    ).rejects.toThrow(/was not provided/);

    expect(mockCardMemberRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because projectMemberId was not provided', async () => {
    await expect(addMemberToCardUseCase.execute(cardId, null)).rejects.toThrow(
      /was not provided/,
    );

    expect(mockCardMemberRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the db return an empty object because the create operation to the db failed', async () => {
    mockCardMemberRepository.create.mockResolvedValue({});

    await expect(
      addMemberToCardUseCase.execute(cardId, projectMemberId),
    ).rejects.toThrow(/Something went wrong/);

    expect(mockCardMemberRepository.create).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
