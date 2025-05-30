const ChecklistItemMemberDto = require('../../dtos/checklist-item-member.dto');

class GetItemMembersByIdsUseCase {
  constructor({ checklistItemMemberRepository }) {
    this.checklistItemMemberRepository = checklistItemMemberRepository;
  }

  async execute(checklistItemId, checklistItemMemberIds) {
    if (!checklistItemId) throw new Error('checklistItemId was not provided');
    if (checklistItemMemberIds?.length === 0) return [];

    const members = await this.checklistItemMemberRepository.getByIds(
      checklistItemId,
      checklistItemMemberIds,
    );
    return members.length === 0
      ? []
      : members.map((member) => new ChecklistItemMemberDto(member));
  }
}

module.exports = GetItemMembersByIdsUseCase;
