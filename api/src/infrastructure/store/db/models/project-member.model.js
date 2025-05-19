const { Model, DataTypes, Sequelize } = require('sequelize');
const { PROJECT_TABLE } = require('./project.model');
const { WORKSPACE_MEMBER_TABLE } = require('./workspace-member.model');

const PROJECT_MEMBER_TABLE = 'project_members';

const ProjectMemberSchema = {
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
  addedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'added_at',
    defaultValue: Sequelize.NOW,
  },
};

class ProjectMember extends Model {
  static associate(models) {
    this.belongsToMany(models.Card, {
      through: models.CardMember,
      foreignKey: 'projectMemberId',
      as: 'cards',
    });

    this.belongsToMany(models.ChecklistItem, {
      through: models.ChecklistItemMember,
      foreignKey: 'projectMemberId',
      as: 'items',
    });

    this.belongsTo(models.Project, {
      as: 'project',
      foreignKey: 'projectId',
    });

    this.belongsTo(models.WorkspaceMember, {
      as: 'workspaceMember',
      foreignKey: 'workspaceMemberId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PROJECT_MEMBER_TABLE,
      modelName: 'ProjectMember',
      timestamps: false,
    };
  }
}

module.exports = { PROJECT_MEMBER_TABLE, ProjectMemberSchema, ProjectMember };
