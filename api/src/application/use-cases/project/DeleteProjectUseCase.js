const Boom = require('@hapi/boom');
const path = require('path');

class DeleteProjectUseCase {
  constructor({ projectRepository }, { cloudinaryStorageRepository }) {
    this.projectRepository = projectRepository;
    this.cloudinaryStorageRepository = cloudinaryStorageRepository;
  }

  async execute(project) {
    if (!project?.id) throw Boom.badRequest('project was not provided');
    if (!project?.backgroundUrl && !project?.backgroundUrl?.length > 0)
      throw Boom.badRequest('backgroundUrl was not provided');

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

    const deletedFromDb = await this.projectRepository.delete(project.id);
    if (deletedFromDb === 0) {
      throw Boom.notFound(
        'Something went wrong in DB. Project not found or could not be deleted',
      );
    }

    return deletedFromDb;
  }
}

module.exports = DeleteProjectUseCase;
