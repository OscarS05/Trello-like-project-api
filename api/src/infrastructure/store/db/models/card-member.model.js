const { Model, DataTypes, Sequelize } = require('sequelize');
const { PROJECT_MEMBER_TABLE } = require('./project-member.model');
const { CARD_TABLE } = require('./card.model');

const CARD_MEMBER_TABLE = 'card_members';

const CardMemberSchema = {
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
  addedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'added_at',
    defaultValue: Sequelize.NOW,
  },
};

class CardMember extends Model {
  static associate(models) {
    this.belongsTo(models.ProjectMember, {
      as: 'projectMember',
      foreignKey: 'projectMemberId',
    });
    this.belongsTo(models.Card, {
      as: 'card',
      foreignKey: 'cardId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CARD_MEMBER_TABLE,
      modelName: 'CardMember',
      timestamps: false,
    };
  }
}

module.exports = { CARD_MEMBER_TABLE, CardMemberSchema, CardMember };
