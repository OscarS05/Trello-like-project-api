const boom = require('@hapi/boom');
const ChecklistItemMemberDto = require('../../dtos/checklist-item-member.dto');

class GetAllByProjectMemberUseCase {
  constructor({ checklistItemMemberRepository }) {
    this.checklistItemMemberRepository = checklistItemMemberRepository;
  }

  async execute(checklistItemId, projectMemberIds) {
    if (!checklistItemId) throw boom.badData('checklistItemId is required');
    if (!Array.isArray(projectMemberIds) || projectMemberIds.length === 0)
      throw boom.badData('projectMemberIds must be a non-empty array');

    const checklistItemMembers =
      await this.checklistItemMemberRepository.findAllByProjectMember(
        checklistItemId,
        projectMemberIds,
      );
    return checklistItemMembers.map(
      (member) => new ChecklistItemMemberDto(member),
    );
  }
}

module.exports = GetAllByProjectMemberUseCase;
