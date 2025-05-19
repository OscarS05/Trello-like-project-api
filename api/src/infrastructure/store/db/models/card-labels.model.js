const { Model, DataTypes } = require('sequelize');
const { CARD_TABLE } = require('./card.model');
const { LABEL_TABLE } = require('./label.model');

const CARD_LABELS_TABLE = 'card_labels';

const CardLabelSchema = {
  cardId: {
    field: 'card_id',
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: CARD_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  labelId: {
    field: 'label_id',
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: LABEL_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  isVisible: {
    field: 'is_visible',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
};

class CardLabel extends Model {
  static associate(models) {
    this.belongsTo(models.Card, {
      foreignKey: 'cardId',
      as: 'card',
    });

    this.belongsTo(models.Label, {
      foreignKey: 'labelId',
      as: 'label',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CARD_LABELS_TABLE,
      modelName: 'CardLabel',
      timestamps: false,
    };
  }
}

module.exports = { CARD_LABELS_TABLE, CardLabelSchema, CardLabel };
