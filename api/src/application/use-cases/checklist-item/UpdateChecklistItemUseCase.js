const boom = require('@hapi/boom');
const ChecklistItemMemberEntity = require('../../../domain/entities/ChecklistItemMemberEntity');
const UpdateChecklistItemEntity = require('../../../domain/entities/UpdateChecklistItemEntity');
const ChecklistItemDto = require('../../dtos/checklist-item.dto');

class UpdateChecklistItemUseCase {
  constructor({ checklistItemRepository, checklistItemMemberRepository }) {
    this.checklistItemRepository = checklistItemRepository;
    this.checklistItemMemberRepository = checklistItemMemberRepository;
  }

  async execute(checklistItemId, checklistItemData) {
    const updateChecklistItemEntity = new UpdateChecklistItemEntity(
      checklistItemData,
    );

    const [[updatedItems]] = await this.checklistItemRepository.update(
      checklistItemId,
      updateChecklistItemEntity,
    );
    if (!updatedItems?.id)
      throw boom.badRequest('Something went wrong updating the checklist item');
    const formattedUpdatedItems = updatedItems.get({ plain: true });

    let newItemMembers;

    if (checklistItemData.assignedProjectMemberIds?.length > 0) {
      const checklistItemMemberEntities =
        checklistItemData.assignedProjectMemberIds.map(
          (memberId) =>
            new ChecklistItemMemberEntity({
              projectMemberId: memberId,
              checklistItemId,
            }),
        );

      newItemMembers = await this.checklistItemMemberRepository.bulkCreate(
        checklistItemMemberEntities,
      );
    }

    return new ChecklistItemDto({
      ...formattedUpdatedItems,
      assignedMembers: newItemMembers,
    });
  }
}

module.exports = UpdateChecklistItemUseCase;
