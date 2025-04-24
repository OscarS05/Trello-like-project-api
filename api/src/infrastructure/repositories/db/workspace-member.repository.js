const boom = require('@hapi/boom');
const IWorkspaceMemberRepository = require('../../../domain/repositories/db/IWorkspaceMemberRepository');
const { Op } = require('sequelize');

class WorkspaceMemberRepository extends IWorkspaceMemberRepository {
  constructor(db){
    super();
    this.db = db;
  }

  async create(workspaceEntity){
    return await this.db.models.WorkspaceMember.create(workspaceEntity);
  }

  async updateRole(workspaceMemberId, newRole){
    return await this.db.models.WorkspaceMember.update(
      { role: newRole },
      { where: { id: workspaceMemberId }, returning: true }
    );
  }

  async transferOwnership(currentOwner, newOwner){
    const transaction = await this.db.transaction();
    try {
      const [ updatedRows, [ updatedWorkspace ] ] = await this.db.models.Workspace.update(
        { userId: newOwner.userId },
        { where: { id: currentOwner.workspaceId }, returning: true, transaction }
      );
      if(updatedRows === 0) throw boom.badRequest('Failed to update workspace owner');

      const [ newOwnerUpdated, formerOwnerUpdated ] = await Promise.all([
        this.db.models.WorkspaceMember.update(
          { role: 'owner' },
          { where: { id: newOwner.id }, transaction }
        ),
        this.db.models.WorkspaceMember.update(
          { role: 'admin' },
          { where: { id: currentOwner.id }, transaction }
        ),
      ]);
      await transaction.commit();
      return newOwnerUpdated;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(workspaceMemberId){
    return await this.db.models.WorkspaceMember.destroy({ where: { id: workspaceMemberId } });
  }

  async bulkDelete(workspaceMemberIds){
    return await this.db.models.WorkspaceMember.destroy({
      where: { id: { [Op.in]: workspaceMemberIds } }
    });
  }

  async findWorkspaceMemberByUserId(workspaceId, userId){
    return await this.db.models.WorkspaceMember.findOne({
      where: { workspaceId, userId },
      include: [{ model: this.db.models.User, as:'user', attributes: ['id', 'name'] }]
    });
  }

  async findWorkspaceMemberById(workspaceMemberId){
    return await this.db.models.WorkspaceMember.findOne({
      where: { id: workspaceMemberId },
      include: [{ model: this.db.models.User, as:'user', attributes: ['id', 'name'] }]
    });
  }

  async findAllWithData(workspaceId){
    return await this.db.models.WorkspaceMember.findAll({
      where: { workspaceId },
      include: [
        { model: this.db.models.User, as:'user', attributes: ['id', 'name'] },
        { model: this.db.models.Team, as: 'teams', through: { attributes: [] } },
        { model: this.db.models.Project, as: 'projects', through: { attributes: [] } }
      ]
    });
  }

  async findAll(workspaceId){
    return await this.db.models.WorkspaceMember.findAll({
      where: { workspaceId }
    });
  }
}

module.exports = WorkspaceMemberRepository;
