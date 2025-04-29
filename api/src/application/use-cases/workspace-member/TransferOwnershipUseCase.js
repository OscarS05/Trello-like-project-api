const boom = require('@hapi/boom');

class TransferOwnershipUseCase {
  constructor({ workspaceMemberRepository }){
    this.workspaceMemberRepository = workspaceMemberRepository;
  }

  async execute(currentOwner, newOwner){
    if(currentOwner.workspaceId !== newOwner.workspaceId) throw boom.conflict('The new owner does not belong to the workspace');
    if(currentOwner.id === newOwner.id) throw boom.forbidden('You cannot transfer the ownership to yourself');
    if(newOwner.role === 'owner') throw boom.conflict('The member to be updated as workspace owner already has the owner role');

    return await this.workspaceMemberRepository.transferOwnership(currentOwner, newOwner);
  }
}

module.exports = TransferOwnershipUseCase;
