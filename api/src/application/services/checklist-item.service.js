/* eslint-disable no-param-reassign */
const boom = require('@hapi/boom');

class ChecklistItemService {
  constructor(
    {
      checkListItemByIdAndProjectUseCase,
      getChecklistItemByIdUseCase,
      getAllChecklistItemsUseCase,
      createChecklistItemUseCase,
      updateChecklistItemUseCase,
      updateTheCheckOfItemUseCase,
      deleteChecklistItemUseCase,
    },
    { getAllByProjectMemberUseCase },
    { getAllMembersByIdUseCase },
  ) {
    this.checkListItemByIdAndProjectUseCase =
      checkListItemByIdAndProjectUseCase;
    this.getChecklistItemByIdUseCase = getChecklistItemByIdUseCase;
    this.getAllChecklistItemsUseCase = getAllChecklistItemsUseCase;
    this.createChecklistItemUseCase = createChecklistItemUseCase;
    this.updateChecklistItemUseCase = updateChecklistItemUseCase;
    this.updateTheCheckOfItemUseCase = updateTheCheckOfItemUseCase;
    this.deleteChecklistItemUseCase = deleteChecklistItemUseCase;

    // checklist item member use cases
    this.getAllByProjectMemberUseCase = getAllByProjectMemberUseCase;

    // project member use cases
    this.getAllMembersByIdUseCase = getAllMembersByIdUseCase;
  }

  async getAllChecklistItems(checklistId) {
    return this.getAllChecklistItemsUseCase.execute(checklistId);
  }

  async createChecklistItem(requesterAsProjectMember, checklistItemData) {
    let projectMembers;

    if (checklistItemData?.assignedProjectMemberIds?.length > 0) {
      projectMembers = await this.getAllMembersByIdUseCase.execute(
        checklistItemData.assignedProjectMemberIds,
        requesterAsProjectMember.projectId,
      );
    }

    if (projectMembers.length === 0)
      throw boom.badData(
        'The provided project member ids do not belong to the project',
      );

    checklistItemData.assignedProjectMemberIds = projectMembers.map(
      (member) => member.id,
    );
    return this.createChecklistItemUseCase.execute(checklistItemData);
  }

  async updateChecklistItem(
    requesterAsProjectMember,
    checklistItemId,
    checklistItemData,
  ) {
    const checklistItem = await this.checkListItemByIdAndProjectUseCase.execute(
      checklistItemId,
      requesterAsProjectMember.projectId,
    );
    if (!checklistItem?.id)
      throw boom.badData(
        'The checklistItemId provided does not belong to the project',
      );

    let availableMembersToBeAdded = [];
    if (checklistItemData.assignedProjectMemberIds?.length > 0) {
      availableMembersToBeAdded = await this.filterAssignableProjectMembers(
        requesterAsProjectMember,
        checklistItemId,
        checklistItemData.assignedProjectMemberIds,
      );
    }
    checklistItemData.assignedProjectMemberIds = availableMembersToBeAdded;
    if (availableMembersToBeAdded.length === 0)
      delete checklistItemData.assignedProjectMemberIds;

    return this.updateChecklistItemUseCase.execute(
      checklistItemId,
      checklistItemData,
    );
  }

  async filterAssignableProjectMembers(
    requesterAsProjectMember,
    checklistItemId,
    assignedProjectMemberIds,
  ) {
    let projectMembers;

    if (assignedProjectMemberIds?.length > 0) {
      projectMembers = await this.getAllMembersByIdUseCase.execute(
        assignedProjectMemberIds,
        requesterAsProjectMember.projectId,
      );
    }

    if (projectMembers.length === 0)
      throw boom.badData(
        'The provided project member ids do not belong to the project',
      );

    const projectMembersInItem =
      await this.getAllByProjectMemberUseCase.execute(
        checklistItemId,
        projectMembers.map((m) => m.id),
      );
    const projectMembersInItemIds = projectMembersInItem.map(
      (m) => m.projectMemberId,
    );
    const availableMembersIds = assignedProjectMemberIds.filter(
      (projectMemberId) => !projectMembersInItemIds.includes(projectMemberId),
    );

    return availableMembersIds;
  }

  async updateTheCheckOfItem(
    requesterAsProjectMember,
    checklistItemId,
    isChecked,
  ) {
    const checklistItem = await this.checkListItemByIdAndProjectUseCase.execute(
      checklistItemId,
      requesterAsProjectMember.projectId,
    );
    if (!checklistItem?.id)
      throw boom.badData(
        'The checklistItemId provided does not belong to the project',
      );

    return this.updateTheCheckOfItemUseCase.execute(checklistItemId, isChecked);
  }

  async deleteChecklistItem(requesterAsProjectMember, checklistItemId) {
    const checklistItem = await this.checkListItemByIdAndProjectUseCase.execute(
      checklistItemId,
      requesterAsProjectMember.projectId,
    );
    if (!checklistItem?.id)
      throw boom.badData(
        'The checklistItemId provided does not belong to the project',
      );

    return this.deleteChecklistItemUseCase.execute(checklistItemId);
  }
}

module.exports = ChecklistItemService;
