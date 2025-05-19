const boom = require('@hapi/boom');

class ChecklistService {
  constructor({
    getAllChecklistsByCardUseCase,
    getChecklistUseCase,
    getProjectMemberByChecklistUseCase,
    createChecklistByCopyingItemsUseCase,
    getAllChecklistsByProjectUseCase,
    createChecklistUseCase,
    updateChecklistUseCase,
    deleteChecklistUseCase,
  }) {
    this.getAllChecklistsByProjectUseCase = getAllChecklistsByProjectUseCase;
    this.getProjectMemberByChecklistUseCase =
      getProjectMemberByChecklistUseCase;
    this.getAllChecklistsByCardUseCase = getAllChecklistsByCardUseCase;
    this.getChecklistUseCase = getChecklistUseCase;
    this.createChecklistUseCase = createChecklistUseCase;
    this.createChecklistByCopyingItemsUseCase =
      createChecklistByCopyingItemsUseCase;
    this.updateChecklistUseCase = updateChecklistUseCase;
    this.deleteChecklistUseCase = deleteChecklistUseCase;
  }

  async getAllChecklistsByProject(projectId) {
    return this.getAllChecklistsByProjectUseCase.execute(projectId);
  }

  async getChecklistsByCard(cardId) {
    return this.getAllChecklistsByCardUseCase.execute(cardId);
  }

  async createChecklist(checklistData) {
    return this.createChecklistUseCase.execute(checklistData);
  }

  async createChecklistByCopyingItems(checklistId, checklistData) {
    const checklistWithItems =
      await this.getChecklistUseCase.execute(checklistId);
    if (!checklistWithItems?.id)
      throw boom.notFound(
        'The checklist does not exist or does not belong to the card',
      );
    if (checklistWithItems.items?.length === 0)
      throw boom.conflict('The selected checklist has no items to copy');

    return this.createChecklistByCopyingItemsUseCase.execute(
      checklistData,
      checklistWithItems,
    );
  }

  async updateChecklist(checklistId, checklistData) {
    return this.updateChecklistUseCase.execute(checklistId, checklistData);
  }

  async deleteChecklist(checklistId) {
    return this.deleteChecklistUseCase.execute(checklistId);
  }

  async getProjectMemberByChecklist(userId, checklistId) {
    return this.getProjectMemberByChecklistUseCase.execute(userId, checklistId);
  }
}

module.exports = ChecklistService;
