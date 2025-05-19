const { Model, DataTypes, Sequelize } = require('sequelize');
const { CHECKLIST_TABLE } = require('./checklist.model');

const CHECKLIST_ITEM_TABLE = 'checklist_items';

const ChecklistItemSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    type: DataTypes.UUID,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  checklistId: {
    field: 'checklist_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: CHECKLIST_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  isChecked: {
    field: 'is_checked',
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dueDate: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'due_date',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
};

class ChecklistItem extends Model {
  static associate(models) {
    this.belongsTo(models.Checklist, {
      foreignKey: 'checklistId',
      as: 'checklist',
    });

    this.belongsToMany(models.ProjectMember, {
      through: models.ChecklistItemMember,
      foreignKey: 'checklistItemId',
      as: 'members',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CHECKLIST_ITEM_TABLE,
      modelName: 'ChecklistItem',
      timestamps: false,
    };
  }
}

module.exports = { CHECKLIST_ITEM_TABLE, ChecklistItemSchema, ChecklistItem };
