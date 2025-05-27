const boom = require('@hapi/boom');

const { MAX_FILE_SIZE_IN_BYTES } = require('../../../../utils/constants');

class LoadBackgroundImageUseCase {
  constructor({ projectRepository }, { attachmentQueueService }) {
    this.projectRepository = projectRepository;
    this.attachmentQueueService = attachmentQueueService;
  }

  async execute(fileData, folder, projectId) {
    if (!fileData || !fileData.buffer) {
      throw boom.badData('fileData was not provided');
    }
    if (!folder) {
      throw boom.badData('folder was not provided');
    }
    if (!projectId) {
      throw boom.badData('projectId was not provided');
    }

    if (fileData.size > MAX_FILE_SIZE_IN_BYTES) {
      throw boom.badData('The file is too large');
    }

    const addedJob = await this.attachmentQueueService.loadBackgroundImage({
      buffer: fileData.buffer,
      folder,
      projectId,
    });

    if (!addedJob.id || !addedJob.name) {
      throw boom.badData('Something went wrong loading the file in the queue');
    }

    return addedJob;
  }
}

module.exports = LoadBackgroundImageUseCase;
