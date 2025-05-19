const boom = require('@hapi/boom');

class TransferOwnershipUseCase {
  constructor({ projectMemberRepository }) {
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(projectId, currentProjectOwner, newProjectOwner) {
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
