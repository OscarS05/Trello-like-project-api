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
    if (!checklistItemId) throw new Error('checklistItemId was not provided');

    const updateChecklistItemEntity = new UpdateChecklistItemEntity(
      checklistItemData,
    );

    const [affectedRows, [updatedItems]] =
      await this.checklistItemRepository.update(
        checklistItemId,
        updateChecklistItemEntity,
      );

    if (affectedRows === 0) {
      throw boom.badRequest('Something went wrong updating the checklist item');
    }

    const formattedUpdatedItems = updatedItems?.get
      ? updatedItems.get({ plain: true })
      : updatedItems;

    let newItemMembers = [];

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
