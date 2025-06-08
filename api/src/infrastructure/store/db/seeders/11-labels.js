/* eslint-disable no-param-reassign */
const { LABEL_TABLE } = require('../models/label.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;

    return queryInterface.bulkInsert(LABEL_TABLE, [
      {
        id: '09e69ee8-ffe7-48bf-9767-7f1adb533f2a',
        name: 'Discarded',
        color: '#FFFFFF',
        project_id: '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
      },
      {
        id: '383e7380-7505-40fa-93ef-b0491f49db5f',
        name: 'In progress',
        color: '#FFFFFF',
        project_id: '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
      },
      {
        id: '28436f1c-b90e-4b0d-815f-0ad9016ce92b',
        name: 'In progress',
        color: '#FFFFFF',
        project_id: 'cba6445a-9bf3-4181-9b0a-60ab44ae746d',
      },
      {
        id: 'fdc5931d-a010-4789-8a13-00c708e111b8',
        name: 'Done',
        color: '#FFFFFF',
        project_id: 'cba6445a-9bf3-4181-9b0a-60ab44ae746d',
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;
    return queryInterface.bulkDelete(LABEL_TABLE, null, {});
  },
};
