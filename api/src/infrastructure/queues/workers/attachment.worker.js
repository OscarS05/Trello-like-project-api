const { Worker } = require('bullmq');
const { imageSize } = require('image-size');

const { config } = require('../../../../config/config');
const logger = require('../../../../utils/logger/logger');
const redis = require('../../store/cache/index');
const {
  cloudinaryStorageRepository,
} = require('../../repositories/storage/index');
const { projectService } = require('../../../application/services/index');
const {
  nameQueueLoadBackgroundImage,
  attachmentQueueName,
} = require('../../../../utils/constants');

const attachmentWorker = new Worker(
  attachmentQueueName,

  async (job) => {
    const { buffer, folder, projectId } = job.data;
    const realBuffer = Buffer.from(buffer.data);

    if (!realBuffer || !folder || !projectId) {
      throw new Error('Missing required job data');
    }

    console.log('realBuffer', realBuffer);
    switch (job.name) {
      case nameQueueLoadBackgroundImage:
        const dimensions = imageSize(realBuffer);
        const { width, height } = dimensions;

        if (width < 800 || width < height) {
          throw boom.badData(
            'The image must be horizontal and at least 800px wide.'
          );
        }

        const result = await cloudinaryStorageRepository.uploadStream({
          buffer: realBuffer,
          folder,
        });
        console.log('RESULT', result);
        if (!result.secure_url) {
          throw new Error(
            'Something went wrong loading the file. File url is null'
          );
        }

        const projectUpdatedInDb =
          await projectService.updateBackgroundProjectInDb(
            projectId,
            result.secure_url
          );

        if (!projectUpdatedInDb?.id) {
          throw new Error('Failed to update project background');
        }

        break;
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  },
  { connection: redis }
);

const isProd = config.isProd;

attachmentWorker.on('completed', (job) => {
  const message = `Job ${job.id} completed successfully`;
  if (isProd) {
    logger.info(message);
  } else {
    console.log(message);
  }
});

attachmentWorker.on('failed', (job, err) => {
  const message = `Job ${job.id} failed with error: ${err.message}`;
  if (isProd) {
    logger.error(message);
  } else {
    console.error(message);
  }
});

module.exports = {
  attachmentWorker,
};
