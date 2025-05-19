const Boom = require('@hapi/boom');
const path = require('path');

class DeleteProjectUseCase {
  constructor({ projectRepository }, { cloudinaryStorageRepository }) {
    this.projectRepository = projectRepository;
    this.cloudinaryStorageRepository = cloudinaryStorageRepository;
  }

  async execute(project) {
    const currentUrl = project.backgroundUrl;
    const isCloudinaryImage = currentUrl?.includes('res.cloudinary.com');

    if (isCloudinaryImage) {
      const urlParts = currentUrl.split('/');
      const publicIdWithExtension = urlParts.slice(-2).join('/');
      const publicId = publicIdWithExtension.replace(
        path.extname(publicIdWithExtension),
        '',
      );

      const deletedFromStorage =
        await this.cloudinaryStorageRepository.destroy(publicId);
      if (deletedFromStorage?.result !== 'ok')
        throw Boom.badRequest('Failed to delete file from Cloudinary');
    }

    return this.projectRepository.delete(project.id);
  }
}

module.exports = DeleteProjectUseCase;
