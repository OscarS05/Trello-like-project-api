const { Model, DataTypes } = require('sequelize');
const { CARD_TABLE } = require('./card.model');

const CARD_ATTACHMENT_TABLE = 'card_attachments';

const CardAttachmentSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    type: DataTypes.UUID,
  },
  filename: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  url: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publicId: {
    field: 'public_id',
    allowNull: true,
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
    defaultValue: DataTypes.NOW,
  },
};

class CardAttachment extends Model {
  static associate(models) {
    this.belongsTo(models.Card, { as: 'card' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CARD_ATTACHMENT_TABLE,
      modelName: 'CardAttachment',
      timestamps: false,
    };
  }
}

module.exports = {
  CARD_ATTACHMENT_TABLE,
  CardAttachmentSchema,
  CardAttachment,
};
