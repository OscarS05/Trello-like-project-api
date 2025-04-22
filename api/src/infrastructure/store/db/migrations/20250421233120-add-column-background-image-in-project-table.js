'use strict';

const { PROJECT_TABLE } = require('../models/project.model');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(PROJECT_TABLE, 'background_url', {
      allowNull: true,
      type: Sequelize.TEXT,
      defaultValue: null
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(PROJECT_TABLE, 'background_url');
  }
};
