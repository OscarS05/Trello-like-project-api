const CheckProjectMemberByCardAndList = require('../../../api/src/application/use-cases/card/CheckProjectMemberByCardAndList');
const CardDto = require('../../../api/src/application/dtos/card.dto');
const {
  createCard,
  createProjectMember,
} = require('../../fake-data/fake-entities');

describe('CheckProjectMemberByCardAndList', () => {
  let userId;
  let listId;
  let cardId;
  let dbResponse;
  let mockCardRepository;
  let checkProjectMemberByCardAndList;

  beforeEach(() => {
    userId = createProjectMember().userId;
    listId = createCard().listId;
    cardId = createCard().id;
    dbResponse = createCard();

    mockCardRepository = {
      checkProjectMemberByCardAndList: jest.fn().mockResolvedValue(dbResponse),
    };

    checkProjectMemberByCardAndList = new CheckProjectMemberByCardAndList({
      cardRepository: mockCardRepository,
    });
  });

  test('It should return a card', async () => {
    const result = await checkProjectMemberByCardAndList.execute(
      userId,
      cardId,
      listId,
    );

    expect(
      mockCardRepository.checkProjectMemberByCardAndList,
    ).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new CardDto(dbResponse));
  });

  test('It should return an error because the userId was not provided', async () => {
    await expect(
      checkProjectMemberByCardAndList.execute(undefined, cardId, listId),
    ).rejects.toThrow(/was not provided/);
    expect(
      mockCardRepository.checkProjectMemberByCardAndList,
    ).not.toHaveBeenCalled();
  });

  test('It should return an error because the listId was not provided', async () => {
    await expect(
      checkProjectMemberByCardAndList.execute(userId, cardId, null),
    ).rejects.toThrow(/was not provided/);
    expect(
      mockCardRepository.checkProjectMemberByCardAndList,
    ).not.toHaveBeenCalled();
  });

  test('It should return an error because the cardId was not provided', async () => {
    await expect(
      checkProjectMemberByCardAndList.execute(userId, undefined, listId),
    ).rejects.toThrow(/was not provided/);
    expect(
      mockCardRepository.checkProjectMemberByCardAndList,
    ).not.toHaveBeenCalled();
  });

  test('It should return an empty object because the operation db failed', async () => {
    mockCardRepository.checkProjectMemberByCardAndList.mockResolvedValue({});

    const result = await checkProjectMemberByCardAndList.execute(
      userId,
      cardId,
      listId,
    );
    expect(
      mockCardRepository.checkProjectMemberByCardAndList,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
