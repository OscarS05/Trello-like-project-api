const IChecklistItemRepository = require('../../../domain/repositories/db/IChecklistItemRepository');

class ChecklistItemRepository extends IChecklistItemRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(checklistItemEntity) {
    return this.db.models.ChecklistItem.create(checklistItemEntity);
  }

  async bulkCreate(checklistItemEntities) {
    return this.db.models.ChecklistItem.bulkCreate(checklistItemEntities);
  }

  async update(checklistItemId, updateChecklistItemEntity) {
    return this.db.models.ChecklistItem.update(updateChecklistItemEntity, {
      where: { id: checklistItemId },
      returning: true,
    });
  }

  async delete(checklistItemId) {
    return this.db.models.ChecklistItem.destroy({
      where: { id: checklistItemId },
    });
  }

  async findOneByIdAndProject(checklistItemId, projectId) {
    console.log(checklistItemId, projectId);

    return this.db.models.ChecklistItem.findOne({
      where: { id: checklistItemId },
      include: [
        {
          model: this.db.models.Checklist,
          as: 'checklist',
          required: true,
          include: [
            {
              model: this.db.models.Card,
              as: 'card',
              required: true,
              include: [
                {
                  model: this.db.models.List,
                  as: 'list',
                  required: true,
                  where: { projectId },
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async findOne(checklistItemId) {
    return this.db.models.ChecklistItem.findOne(checklistItemId);
  }

  async findAll(checklistId) {
    return this.db.models.ChecklistItem.findAll({
      where: { checklistId },
      include: [
        {
          model: this.db.models.ProjectMember,
          as: 'members',
          attributes: ['id', 'workspaceMemberId'],
          through: { attributes: ['id'] },
          include: [
            {
              model: this.db.models.WorkspaceMember,
              as: 'workspaceMember',
              attributes: ['id', 'workspaceId'],
              include: [
                {
                  model: this.db.models.User,
                  as: 'user',
                  attributes: ['id', 'name'],
                },
              ],
            },
          ],
        },
      ],
    });
  }
}

module.exports = ChecklistItemRepository;
