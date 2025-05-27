const Boom = require('@hapi/boom');
const path = require('path');
const ProjectDto = require('../../dtos/project.dto');

class UpdateBackgroundProjectUseCase {
  constructor({ projectRepository }, { cloudinaryStorageRepository }) {
    this.projectRepository = projectRepository;
    this.cloudinaryStorageRepository = cloudinaryStorageRepository;
  }

  async execute(project, url) {
    if (!project?.id) throw Boom.badRequest('Project was not provided');
    if (
      !project.backgroundUrl ||
      typeof url !== 'string' ||
      project.backgroundUrl.length === 0
    ) {
      throw Boom.badRequest('Project background image URL is required');
    }

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      throw Boom.badRequest('New background image URL is required');
    }

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

      const deletedFromDb = await this.projectRepository.update(project.id, {
        backgroundUrl: 'null',
      });
      if (deletedFromDb[0] === 0)
        throw Boom.badRequest(
          'Something went wrong while deleting the project background image. The operation returns 0 rows affected',
        );
    }

    const [updatedRows, [updatedProject]] = await this.projectRepository.update(
      project.id,
      { backgroundUrl: url },
    );
    if (updatedRows === 0)
      throw Boom.badRequest(
        'Something went wrong while updating the project background image. The operation returns 0 rows affected',
      );
    return new ProjectDto(updatedProject);
  }
}

module.exports = UpdateBackgroundProjectUseCase;
