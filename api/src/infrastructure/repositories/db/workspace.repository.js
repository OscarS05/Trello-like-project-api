const { Op } = require('sequelize');
const IWorkspaceRepository = require('../../../domain/repositories/db/IWorkspaceRepository');

class WorkspaceRepository extends IWorkspaceRepository {
  constructor(db){
    super();
    this.db = db;
  }

  async create(workspaceData) {
    const transaction = await this.db.transaction();
    try {
      const workspace = await this.db.models.Workspace.create(workspaceData, { transaction });
      const workspaceMember = await this.db.models.WorkspaceMember.create(
        { userId: workspace.userId, workspaceId: workspace.id, role: 'owner' },
        { transaction }
      );

      await transaction.commit();
      return { workspace, workspaceMember };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async update(id, workspaceData){
    return await this.db.models.Workspace.update(workspaceData, {
      where: { id },
      returning: true,
    });
  }

  async delete(id) {
    return await this.db.models.Workspace.destroy({
      where: { id }
    });
  }

  async bulkDelete(workspaceIds) {
    return await this.db.models.Workspace.destroy({
      where: {
        id: {
          [Op.in]: workspaceIds
        }
       }
    });
  }

  async findAll(userId) {
    return await this.db.models.WorkspaceMember.findAll({
      where: { userId },
      include: [{
        model: this.db.models.Workspace,
        as: 'workspace',
        include: [{
          model: this.db.models.Project,
          as: 'projects',
          include: [{
            model: this.db.models.ProjectMember,
            as: 'projectMembers'
          }]
        }],
      }]
    });
  }

  async findById(workspaceMember) {
    return await this.db.models.Workspace.findOne({
      where: { id: workspaceMember.workspaceId },
      include: [{
        model: this.db.models.Project,
        as: 'projects',
        include: [{
          model: this.db.models.ProjectMember,
          as: 'projectMembers'
        }]
      }]
    });
  }

  async countWorkspacesByUser(userId){
    return await this.db.models.Workspace.count(
      { where: { userId } }
    );
  }
}

module.exports = WorkspaceRepository;
