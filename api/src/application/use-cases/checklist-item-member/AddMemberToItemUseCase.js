const ChecklistItemMemberEntity = require('../../../domain/entities/ChecklistItemMemberEntity');
const ChecklistItemMemberDto = require('../../dtos/checklist-item-member.dto');

class AddMemberToItemUseCase {
  constructor({ checklistItemMemberRepository }) {
    this.checklistItemMemberRepository = checklistItemMemberRepository;
  }

  async execute(checklistItemId, availableMembersToBeAddedIds) {
    const checklistItemMemberEntities = availableMembersToBeAddedIds.map(
      (pmId) =>
        new ChecklistItemMemberEntity({
          projectMemberId: pmId,
          checklistItemId,
        }),
    );

    const itemMembersAdded =
      await this.checklistItemMemberRepository.bulkCreate(
        checklistItemMemberEntities,
      );
    return itemMembersAdded?.length > 0
      ? itemMembersAdded.map((m) => new ChecklistItemMemberDto(m))
      : [];
  }
}

module.exports = AddMemberToItemUseCase;
