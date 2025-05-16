const boom = require('@hapi/boom');

class LoadBackgroundImageUseCase {
  constructor({ projectRepository }, { attachmentQueueService }) {
    this.projectRepository = projectRepository;
    this.attachmentQueueService = attachmentQueueService;
  }

  async execute(fileData, folder, projectId) {
    const addedJob = await this.attachmentQueueService.loadBackgroundImage({
      buffer: fileData.buffer,
      folder,
      projectId,
    });
    console.log('RESULT JOB', addedJob.name, addedJob.id);
    if (!addedJob.id || !addedJob.name) {
      throw boom.badData('Something went wrong loading the file in the queue');
    }

    return addedJob;
  }
}

module.exports = LoadBackgroundImageUseCase;
