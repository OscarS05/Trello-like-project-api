/* eslint-disable no-param-reassign */
const { LIST_TABLE } = require('../models/list.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;

    return queryInterface.bulkInsert(LIST_TABLE, [
      {
        id: '7f210809-184f-449d-8cb6-7bdca222201a',
        name: 'To Do',
        project_id: '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
        created_at: new Date(),
      },
      {
        id: 'a6782c53-0a82-47e1-a135-bf87bfad3bad',
        name: 'In Progress',
        project_id: '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
        created_at: new Date(),
      },
      {
        id: '2efcc58e-8672-4205-a057-22920f832b8b',
        name: 'Done',
        project_id: 'cba6445a-9bf3-4181-9b0a-60ab44ae746d',
        created_at: new Date(),
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;
    return queryInterface.bulkDelete(LIST_TABLE, null, {});
  },
};
