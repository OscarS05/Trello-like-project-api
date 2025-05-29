const GetAllLabelsUseCase = require('../../../api/src/application/use-cases/label/GetAllLabelsUseCase');
const LabelDto = require('../../../api/src/application/dtos/label.dto');
const { createList, createLabel } = require('../../fake-data/fake-entities');

describe('GetAllLabelsUseCase', () => {
  let projectId;
  let dbResponse;
  let mockLabelRepository;
  let getAllLabelsUseCase;

  beforeEach(() => {
    projectId = createList().projectId;

    dbResponse = [createLabel(), createLabel(), createLabel()];

    mockLabelRepository = {
      findAll: jest.fn().mockResolvedValue(dbResponse),
    };

    getAllLabelsUseCase = new GetAllLabelsUseCase({
      labelRepository: mockLabelRepository,
    });
  });

  test('It should return a label with visibily', async () => {
    const result = await getAllLabelsUseCase.execute(projectId);

    expect(mockLabelRepository.findAll).toHaveBeenCalledTimes(1);

    expect(result).toMatchObject(
      dbResponse.map((label) => new LabelDto(label)),
    );
  });

  test('It should return an error because the projectId was not provided', async () => {
    await expect(getAllLabelsUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockLabelRepository.findAll).not.toHaveBeenCalled();
  });

  test('It should return an error because the db operation of create label with visibily in card failed', async () => {
    mockLabelRepository.findAll.mockResolvedValue([]);

    const result = await getAllLabelsUseCase.execute(projectId);

    expect(mockLabelRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
