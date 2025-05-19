const ProjectMemberDto = require('../../dtos/projectMember.dto');

class GetProjectMemberByChecklistUseCase {
  constructor({ checklistRepository, projectMemberRepository }) {
    this.checklistRepository = checklistRepository;
    this.projectMemberRepository = projectMemberRepository;
  }

  async execute(userId, checklistId) {
    const checklist =
      await this.checklistRepository.findOneByIdWithData(checklistId);
    const projectMember =
      await this.projectMemberRepository.checkProjectMemberByUser(
        userId,
        checklist.card.list.projectId,
      );
    return projectMember?.id ? new ProjectMemberDto(projectMember) : {};
  }
}

module.exports = GetProjectMemberByChecklistUseCase;
