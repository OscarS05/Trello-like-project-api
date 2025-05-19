const { Model, DataTypes, Sequelize } = require('sequelize');
const { PROJECT_TABLE } = require('./project.model');

const LIST_TABLE = 'lists';

const ListSchema = {
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
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
};

class List extends Model {
  static associate(models) {
    this.belongsTo(models.Project, { as: 'project', foreignKey: 'projectId' });

    this.hasMany(models.Card, {
      as: 'cards',
      foreignKey: 'listId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: LIST_TABLE,
      modelName: 'List',
      timestamps: false,
    };
  }
}

module.exports = { LIST_TABLE, ListSchema, List };
