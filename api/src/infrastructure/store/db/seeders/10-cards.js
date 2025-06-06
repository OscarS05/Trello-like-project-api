/* eslint-disable no-param-reassign */
const { CARD_TABLE } = require('../models/card.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;

    return queryInterface.bulkInsert(CARD_TABLE, [
      {
        id: '4600a009-a471-4416-bf24-e857d23d2ab3',
        name: 'Set up environment',
        description: 'Install Node.js, Express, and other dependencies',
        list_id: '7f210809-184f-449d-8cb6-7bdca222201a',
        created_at: new Date(),
      },
      {
        id: 'c9e0f514-3979-490e-8f9d-af2dfd069668',
        name: 'Design database schema',
        description: 'Define tables, relations, and constraints',
        list_id: '7f210809-184f-449d-8cb6-7bdca222201a',
        created_at: new Date(),
      },
      {
        id: '57f74c73-e129-4d18-a319-cceae505ce47',
        name: 'Implement authentication',
        description: 'Add login and registration endpoints',
        list_id: 'a6782c53-0a82-47e1-a135-bf87bfad3bad',
        created_at: new Date(),
      },
      {
        id: '8d4462a3-580d-4154-9cb1-95fe565770e5',
        name: 'Implement authentication',
        description: 'Add login and registration endpoints',
        list_id: '2efcc58e-8672-4205-a057-22920f832b8b',
        created_at: new Date(),
      },
      {
        id: 'bc9cd69a-d646-4ce6-b6ab-36823a60b93c',
        name: 'Implement authentication',
        description: 'Add login and registration endpoints',
        list_id: '2efcc58e-8672-4205-a057-22920f832b8b',
        created_at: new Date(),
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;
    return queryInterface.bulkDelete(CARD_TABLE, null, {});
  },
};
