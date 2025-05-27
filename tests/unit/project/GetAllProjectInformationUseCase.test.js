/* eslint-disable no-param-reassign */
const GetAllProjectInformationUseCase = require('../../../api/src/application/use-cases/project/GetAllProjectInformationUseCase');
const ProjectDto = require('../../../api/src/application/dtos/project.dto');
const {
  createProjectMember,
  createProject,
  createList,
  createCard,
  createCardMember,
  createWorkspaceMember,
  createLabel,
} = require('../../fake-data/fake-entities');

describe('GetAllProjectInformationUseCase', () => {
  let projectId;
  let dbResponse;
  let mockProjectRepository;
  let getAllProjectInformationUseCase;

  beforeEach(() => {
    projectId = createProjectMember().projectId;

    dbResponse = {
      ...createProject(),
      lists: [
        {
          ...createList(),
          cards: [
            {
              ...createCard(),
              members: [
                {
                  id: 'project-member-uuid',
                  CardMember: createCardMember(),
                  workspaceMember: createWorkspaceMember(),
                },
              ],
              labels: [
                {
                  ...createLabel(),
                  cardLabel: {
                    isVisible: true,
                  },
                },
              ],
              attachments: ['filename-1', 'filename-2'],
              checklists: [
                {
                  id: 'checklist-uuid',
                  name: 'Checklist 1',
                  items: [
                    { name: 'Item 1', isChecked: true },
                    { name: 'Item 2', isChecked: false },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    mockProjectRepository = {
      getAllProjectInformation: jest.fn().mockResolvedValue(dbResponse),
    };

    getAllProjectInformationUseCase = new GetAllProjectInformationUseCase({
      projectRepository: mockProjectRepository,
    });
  });

  test('It should correctly return UseCaseResponse', async () => {
    const result = await getAllProjectInformationUseCase.execute(projectId);

    expect(mockProjectRepository.getAllProjectInformation).toHaveBeenCalledWith(
      projectId,
    );
    expect(result).toMatchObject(new ProjectDto(dbResponse));
  });

  test('It should return an error because projectId was not provided', async () => {
    try {
      await getAllProjectInformationUseCase.execute(null);

      expect(
        mockProjectRepository.getAllProjectInformation,
      ).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided|is required/);
    }
  });

  test('It should return an empty array because the db did not find anything', async () => {
    mockProjectRepository.getAllProjectInformation.mockResolvedValueOnce({});

    const result = await getAllProjectInformationUseCase.execute(projectId);

    expect(
      mockProjectRepository.getAllProjectInformation,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
