const IChecklistItemMemberRepository = require('../../../domain/repositories/db/IChecklistItemMemberRepository');

class ChecklistItemMemberRepository extends IChecklistItemMemberRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(checklistItemMemberEntity) {
    return this.db.models.ChecklistItemMember.create(checklistItemMemberEntity);
  }

  async bulkCreate(checklistItemMembersEntities) {
    return this.db.models.ChecklistItemMember.bulkCreate(
      checklistItemMembersEntities,
    );
  }

  async delete(checklistItemId, projectMemberId) {
    return this.db.models.ChecklistItemMember.destroy({
      where: { checklistItemId, projectMemberId },
    });
  }

  async getByIds(checklistItemId, checklistItemMemberIds) {
    return this.db.models.ChecklistItemMember.findAll({
      where: { checklistItemId, id: checklistItemMemberIds },
      include: [
        {
          model: this.db.models.ProjectMember,
          as: 'projectMember',
          attributes: ['id'],
          include: [
            {
              model: this.db.models.WorkspaceMember,
              as: 'workspaceMember',
              attributes: ['id'],
              include: [
                {
                  model: this.db.models.User,
                  as: 'user',
                  attributes: ['name'],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async findAll(checklistItemId) {
    return this.db.models.ChecklistItemMember.findAll({
      where: { checklistItemId },
      include: [
        {
          model: this.db.models.ProjectMember,
          as: 'projectMember',
          attributes: ['id'],
          include: [
            {
              model: this.db.models.WorkspaceMember,
              as: 'workspaceMember',
              attributes: ['id'],
              include: [
                {
                  model: this.db.models.User,
                  as: 'user',
                  attributes: ['name'],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async findAllByProjectMember(checklistItemId, projectMemberIds) {
    return this.db.models.ChecklistItemMember.findAll({
      where: { checklistItemId, projectMemberId: projectMemberIds },
    });
  }

  async findOne({ checklistItemId, projectMemberId }) {
    return this.db.models.ChecklistItemMember.findOne({
      where: { checklistItemId, projectMemberId },
    });
  }
}

module.exports = ChecklistItemMemberRepository;
