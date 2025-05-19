const { Model, DataTypes, Sequelize } = require('sequelize');
const { WORKSPACE_MEMBER_TABLE } = require('./workspace-member.model');
const { TEAM_TABLE } = require('./team.model');
const { WORKSPACE_TABLE } = require('./workspace.model');

const TEAM_MEMBER_TABLE = 'team_members';

const TeamMemberSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    type: DataTypes.UUID,
  },
  workspaceMemberId: {
    field: 'workspace_member_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: WORKSPACE_MEMBER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'member',
  },
  workspaceId: {
    field: 'workspace_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: WORKSPACE_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
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
  addedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'added_at',
    defaultValue: Sequelize.NOW,
  },
};

class TeamMember extends Model {
  static associate(models) {
    this.belongsTo(models.WorkspaceMember, {
      foreignKey: 'workspaceMemberId',
      as: 'workspaceMember',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: TEAM_MEMBER_TABLE,
      modelName: 'TeamMember',
      timestamps: false,
    };
  }
}

module.exports = { TEAM_MEMBER_TABLE, TeamMemberSchema, TeamMember };
