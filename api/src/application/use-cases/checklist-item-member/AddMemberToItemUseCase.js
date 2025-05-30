const ChecklistItemMemberEntity = require('../../../domain/entities/ChecklistItemMemberEntity');
const ChecklistItemMemberDto = require('../../dtos/checklist-item-member.dto');

class AddMemberToItemUseCase {
  constructor({ checklistItemMemberRepository }) {
    this.checklistItemMemberRepository = checklistItemMemberRepository;
  }

  async execute(checklistItemId, availableMembersToBeAddedIds) {
    if (!checklistItemId) throw new Error('checklistItemId was not provided');
    if (availableMembersToBeAddedIds?.length === 0) return [];

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
