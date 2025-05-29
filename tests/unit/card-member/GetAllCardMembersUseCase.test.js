const GetAllCardMembersUseCase = require('../../../api/src/application/use-cases/card-member/GetAllCardMembersUseCase');
const CardMemberDto = require('../../../api/src/application/dtos/card-member.dto');
const {
  createCardMember,
  createProjectMember,
  createWorkspaceMember,
  createUser,
} = require('../../fake-data/fake-entities');

describe('GetAllCardMembersUseCase', () => {
  let cardId;
  let dbResponse;
  let mockCardMemberRepository;
  let getAllCardMembersUseCase;

  beforeEach(() => {
    cardId = createCardMember().cardId;
    dbResponse = [
      {
        ...createCardMember(),
        projectMember: {
          id: createProjectMember().id,
          workspaceMember: {
            id: createWorkspaceMember().id,
            user: createUser(),
          },
        },
      },
      {
        ...createCardMember(),
        projectMember: {
          id: createProjectMember().id,
          workspaceMember: {
            id: createWorkspaceMember().id,
            user: createUser(),
          },
        },
      },
    ];

    mockCardMemberRepository = {
      findAll: jest.fn().mockResolvedValue(dbResponse),
    };

    getAllCardMembersUseCase = new GetAllCardMembersUseCase({
      cardMemberRepository: mockCardMemberRepository,
    });
  });

  test('It should return a list of card members', async () => {
    const result = await getAllCardMembersUseCase.execute(cardId);

    expect(mockCardMemberRepository.findAll).toHaveBeenCalledWith(cardId);
    expect(result).toMatchObject(
      dbResponse.map((member) => new CardMemberDto(member)),
    );
  });

  test('It should return an error because cardId was not provided', async () => {
    await expect(getAllCardMembersUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );

    expect(mockCardMemberRepository.findAll).not.toHaveBeenCalled();
  });

  test('It should return an empty array because the the findAll operation to the db failed', async () => {
    mockCardMemberRepository.findAll.mockResolvedValue({});

    const result = await getAllCardMembersUseCase.execute(cardId);

    expect(mockCardMemberRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
