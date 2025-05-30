const boom = require('@hapi/boom');
const ChecklistItemMemberDto = require('../../dtos/checklist-item-member.dto');

class GetAllByProjectMemberUseCase {
  constructor({ checklistItemMemberRepository }) {
    this.checklistItemMemberRepository = checklistItemMemberRepository;
  }

  async execute(checklistItemId, projectMemberIds) {
    if (!checklistItemId)
      throw boom.badData('checklistItemId was not provided');
    if (!Array.isArray(projectMemberIds))
      throw boom.badData('projectMemberIds was not provided');
    if (projectMemberIds?.length === 0) return [];

    const checklistItemMembers =
      await this.checklistItemMemberRepository.findAllByProjectMember(
        checklistItemId,
        projectMemberIds,
      );
    return checklistItemMembers?.length > 0
      ? checklistItemMembers.map((member) => new ChecklistItemMemberDto(member))
      : [];
  }
}

module.exports = GetAllByProjectMemberUseCase;
