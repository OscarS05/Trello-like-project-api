const { Model, DataTypes, Sequelize } = require('sequelize');
const { LIST_TABLE } = require('./list.model');

const CARD_TABLE = 'cards';

const CardSchema = {
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
  description: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  listId: {
    field: 'list_id',
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: LIST_TABLE,
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

class Card extends Model {
  static associate(models) {
    this.belongsTo(models.List, { as: 'list', foreignKey: 'listId' });

    this.belongsToMany(models.ProjectMember, {
      through: models.CardMember,
      foreignKey: 'cardId',
      as: 'members',
    });

    this.belongsToMany(models.Label, {
      through: models.CardLabel,
      foreignKey: 'cardId',
      otherKey: 'labelId',
      as: 'labels',
    });

    this.hasMany(models.CardAttachment, {
      foreignKey: 'cardId',
      as: 'attachments',
    });

    this.hasMany(models.Checklist, {
      foreignKey: 'cardId',
      as: 'checklists',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CARD_TABLE,
      modelName: 'Card',
      timestamps: false,
    };
  }
}

module.exports = { CARD_TABLE, CardSchema, Card };
