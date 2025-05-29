const GetAllCardInformationUseCase = require('../../../api/src/application/use-cases/card/GetAllCardInformationUseCase');
const CardDto = require('../../../api/src/application/dtos/card.dto');
const {
  createCard,
  createProjectMember,
  createCardMember,
  createWorkspaceMember,
  createUser,
  createList,
  createProject,
  createLabel,
  createLabelByCard,
  createCardAttachment,
  createChecklist,
  createChecklistItem,
} = require('../../fake-data/fake-entities');

describe('GetAllCardInformationUseCase', () => {
  let listId;
  let cardId;
  let dbResponse;
  let mockCardRepository;
  let findAllCardInformation;

  beforeEach(() => {
    listId = createCard().listId;
    cardId = createCard().id;
    dbResponse = {
      ...createCard(),
      members: [
        {
          ...createProjectMember(),
          CardMember: createCardMember(),
          workspaceMember: createWorkspaceMember({ user: createUser() }),
        },
        {
          ...createProjectMember(),
          CardMember: createCardMember(),
          workspaceMember: createWorkspaceMember({ user: createUser() }),
        },
      ],
      list: {
        ...createList(),
        project: createProject(),
        labels: [
          {
            ...createLabel(),
            cards: [
              { ...createCard(), CardLabel: createLabelByCard() },
              { ...createCard(), CardLabel: createLabelByCard() },
              { ...createCard(), CardLabel: createLabelByCard() },
            ],
          },
          {
            ...createLabel(),
            cards: [
              { ...createCard(), CardLabel: createLabelByCard() },
              { ...createCard(), CardLabel: createLabelByCard() },
              { ...createCard(), CardLabel: createLabelByCard() },
            ],
          },
          {
            ...createLabel(),
            cards: [
              { ...createCard(), CardLabel: createLabelByCard() },
              { ...createCard(), CardLabel: createLabelByCard() },
              { ...createCard(), CardLabel: createLabelByCard() },
            ],
          },
        ],
        attachments: [createCardAttachment(), createCardAttachment()],
        checklists: [
          {
            ...createChecklist(),
            items: [
              {
                ...createChecklistItem,
                members: [
                  {
                    ...createProjectMember().id,
                    workspaceMember: createWorkspaceMember({
                      user: createUser(),
                    }),
                  },
                  {
                    ...createProjectMember().id,
                    workspaceMember: createWorkspaceMember({
                      user: createUser(),
                    }),
                  },
                ],
              },
              {
                ...createChecklistItem,
                members: [
                  {
                    ...createProjectMember().id,
                    workspaceMember: createWorkspaceMember({
                      user: createUser(),
                    }),
                  },
                  {
                    ...createProjectMember().id,
                    workspaceMember: createWorkspaceMember({
                      user: createUser(),
                    }),
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    mockCardRepository = {
      findAllCardInformation: jest.fn().mockResolvedValue(dbResponse),
    };

    findAllCardInformation = new GetAllCardInformationUseCase({
      cardRepository: mockCardRepository,
    });
  });

  test('It should return a card', async () => {
    const result = await findAllCardInformation.execute(listId, cardId);

    expect(mockCardRepository.findAllCardInformation).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(CardDto.withAllCardInformation(dbResponse));
  });

  test('It should return an error because the listId was not provided', async () => {
    await expect(findAllCardInformation.execute(null, cardId)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockCardRepository.findAllCardInformation).not.toHaveBeenCalled();
  });

  test('It should return an error because the cardId was not provided', async () => {
    await expect(findAllCardInformation.execute(listId, null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockCardRepository.findAllCardInformation).not.toHaveBeenCalled();
  });

  test('It should return an empty object because the db operation did not find anything', async () => {
    mockCardRepository.findAllCardInformation.mockResolvedValue({});

    const result = await findAllCardInformation.execute(listId, cardId);
    expect(mockCardRepository.findAllCardInformation).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
