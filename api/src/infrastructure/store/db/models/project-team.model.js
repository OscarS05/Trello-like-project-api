const { Model, DataTypes, Sequelize } = require('sequelize');
const { TEAM_TABLE } = require('./team.model');
const { PROJECT_TABLE } = require('./project.model');

const PROJECT_TEAM_TABLE = 'project_teams';

const ProjectTeamSchema = {
  teamId: {
    field: 'team_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: TEAM_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  projectId: {
    field: 'project_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: PROJECT_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
};

class ProjectTeam extends Model {
  // static associate(models) {}

  static config(sequelize) {
    return {
      sequelize,
      tableName: PROJECT_TEAM_TABLE,
      modelName: 'ProjectTeam',
      timestamps: false,
    };
  }
}

module.exports = { PROJECT_TEAM_TABLE, ProjectTeamSchema, ProjectTeam };
