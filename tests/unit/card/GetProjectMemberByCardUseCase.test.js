const GetProjectMemberByCardUseCase = require('../../../api/src/application/use-cases/card/GetProjectMemberByCardUseCase');
const ProjectMemberDto = require('../../../api/src/application/dtos/projectMember.dto');
const {
  createCard,
  createList,
  createProjectMember,
} = require('../../fake-data/fake-entities');

describe('GetProjectMemberByCardUseCase', () => {
  let userId;
  let cardId;
  let cardWithListDbResponse;
  let projectMemberDbResponse;
  let mockCardRepository;
  let mockProjectMemberRepository;
  let getProjectMemberByCardUseCase;

  beforeEach(() => {
    userId = createProjectMember().userId;
    cardId = createCard().id;
    cardWithListDbResponse = { ...createCard(), list: createList() };
    projectMemberDbResponse = createProjectMember();

    mockCardRepository = {
      findOneByIdWithList: jest.fn().mockResolvedValue(cardWithListDbResponse),
    };

    mockProjectMemberRepository = {
      getProjectMemberByCard: jest
        .fn()
        .mockResolvedValue(projectMemberDbResponse),
    };

    getProjectMemberByCardUseCase = new GetProjectMemberByCardUseCase({
      cardRepository: mockCardRepository,
      projectMemberRepository: mockProjectMemberRepository,
    });
  });

  test('It should return a card', async () => {
    const result = await getProjectMemberByCardUseCase.execute(userId, cardId);

    expect(mockCardRepository.findOneByIdWithList).toHaveBeenCalledTimes(1);
    expect(
      mockProjectMemberRepository.getProjectMemberByCard,
    ).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new ProjectMemberDto(projectMemberDbResponse));
  });

  test('It should return an error because the userId was not provided', async () => {
    await expect(
      getProjectMemberByCardUseCase.execute(null, cardId),
    ).rejects.toThrow(/was not provided/);
    expect(mockCardRepository.findOneByIdWithList).not.toHaveBeenCalled();
    expect(
      mockProjectMemberRepository.getProjectMemberByCard,
    ).not.toHaveBeenCalled();
  });

  test('It should return an error because the cardId was not provided', async () => {
    await expect(
      getProjectMemberByCardUseCase.execute(userId, null),
    ).rejects.toThrow(/was not provided/);
    expect(mockCardRepository.findOneByIdWithList).not.toHaveBeenCalled();
    expect(
      mockProjectMemberRepository.getProjectMemberByCard,
    ).not.toHaveBeenCalled();
  });

  test('It should return an error because the operation db failed', async () => {
    mockCardRepository.findOneByIdWithList.mockResolvedValue({});

    await expect(
      getProjectMemberByCardUseCase.execute(userId, cardId),
    ).rejects.toThrow('Card not found');
    expect(mockCardRepository.findOneByIdWithList).toHaveBeenCalledTimes(1);
    expect(
      mockProjectMemberRepository.getProjectMemberByCard,
    ).toHaveBeenCalledTimes(0);
  });

  test('It should return an error because the operation db failed', async () => {
    mockProjectMemberRepository.getProjectMemberByCard.mockResolvedValue({});

    const result = await getProjectMemberByCardUseCase.execute(userId, cardId);
    expect(mockCardRepository.findOneByIdWithList).toHaveBeenCalledTimes(1);
    expect(
      mockProjectMemberRepository.getProjectMemberByCard,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
