const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user.model');
const { WORKSPACE_TABLE } = require('./workspace.model');

const WORKSPACE_MEMBER_TABLE = 'workspace_members';

const WorkspaceMemberSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    type: DataTypes.UUID,
  },
  userId: {
    field: 'user_id',
    allowNull: false,
    type: Sequelize.DataTypes.UUID,
    references: {
      model: USER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  role: {
    allowNull: false,
    type: Sequelize.DataTypes.STRING,
    defaultValue: 'member',
  },
  workspaceId: {
    field: 'workspace_id',
    allowNull: false,
    type: Sequelize.DataTypes.UUID,
    references: {
      model: WORKSPACE_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  addedAt: {
    allowNull: false,
    type: Sequelize.DataTypes.DATE,
    field: 'added_at',
    defaultValue: Sequelize.NOW,
  },
};

class WorkspaceMember extends Model {
  static associate(models) {
    this.belongsToMany(models.Project, {
      through: models.ProjectMember,
      foreignKey: 'workspaceMemberId',
      as: 'projects',
    });

    this.belongsToMany(models.Team, {
      through: models.TeamMember,
      foreignKey: 'workspaceMemberId',
      as: 'teams',
    });

    this.hasMany(models.Team, {
      foreignKey: 'workspaceMemberId',
      as: 'ownedTeams',
    });

    this.belongsTo(models.Workspace, {
      foreignKey: 'workspaceId',
      as: 'workspace',
    });

    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: WORKSPACE_MEMBER_TABLE,
      modelName: 'WorkspaceMember',
      timestamps: false,
    };
  }
}

module.exports = {
  WORKSPACE_MEMBER_TABLE,
  WorkspaceMemberSchema,
  WorkspaceMember,
};
