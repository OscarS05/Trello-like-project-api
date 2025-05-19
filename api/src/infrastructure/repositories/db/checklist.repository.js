const boom = require('@hapi/boom');
const IChecklistRepository = require('../../../domain/repositories/db/IChecklistRepository');

class ChecklistRepository extends IChecklistRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(checklistEntity) {
    return this.db.models.Checklist.create(checklistEntity);
  }

  async update(checklistId, updateChecklistEntity) {
    return this.db.models.Checklist.update(updateChecklistEntity, {
      where: { id: checklistId },
      returning: true,
    });
  }

  async delete(checklistId) {
    return this.db.models.Checklist.destroy({
      where: { id: checklistId },
    });
  }

  async findOne(checklistId) {
    return this.db.models.Checklist.findOne({
      where: { id: checklistId },
      include: [
        {
          model: this.db.models.ChecklistItem,
          as: 'items',
        },
      ],
    });
  }

  async findChecklistsByProject(projectId) {
    return this.db.models.Project.findOne({
      where: { id: projectId },
      include: [
        {
          model: this.db.models.List,
          as: 'lists',
          include: [
            {
              model: this.db.models.Card,
              as: 'cards',
              include: [
                {
                  model: this.db.models.Checklist,
                  as: 'checklists',
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async findChecklistsByCard(cardId) {
    return this.db.models.Checklist.findAll({
      where: { cardId },
      include: [
        {
          model: this.db.models.ChecklistItem,
          as: 'items',
        },
      ],
    });
  }

  async findAll() {
    throw boom.notImplemented('the findAll() method is not implemented');
  }

  async findOneByIdWithData(checklistId) {
    return this.db.models.Checklist.findOne({
      where: { id: checklistId },
      attributes: ['id', 'name'],
      include: [
        {
          model: this.db.models.Card,
          as: 'card',
          attributes: ['id', 'name'],
          include: [
            {
              model: this.db.models.List,
              as: 'list',
              attributes: ['id', 'name', 'projectId'],
            },
          ],
        },
      ],
    });
  }
}

module.exports = ChecklistRepository;
