const ProjectMemberDto = require('../../dtos/projectMember.dto');

class GetProjectMemberByChecklistUseCase {
  constructor({ checklistRepository, projectMemberRepository }) {
    this.checklistRepository = checklistRepository;
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(userId, checklistId) {
    if (!userId) throw new Error('userId was not provided');
    if (!checklistId) throw new Error('checklistId was not provided');

    const checklist =
      await this.checklistRepository.findOneByIdWithData(checklistId);

    if (!checklist?.id) {
      throw new Error('checklist was not found');
    }

    const projectMember =
      await this.projectMemberRepository.checkProjectMemberByUser(
        userId,
        checklist.card.list.projectId,
      );

    return projectMember?.id ? new ProjectMemberDto(projectMember) : {};
  }
}

module.exports = GetProjectMemberByChecklistUseCase;
