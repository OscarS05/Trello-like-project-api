const { Model, DataTypes, Sequelize } = require('sequelize');
const { PROJECT_MEMBER_TABLE } = require('./project-member.model');
const { CHECKLIST_ITEM_TABLE } = require('./checklist-item.model');

const CHECKLIST_ITEM_MEMBER_TABLE = 'checklist_item_members';

const ChecklistItemMemberSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    type: DataTypes.UUID,
  },
  projectMemberId: {
    field: 'project_member_id',
    allowNull: true,
    type: DataTypes.UUID,
    references: {
      model: PROJECT_MEMBER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  checklistItemId: {
    field: 'checklist_item_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: CHECKLIST_ITEM_TABLE,
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

class ChecklistItemMember extends Model {
  static associate(models) {
    this.belongsTo(models.ProjectMember, {
      foreignKey: 'projectMemberId',
      as: 'projectMember',
    });

    this.belongsTo(models.ChecklistItem, {
      foreignKey: 'checklistItemId',
      as: 'checklistItem',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CHECKLIST_ITEM_MEMBER_TABLE,
      modelName: 'ChecklistItemMember',
      timestamps: false,
    };
  }
}

module.exports = {
  CHECKLIST_ITEM_MEMBER_TABLE,
  ChecklistItemMemberSchema,
  ChecklistItemMember,
};
