const boom = require('@hapi/boom');

class TransferOwnershipUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(projectId, currentProjectOwner, newProjectOwner) {
    if (!projectId) {
      throw boom.badRequest('Project ID was not provided');
    }
    if (!currentProjectOwner || !currentProjectOwner.id) {
      throw boom.badRequest('Current project owner was not provided');
    }
    if (!newProjectOwner || !newProjectOwner.id) {
      throw boom.badRequest('New project owner was not provided');
    }
    if (currentProjectOwner.role !== 'owner') {
      throw boom.conflict(
        'The current project member is not the owner of the project',
      );
    }
    if (currentProjectOwner.projectId !== projectId) {
      throw boom.badRequest(
        'The current project owner does not belong to the project',
      );
    }
    if (currentProjectOwner.projectId !== newProjectOwner.projectId) {
      throw boom.badRequest(
        'The new project owner does not belong to the project',
      );
    }
    if (currentProjectOwner.id === newProjectOwner.id) {
      throw boom.conflict(
        'You cannot transfer of ownership of the project to yourself',
      );
    }
    if (newProjectOwner.role === 'owner') {
      throw boom.conflict(
        'The project member to be updated as owner already has the owner role',
      );
    }

    return this.projectMemberRepository.transferOwnership(
      projectId,
      currentProjectOwner,
      newProjectOwner,
    );
  }
}

module.exports = TransferOwnershipUseCase;
