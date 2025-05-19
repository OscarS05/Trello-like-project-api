const ChecklistItemEntity = require('../../../domain/entities/ChecklistItemEntity');
const ChecklistItemMemberEntity = require('../../../domain/entities/ChecklistItemMemberEntity');
const ChecklistItemDto = require('../../dtos/checklist-item.dto');

class CreateChecklistItemUseCase {
  constructor({ checklistItemRepository, checklistItemMemberRepository }) {
    this.checklistItemRepository = checklistItemRepository;
    this.checklistItemMemberRepository = checklistItemMemberRepository;
  }

  async execute(checklistItemData) {
    const checklistItemEntity = new ChecklistItemEntity(checklistItemData);

    const newChecklistItem =
      await this.checklistItemRepository.create(checklistItemEntity);
    const formattedNewChecklistItem = newChecklistItem.get({ plain: true });

    let assignedMembers = [];

    if (checklistItemData.assignedProjectMemberIds?.length > 0) {
      const checklistItemMembersEntity =
        checklistItemData.assignedProjectMemberIds.map(
          (newMemberId) =>
            new ChecklistItemMemberEntity({
              projectMemberId: newMemberId,
              checklistItemId: checklistItemEntity.id,
            }),
        );

      assignedMembers = await this.checklistItemMemberRepository.bulkCreate(
        checklistItemMembersEntity,
      );
    }

    return new ChecklistItemDto({
      ...formattedNewChecklistItem,
      assignedMembers,
    });
  }
}

module.exports = CreateChecklistItemUseCase;
