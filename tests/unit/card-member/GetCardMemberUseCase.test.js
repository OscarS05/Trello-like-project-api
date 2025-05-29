const GetCardMemberUseCase = require('../../../api/src/application/use-cases/card-member/GetCardMemberUseCase');
const CardMemberDto = require('../../../api/src/application/dtos/card-member.dto');
const {
  createCardMember,
  createProjectMember,
  createWorkspaceMember,
  createUser,
} = require('../../fake-data/fake-entities');

describe('GetCardMemberUseCase', () => {
  let cardId;
  let cardMemberId;
  let dbResponse;
  let mockCardMemberRepository;
  let getCardMemberUseCase;

  beforeEach(() => {
    cardId = createCardMember().cardId;
    cardMemberId = createCardMember().id;
    dbResponse = {
      ...createCardMember(),
      projectMember: {
        id: createProjectMember().id,
        workspaceMember: {
          id: createWorkspaceMember().id,
          user: createUser(),
        },
      },
    };

    mockCardMemberRepository = {
      findOne: jest.fn().mockResolvedValue(dbResponse),
    };

    getCardMemberUseCase = new GetCardMemberUseCase({
      cardMemberRepository: mockCardMemberRepository,
    });
  });

  test('It should return a card member', async () => {
    const result = await getCardMemberUseCase.execute(cardId, cardMemberId);

    expect(mockCardMemberRepository.findOne).toHaveBeenCalledWith(
      cardId,
      cardMemberId,
    );
    expect(result).toMatchObject(new CardMemberDto(dbResponse));
  });

  test('It should return an error because cardId was not provided', async () => {
    await expect(
      getCardMemberUseCase.execute(null, cardMemberId),
    ).rejects.toThrow(/was not provided/);

    expect(mockCardMemberRepository.findOne).not.toHaveBeenCalled();
  });

  test('It should return an error because cardMemberId was not provided', async () => {
    await expect(getCardMemberUseCase.execute(cardId, null)).rejects.toThrow(
      /was not provided/,
    );

    expect(mockCardMemberRepository.findOne).not.toHaveBeenCalled();
  });

  test('It should return an empty object because the findOne operation to the db failed', async () => {
    mockCardMemberRepository.findOne.mockResolvedValue({});

    const result = await getCardMemberUseCase.execute(cardId, cardMemberId);

    expect(mockCardMemberRepository.findOne).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
