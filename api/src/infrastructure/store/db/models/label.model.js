const { Model, DataTypes, Sequelize } = require('sequelize');
const { PROJECT_TABLE } = require('./project.model');

const LABEL_TABLE = 'labels';

const LabelSchema = {
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
  color: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  projectId: {
    field: 'project_id',
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: PROJECT_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
};

class Label extends Model {
  static associate(models) {
    this.belongsTo(models.Project, { as: 'project' });

    this.belongsToMany(models.Card, {
      through: models.CardLabel,
      foreignKey: 'labelId',
      otherKey: 'cardId',
      as: 'cards',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: LABEL_TABLE,
      modelName: 'Label',
      timestamps: false,
    };
  }
}

module.exports = { LABEL_TABLE, LabelSchema, Label };
