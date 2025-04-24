const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user.model');


const WORKSPACE_TABLE = 'workspaces';

const WorkspaceSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    type: DataTypes.UUID
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  description: {
    allowNull: true,
    type: Sequelize.DataTypes.STRING
  },
  userId:{
    field: 'user_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: USER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  }
}

class Workspace extends Model {
  static associate(models) {
    this.belongsToMany(models.User, {
      through: models.WorkspaceMember,
      foreignKey: 'workspaceId',
      as: 'members'
    });

    this.hasMany(models.WorkspaceMember, {
      as: 'workspaceMembers',
      foreignKey: 'workspaceId',
    });

    this.hasMany(models.Team, {
      as: 'teams',
      foreignKey: 'workspaceId',
    });

    this.hasMany(models.Project, {
      as: 'projects',
      foreignKey: 'workspaceId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: WORKSPACE_TABLE,
      modelName: 'Workspace',
      timestamps: false
    }
  }
}


module.exports = { WORKSPACE_TABLE, WorkspaceSchema, Workspace }
