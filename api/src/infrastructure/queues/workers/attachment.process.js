const { imageSize } = require('image-size');

const {
  cloudinaryStorageRepository,
} = require('../../repositories/storage/index');
const {
  projectService,
  cardAttachmentService,
} = require('../../../application/services/index');
const {
  nameQueueLoadBackgroundImage,
  loadCardAttachmentName,
} = require('../../../../utils/constants');

function validationImageSize(buffer) {
  const dimensions = imageSize(buffer);
  const { width, height } = dimensions;

  if (width < 800 || width < height) {
    throw new Error('The image must be horizontal and at least 800px wide.');
  }
}

async function processAttachmentJob(job) {
  const { buffer, folder } = job.data;

  if (!buffer || !buffer?.data) {
    throw new Error('Missing buffer');
  }

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

      if (!result?.secure_url) {
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

      return projectUpdatedInDb;
    }
    case loadCardAttachmentName: {
      validationImageSize(realBuffer);

      const resultAttachment = await cloudinaryStorageRepository.uploadStream({
        buffer: realBuffer,
        folder,
      });

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

      return cardAttachmentUpdatedInDb;
    }
    default:
      throw new Error(`Unknown job name: ${job.name}`);
  }
}

module.exports = { processAttachmentJob };
