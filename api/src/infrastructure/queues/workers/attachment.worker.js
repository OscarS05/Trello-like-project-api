const { Worker } = require('bullmq');
const { imageSize } = require('image-size');

const { config } = require('../../../../config/config');
const logger = require('../../../../utils/logger/logger');
const redis = require('../../store/cache/index');
const {
  cloudinaryStorageRepository,
} = require('../../repositories/storage/index');
const {
  projectService,
  cardAttachmentService,
} = require('../../../application/services/index');
const {
  nameQueueLoadBackgroundImage,
  attachmentQueueName,
  loadCardAttachmentName,
} = require('../../../../utils/constants');

function validationImageSize(buffer) {
  const dimensions = imageSize(buffer);
  const { width, height } = dimensions;

  if (width < 800 || width < height) {
    throw new Error('The image must be horizontal and at least 800px wide.');
  }
}

const attachmentWorker = new Worker(
  attachmentQueueName,

  async (job) => {
    const { buffer, folder } = job.data;
    const realBuffer = Buffer.from(buffer.data);

    if (!realBuffer || !folder) {
      throw new Error('Missing required job data');
    }

    switch (job.name) {
      case nameQueueLoadBackgroundImage: {
        validationImageSize(realBuffer);

        const result = await cloudinaryStorageRepository.uploadStream({
          buffer: realBuffer,
          folder,
        });

        if (!result.secure_url) {
          throw new Error(
            'Something went wrong loading the file. File url is null',
          );
        }

        const projectUpdatedInDb =
          await projectService.updateBackgroundProjectInDb(
            job.projectId,
            result.secure_url,
          );

        if (!projectUpdatedInDb?.id) {
          throw new Error('Failed to update project background');
        }

        break;
      }
      case loadCardAttachmentName: {
        validationImageSize(realBuffer);

        const resultAttachment = await cloudinaryStorageRepository.uploadStream(
          {
            buffer: realBuffer,
            folder,
          },
        );

        if (!resultAttachment.secure_url || !resultAttachment.public_id) {
          throw new Error(
            'Something went wrong loading the file. File url or public_id is null',
          );
        }

        const cardAttachmentUpdatedInDb =
          await cardAttachmentService.saveCardAttachment({
            cardId: job.data.cardId,
            filename: job.data.filename,
            type: job.data.type,
            url: resultAttachment.secure_url,
            publicId: resultAttachment.public_id,
          });

        if (!cardAttachmentUpdatedInDb?.id) {
          throw new Error('Failed to update card attachment');
        }

        break;
      }
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  },
  { connection: redis },
);

const { isProd } = config;

attachmentWorker.on('completed', (job) => {
  const message = `Job ${job.id} completed successfully`;
  if (isProd) {
    logger.info(message);
  } else {
    // eslint-disable-next-line no-console
    console.log(message);
  }
});

attachmentWorker.on('failed', (job, err) => {
  const message = `Job ${job.id} failed with error: ${err.message}`;
  if (isProd) {
    logger.error(message);
  } else {
    // eslint-disable-next-line no-console
    console.error(message);
  }
});

module.exports = {
  attachmentWorker,
};
