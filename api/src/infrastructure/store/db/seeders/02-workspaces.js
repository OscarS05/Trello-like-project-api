/* eslint-disable no-param-reassign */
const { WORKSPACE_TABLE } = require('../models/workspace.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }

    return queryInterface.bulkInsert(WORKSPACE_TABLE, [
      {
        id: 'f4bbaf96-10d4-468e-b947-40e64f473cb6',
        name: 'NestJS',
        user_id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
        description: 'Semester 5',
        created_at: new Date(),
      },
      {
        id: '07d523b0-9a9d-4d7f-a615-56205f0399c6',
        name: 'MongoDB',
        user_id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
        description: 'Semester 5',
        created_at: new Date(),
      },
      {
        id: '08a78a8e-5aa5-4f12-a055-deb2055abf0e',
        name: 'MongoDB',
        user_id: '81f72543-69d9-4764-9b73-57e0cf785731',
        description: 'Semester 5',
        created_at: new Date(),
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(WORKSPACE_TABLE, null, {});
  },
};
