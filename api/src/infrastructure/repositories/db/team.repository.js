const ITeamRepository = require('../../../domain/repositories/db/ITeamRepository');

class TeamRepository extends ITeamRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(teamEntity, teamMemberEntity) {
    const transaction = await this.db.transaction();
    try {
      const [teamCreated] = await Promise.all([
        this.db.models.Team.create(teamEntity, { transaction }),
        this.db.models.TeamMember.create(teamMemberEntity, { transaction }),
      ]);

      await transaction.commit();
      return teamCreated;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async assignProject(teamId, projectId) {
    return this.db.models.ProjectTeam.create({ teamId, projectId });
  }

  async update(id, teamName) {
    return this.db.models.Team.update(teamName, {
      where: { id },
      returning: true,
    });
  }

  async unassignProject(teamId, projectId) {
    return this.db.models.ProjectTeam.destroy({
      where: { teamId, projectId },
    });
  }

  async delete(teamId) {
    return this.db.models.Team.destroy({ where: { id: teamId } });
  }

  async findById(teamId, workspaceId) {
    return this.db.models.Team.findOne({
      where: { id: teamId, workspaceId },
    });
  }

  async findProjectAssigned(teamId, projectId) {
    return this.db.models.ProjectTeam.findOne({
      where: { teamId, projectId },
    });
  }

  async findAllProjectsAssigned(teamId) {
    return this.db.models.ProjectTeam.findAll({ where: { teamId } });
  }

  async findAllByWorkspace(workspaceId) {
    return this.db.models.Team.findAll({
      where: { workspaceId },
      include: [
        {
          model: this.db.models.TeamMember,
          as: 'teamMembers',
          include: [
            {
              model: this.db.models.WorkspaceMember,
              as: 'workspaceMember',
              attributes: ['id', 'userId', 'workspaceId'],
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
        {
          model: this.db.models.Project,
          as: 'projects',
        },
      ],
    });
  }

  async findAllByWorkspaceMember(workspaceMemberId) {
    const teamMembers = await this.db.models.TeamMember.findAll({
      where: { workspaceMemberId },
      attributes: ['teamId'],
    });

    const teamIds = teamMembers.map((member) => member.teamId);

    return this.db.models.Team.findAll({
      where: { id: teamIds },
      include: [
        {
          model: this.db.models.TeamMember,
          as: 'teamMembers',
        },
      ],
    });
  }

  async countTeams(workspaceMemberId) {
    return this.db.models.Team.count({ where: { workspaceMemberId } });
  }
}

module.exports = TeamRepository;
