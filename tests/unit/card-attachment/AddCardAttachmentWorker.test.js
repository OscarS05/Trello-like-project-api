jest.mock('../../../api/src/infrastructure/repositories/storage/index', () => ({
  cloudinaryStorageRepository: {
    uploadStream: jest.fn(),
  },
}));
jest.mock('../../../api/src/application/services/index', () => ({
  cardAttachmentService: {
    saveCardAttachment: jest.fn(),
  },
}));
jest.mock('image-size', () => ({
  imageSize: jest.fn(),
}));

const { imageSize } = require('image-size');

const {
  processAttachmentJob,
} = require('../../../api/src/infrastructure/queues/workers/attachment.process');
const {
  cardAttachmentService,
} = require('../../../api/src/application/services/index');
const {
  cloudinaryStorageRepository,
} = require('../../../api/src/infrastructure/repositories/storage/index');
const {
  loadCardAttachmentName,
  CARD_ATTACHMENT_FOLDER,
} = require('../../../api/utils/constants');

const VALID_BUFFER = {
  data: `
/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSEhIVFhUVFRUVFRUVFRUVFRUWFxUVFRUYHSgg
GBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lICUtLS0tLS0tLS0tLS0tLS0tLS0t
LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKMBNwMBIgACEQEDEQH/xAAbAAABBQEBAAAA
AAAAAAAAAAAEAAIDBQYBB//EADsQAAIBAgQDBwIFAgYCAwAAAAECAAMRBBIhMQVBUWFxBhMigZGhsQ
cUI0JSsdHwI1Lh8RUzU2JyguHx/8QAGgEAAwEBAQEAAAAAAAAAAAAAAAECBAMFBv/EACQRAAICAgIB
AwQDAAAAAAAAAAABAhEDIRIxBEETIkFRcRNh/9oADAMBAAIRAxEAPwD3uKoqKioqKioqKioqKioqKi
oqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq//Z
`,
};
const INVALID_BUFFER = {
  data: `
/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBUQEBIVFRUVFRUVFRUVFRUVFRUVFRUWFhUVFRUY
HSggGBolHRUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGzIlICUtLS0tLS0tLS0tLS0tLS0t
LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKMBNwMBIgACEQEDEQH/xAAbAAABBQEB
AAAAAAAAAAAAAAADAAIEBQYBB//EADoQAAIBAgMFBQYGAwEBAAAAAAABAgMRBBIhMUEFE1FhIjJxgZGh
FDNCUsHR8BQjYnKCkqLh8RUzU2NzkqLx/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAKBEAAgIB
AwMEAwAAAAAAAAAAAAECEQMhEjEEE0FRIjIyYXEUMkKh0f/aAAwDAQACEQMRAD8A6tKioqKioqKioq
KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq//Z
`,
};

describe('CardAttachmentJob', () => {
  let responseMock = null;
  let mockJob = null;

  beforeEach(() => {
    responseMock = {
      secure_url: 'https://res.cloudinary.com/fake-image.jpg',
      public_id: 'lkfgd78dfg/fake-image.jpg',
    };

    mockJob = {
      name: loadCardAttachmentName,
      cardId: 'uuid-pr-456',
      data: {
        buffer: VALID_BUFFER,
        folder: CARD_ATTACHMENT_FOLDER,
      },
    };

    cloudinaryStorageRepository.uploadStream.mockResolvedValue(responseMock);

    cardAttachmentService.saveCardAttachment.mockResolvedValue({
      id: mockJob.cardId,
      filename: 'fake-image.jpg',
      type: 'image/jpg',
      url: responseMock.secure_url,
      publicId: responseMock.public_id,
    });
  });

  test('it should load the attachment to Cloudinary when job is valid', async () => {
    imageSize.mockReturnValue({ width: 1000, height: 800 });

    const result = await processAttachmentJob(mockJob);

    expect(cloudinaryStorageRepository.uploadStream).toHaveBeenCalledTimes(1);
    expect(cloudinaryStorageRepository.uploadStream).toHaveBeenCalledWith(
      expect.objectContaining({
        folder: mockJob.data.folder,
      }),
    );
    expect(result).toMatchObject(
      expect.objectContaining({
        url: expect.stringContaining('res.cloudinary.com'),
        id: mockJob.cardId,
      }),
    );
  });

  test('it should return an error because the image size is invalid', async () => {
    imageSize.mockReturnValue({ width: 700, height: 800 });
    mockJob.data.buffer = INVALID_BUFFER;

    await expect(processAttachmentJob(mockJob)).rejects.toThrow(
      /The image must be horizontal and at least 800px wide/,
    );
  });

  test('it should return an error because the cloudinary response is wrong', async () => {
    imageSize.mockReturnValue({ width: 1000, height: 800 });
    cloudinaryStorageRepository.uploadStream.mockResolvedValue({
      result: 'error',
    });

    await expect(processAttachmentJob(mockJob)).rejects.toThrow(
      /Something went wrong loading the file/,
    );
  });

  test('it should return an error because the cardAttachmentService is wrong', async () => {
    imageSize.mockReturnValue({ width: 1000, height: 800 });
    cardAttachmentService.saveCardAttachment.mockResolvedValue({});

    await expect(processAttachmentJob(mockJob)).rejects.toThrow(
      'Failed to update card attachment',
    );
  });

  test('it should return an error because the job.data.folder is missing', async () => {
    delete mockJob.data.folder;

    await expect(processAttachmentJob(mockJob)).rejects.toThrow(
      /Missing required job data/,
    );
  });

  test('it should return an error because the job.data.buffer is missing', async () => {
    delete mockJob.data.buffer;

    await expect(processAttachmentJob(mockJob)).rejects.toThrow(
      /Missing buffer/,
    );
  });
});
