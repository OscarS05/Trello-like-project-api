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

  verifyIfChecklistBelongsToProject(checklistByProject, checklistId) {
    const isChecklistBelongingToProject =
      checklistByProject?.length > 0
        ? checklistByProject.find((card) =>
            card.checklists.some((checklist) => checklist.id === checklistId),
          )
        : null;

    if (!isChecklistBelongingToProject) {
      throw boom.badRequest(
        'The checklist provided to copy its items does not belong to the project',
      );
    }
    return isChecklistBelongingToProject;
  }

  async createChecklistByCopyingItems(projectId, checklistId, checklistData) {
    const [checklistWithItems, checklistByProject] = await Promise.all([
      this.getChecklistUseCase.execute(checklistId),
      this.getAllChecklistsByProject(projectId),
    ]);
    if (!checklistWithItems?.id)
      throw boom.notFound('The checklist does not exist');
    if (checklistWithItems.items?.length === 0)
      throw boom.conflict('The selected checklist has no items to copy');

    this.verifyIfChecklistBelongsToProject(checklistByProject, checklistId);

    return this.createChecklistByCopyingItemsUseCase.execute(
      checklistData,
      checklistWithItems,
    );
  }

  async updateChecklist(projectId, checklistId, checklistData) {
    const checklistByProject = await this.getAllChecklistsByProject(projectId);

    this.verifyIfChecklistBelongsToProject(checklistByProject, checklistId);

    return this.updateChecklistUseCase.execute(checklistId, checklistData);
  }

  async deleteChecklist(projectId, checklistId) {
    const checklistByProject = await this.getAllChecklistsByProject(projectId);

    this.verifyIfChecklistBelongsToProject(checklistByProject, checklistId);

    return this.deleteChecklistUseCase.execute(checklistId);
  }

  async getProjectMemberByChecklist(userId, checklistId) {
    return this.getProjectMemberByChecklistUseCase.execute(userId, checklistId);
  }
}

module.exports = ChecklistService;
