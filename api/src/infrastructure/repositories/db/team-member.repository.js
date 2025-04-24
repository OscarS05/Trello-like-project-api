const { Op } = require('sequelize');
const ITeamMemberRepository = require('../../../domain/repositories/db/ITeamMemberRepository');

class TeamMemberRepository extends ITeamMemberRepository{
  constructor(db){
    super();
    this.db = db;
  }

  async create(teamId, teamMemberEntity){
    return await this.db.models.TeamMember.create(teamMemberEntity, { where: { teamId } });
  }

  async updateRole(teamMemberId, newRole){
    return await this.db.models.TeamMember.update({ role: newRole }, { where: { id: teamMemberId }, returning: true });
  }

  async transferOwnership(teamId, currentOwner, newOwner){
    const transaction = await this.db.transaction();
    try {
      const [ updatedRows, [ updatedWorkspace ] ] = await this.db.models.Team.update(
        { workspaceMemberId: newOwner.workspaceMemberId },
        { where: { id: teamId }, returning: true, transaction }
      );
      if(updatedRows === 0) throw boom.badRequest('Failed to update workspace owner');

      const [ newOwnerUpdated, formerOwnerUpdated ] = await Promise.all([
        this.db.models.TeamMember.update(
          { role: 'owner' },
          { where: { workspaceMemberId: newOwner.workspaceMemberId }, transaction }
        ),
        this.db.models.TeamMember.update(
          { role: 'admin' },
          { where: { workspaceMemberId: currentOwner.workspaceMemberId }, transaction }
        ),
      ]);
      await transaction.commit();
      return newOwnerUpdated;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(teamMemberId){
    return await this.db.models.TeamMember.destroy({ where: { id: teamMemberId } });
  }

  async bulkDelete(teamMemberIds){
    return await this.db.models.TeamMember.destroy({
      where: { id: { [Op.in]: teamMemberIds } }
    });
  }

  async findProjectsByTeamMember(projectIds, teamMember){
    return await this.db.models.Project.findAll({
      where: { id: projectIds },
      include: [
        {
          model: this.db.models.ProjectMember,
          as: 'projectMembers',
          where: { workspaceMemberId: teamMember.workspaceMemberId },
          attributes: []
        },
        {
          model: this.db.models.Team,
          as: 'teams',
          attributes: [ 'id', 'name', 'workspaceMemberId' ],
          through: []
        }
      ]
    });
  }

  async findAll(teamId, workspaceId){
    return await this.db.models.TeamMember.findAll({
      where: { teamId, workspaceId },
      include: [{
        model: this.db.models.WorkspaceMember,
        as: 'workspaceMember',
        attributes: ['id'],
        include: [{
          model: this.db.models.User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }]
      }]
    });
  }

  async findOneByUserId(userId, workspaceId, teamId){
    return await this.db.models.TeamMember.findOne({
      where: { teamId },
      include: [{
        model: this.db.models.WorkspaceMember,
        as: 'workspaceMember',
        where: { workspaceId, userId }
      }]
    });
  }

  async findOneById(teamId, teamMemberId){
    return await this.db.models.TeamMember.findOne({ where: { id: teamMemberId, teamId } });
  }
}

module.exports = TeamMemberRepository
