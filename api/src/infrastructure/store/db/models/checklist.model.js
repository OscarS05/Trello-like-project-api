const { Model, DataTypes, Sequelize } = require('sequelize');
const { CARD_TABLE } = require('./card.model');

const CHECKLIST_TABLE = 'checklists';

const ChecklistSchema = {
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
  cardId: {
    field: 'card_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: CARD_TABLE,
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

class Checklist extends Model {
  static associate(models) {
    this.belongsTo(models.Card, { as: 'card' });

    this.hasMany(models.ChecklistItem, {
      foreignKey: 'checklistId',
      as: 'items',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CHECKLIST_TABLE,
      modelName: 'Checklist',
      timestamps: false,
    };
  }
}

module.exports = { CHECKLIST_TABLE, ChecklistSchema, Checklist };
