const boom = require('@hapi/boom');

const ChecklistEntity = require('../../../domain/entities/ChecklistEntity');
const ChecklistItemEntity = require('../../../domain/entities/ChecklistItemEntity');
const ChecklistDto = require('../../dtos/checklist.dto');

class CreateChecklistByCopyingItemsUseCase {
  constructor({ checklistRepository, checklistItemRepository }) {
    this.checklistRepository = checklistRepository;
    this.checklistItemRepository = checklistItemRepository;
  }

  async execute(checklistData, checklistWithItems) {
    if (!checklistData?.cardId)
      throw boom.badRequest('cardId was not provided');
    if (!checklistData?.name) {
      throw boom.badRequest('the checklist name was not provided');
    }
    if (!checklistWithItems?.id) {
      throw boom.badRequest(
        'The checklist does not exist or does not belong to the card',
      );
    }
    if (checklistWithItems.items?.length === 0) {
      throw boom.badRequest('The selected checklist has no items to copy');
    }

    const checklistEntity = new ChecklistEntity(checklistData);
    const itemEntities = checklistWithItems.items.map(
      (item) =>
        new ChecklistItemEntity({ ...item, checklistId: checklistEntity.id }),
    );

    const newChecklist = await this.checklistRepository.create(checklistEntity);

    if (!newChecklist?.id) {
      throw new Error('Something went wrong creating the checklist');
    }

    const formattedNewChecklist = newChecklist?.get
      ? newChecklist.get({ plain: true })
      : newChecklist;

    const newItems =
      await this.checklistItemRepository.bulkCreate(itemEntities);

    if (newItems?.length === 0) {
      throw new Error('Something went wrong creating the checklist items');
    }

    return new ChecklistDto({ ...formattedNewChecklist, items: newItems });
  }
}

module.exports = CreateChecklistByCopyingItemsUseCase;
