const ChecklistEntity = require('../../../domain/entities/ChecklistEntity');
const ChecklistItemEntity = require('../../../domain/entities/ChecklistItemEntity');
const ChecklistDto = require('../../dtos/checklist.dto');

class CreateChecklistByCopyingItemsUseCase {
  constructor({ checklistRepository, checklistItemRepository }) {
    this.checklistRepository = checklistRepository;
    this.checklistItemRepository = checklistItemRepository;
  }

  async execute(checklistData, checklistWithItems) {
    const checklistEntity = new ChecklistEntity(checklistData);
    const itemEntities = checklistWithItems.items.map(
      (item) =>
        new ChecklistItemEntity({ ...item, checklistId: checklistEntity.id }),
    );

    const newChecklist = await this.checklistRepository.create(checklistEntity);
    const formattedNewChecklist = newChecklist.get({ plain: true });

    const newItems =
      await this.checklistItemRepository.bulkCreate(itemEntities);

    return new ChecklistDto({ ...formattedNewChecklist, items: newItems });
  }
}

module.exports = CreateChecklistByCopyingItemsUseCase;
