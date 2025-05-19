const boom = require('@hapi/boom');

class ChecklistItemMemberService {
  constructor(
    {
      getAllItemMembersUseCase,
      getItemMembersByIdsUseCase,
      addMemberToItemUseCase,
      deleteChecklistItemUseCase,
    },
    { checkListItemByIdAndProjectUseCase },
  ) {
    this.getAllItemMembersUseCase = getAllItemMembersUseCase;
    this.getItemMembersByIdsUseCase = getItemMembersByIdsUseCase;
    this.addMemberToItemUseCase = addMemberToItemUseCase;
    this.deleteChecklistItemUseCase = deleteChecklistItemUseCase;

    // checklist item use cases
    this.checkListItemByIdAndProjectUseCase =
      checkListItemByIdAndProjectUseCase;
  }

  async getAllChecklistItemMembers(requesterAsProjectMember, checklistItemId) {
    const checklistItem = await this.checkListItemByIdAndProjectUseCase.execute(
      checklistItemId,
      requesterAsProjectMember.projectId,
    );
    if (!checklistItem?.id)
      throw boom.badData(
        'The checklistItemId provided does not belong to the project',
      );

    return this.getAllItemMembersUseCase.execute(checklistItemId);
  }

  async getItemMembersByIds(checklistItemId, checklistItemMemberIds) {
    return this.getItemMembersByIdsUseCase.execute(
      checklistItemId,
      checklistItemMemberIds,
    );
  }

  async addMemberToChecklistItem(
    requesterAsProjectMember,
    checklistItemId,
    availableMembersToBeAddedIds,
  ) {
    const checklistItem = await this.checkListItemByIdAndProjectUseCase.execute(
      checklistItemId,
      requesterAsProjectMember.projectId,
    );

    if (!checklistItem?.id)
      throw boom.badData(
        'The checklistItemId provided does not belong to the project',
      );
    if (availableMembersToBeAddedIds.length === 0) return [];

    const addedMembers = await this.addMemberToItemUseCase.execute(
      checklistItemId,
      availableMembersToBeAddedIds,
    );
    if (addedMembers.length === 0)
      throw boom.badData('No members were added to the checklist item');

    const addedMembersIds = addedMembers.map((member) => member.id);
    const newMembers = await this.getItemMembersByIds(
      checklistItemId,
      addedMembersIds,
    );
    if (newMembers.length === 0)
      throw boom.badData('No members were added to the checklist item');

    return newMembers;
  }

  async deleteChecklistItemMember(
    requesterAsProjectMember,
    checklistItemId,
    projectMemberId,
  ) {
    const checklistItem = await this.checkListItemByIdAndProjectUseCase.execute(
      checklistItemId,
      requesterAsProjectMember.projectId,
    );
    if (!checklistItem?.id)
      throw boom.badData(
        'The checklistItemId provided does not belong to the project',
      );

    return this.deleteChecklistItemUseCase.execute(
      checklistItemId,
      projectMemberId,
    );
  }
}

module.exports = ChecklistItemMemberService;
