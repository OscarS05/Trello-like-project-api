const IListRepository = require('../../../domain/repositories/db/IListRepository');

class ListRepository extends IListRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(listEntity) {
    return this.db.models.List.create(listEntity, {
      where: { id: listEntity.projectId },
    });
  }

  async update(listId, listUpdateEntity) {
    return this.db.models.List.update(listUpdateEntity, {
      where: { id: listId },
      returning: true,
    });
  }

  async delete(projectId, listId) {
    return this.db.models.List.destroy({
      where: { id: listId, projectId },
    });
  }

  async findOneById(projectId, listId) {
    return this.db.models.List.findOne({
      where: { id: listId, projectId },
    });
  }

  async findAll(projectId) {
    return this.db.models.List.findAll({
      where: { projectId },
      include: [
        {
          model: this.db.models.Card,
          as: 'cards',
        },
      ],
    });
  }

  async checkProjectMembershipByList(userId, listId) {
    return this.db.models.List.findOne({
      where: { id: listId },
      include: [
        {
          model: this.db.models.Project,
          as: 'project',
          attributes: [],
          include: [
            {
              model: this.db.models.ProjectMember,
              as: 'projectMembers',
              attributes: [],
              include: [
                {
                  model: this.db.models.WorkspaceMember,
                  as: 'workspaceMember',
                  attributes: [],
                  where: { userId },
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async getProjectByList(listId) {
    return this.db.models.List.findOne({
      where: { id: listId },
      include: [
        {
          model: this.db.models.Project,
          as: 'project',
        },
      ],
    });
  }
}

module.exports = ListRepository;
