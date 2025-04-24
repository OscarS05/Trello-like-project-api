const boom = require('@hapi/boom');
const IChecklistItemMemberRepository = require('../../../domain/repositories/db/IChecklistItemMemberRepository');

class ChecklistItemMemberRepository extends IChecklistItemMemberRepository {
  constructor(db){
    super();
    this.db = db;
  }

  async create(checklistItemMemberEntity){
    return await this.db.models.ChecklistItemMember.create(checklistItemMemberEntity);
  }

  async bulkCreate(checklistItemMembersEntities){
    return await this.db.models.ChecklistItemMember.bulkCreate(checklistItemMembersEntities);
  }

  async delete(checklistItemId, projectMemberId){
    return await this.db.models.ChecklistItemMember.destroy({ where: { checklistItemId, projectMemberId } });
  }

  async getByIds(checklistItemId, checklistItemMemberIds){
    return await this.db.models.ChecklistItemMember.findAll({
      where: { checklistItemId, id: checklistItemMemberIds },
      include: [{
        model: this.db.models.ProjectMember,
        as: 'projectMember',
        attributes: ['id'],
        include: [{
          model: this.db.models.WorkspaceMember,
          as: 'workspaceMember',
          attributes: ['id'],
          include: [{
            model: this.db.models.User,
            as: 'user',
            attributes: ['name']
          }]
        }]
      }]
    });
  }

  async findAll(checklistItemId){
    return await this.db.models.ChecklistItemMember.findAll({
      where: { checklistItemId },
      include: [{
        model: this.db.models.ProjectMember,
        as: 'projectMember',
        attributes: ['id'],
        include: [{
          model: this.db.models.WorkspaceMember,
          as: 'workspaceMember',
          attributes: ['id'],
          include: [{
            model: this.db.models.User,
            as: 'user',
            attributes: ['name']
          }]
        }]
      }]
    });
  }

  async findAllByProjectMember(checklistItemId, projectMemberIds){
    return await this.db.models.ChecklistItemMember.findAll({ where: { checklistItemId, projectMemberId: projectMemberIds } });
  }
}

module.exports = ChecklistItemMemberRepository;
