const CardDto = require('../../dtos/card.dto');

class GetAllChecklistsByProjectUseCase {
  constructor({ checklistRepository }) {
    this.checklistRepository = checklistRepository;
  }

  async execute(projectId) {
    if (!projectId) throw new Error('projectId was not provided');

    const project =
      await this.checklistRepository.findChecklistsByProject(projectId);

    if (!project || !project.lists) return [];

    return project.lists.flatMap((list) => {
      if (!list.cards) return [];

      return list.cards
        .filter((card) => card.checklists && card.checklists.length > 0)
        .map((card) => CardDto.withChecklists(card));
    });
  }
}

module.exports = GetAllChecklistsByProjectUseCase;
