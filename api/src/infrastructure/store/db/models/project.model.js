const { Model, DataTypes, Sequelize } = require('sequelize');
const { WORKSPACE_TABLE } = require('./workspace.model');
const { WORKSPACE_MEMBER_TABLE } = require('./workspace-member.model');


const PROJECT_TABLE = 'projects';

const ProjectSchema = {
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
  visibility: {
    allowNull: false,
    type: Sequelize.DataTypes.STRING,
  },
  backgroundUrl: {
    field: 'background_url',
    allowNull: false,
    type: DataTypes.TEXT,
    defaultValue: null
  },
  workspaceId:{
    field: 'workspace_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: WORKSPACE_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  workspaceMemberId:{
    field: 'workspace_member_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: WORKSPACE_MEMBER_TABLE,
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

class Project extends Model {
  static associate(models) {
    this.belongsTo(models.Workspace, { as: 'workspace' });

    this.belongsToMany(models.WorkspaceMember, {
      through: models.ProjectMember,
      foreignKey: 'projectId',
      as: 'members'
    });

    this.hasMany(models.ProjectMember, {
      foreignKey: 'projectId',
      as: 'projectMembers'
    });

    this.hasMany(models.List, {
      as: 'lists',
      foreignKey: 'projectId',
    });

    this.belongsToMany(models.Team, {
      through: models.ProjectTeam,
      foreignKey: 'projectId',
      as: 'teams'
    });

    this.hasMany(models.Label, {
      as: 'labels',
      foreignKey: 'projectId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PROJECT_TABLE,
      modelName: 'Project',
      timestamps: false
    }
  }
}


module.exports = { PROJECT_TABLE, ProjectSchema, Project };
