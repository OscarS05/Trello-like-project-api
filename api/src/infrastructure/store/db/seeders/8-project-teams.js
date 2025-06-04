/* eslint-disable no-param-reassign */
const { PROJECT_TEAM_TABLE } = require('../models/project-team.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }

    return queryInterface.bulkInsert(PROJECT_TEAM_TABLE, [
      {
        team_id: 'a1e1a080-90e7-4fd4-8d6a-22b59b7eb6d0',
        project_id: '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
        created_at: new Date(),
      },
      {
        team_id: 'b2e2b190-1234-4aaa-8bbb-33c48d8fc7d1',
        project_id: 'cba6445a-9bf3-4181-9b0a-60ab44ae746d',
        created_at: new Date(),
      },
      {
        team_id: 'c3f3c2a0-2345-4bbb-9ccc-44d59e9fd8e2',
        project_id: '798995af-266b-4322-8cce-a8ab9c821d12',
        created_at: new Date(),
      },
      {
        team_id: 'd4a4d3b0-3456-4ccc-addd-55e60fafd9f3',
        project_id: '3a81c842-3ecd-465f-89a0-20bb61e7070d',
        created_at: new Date(),
      },
      {
        team_id: 'e5b5e4c0-4567-4ddd-beee-66f71fbfeaf4',
        project_id: '74a0f3ff-6f9b-49c5-a9ea-2297dd15e1d3',
        created_at: new Date(),
      },
      {
        team_id: '0eaf9f08-84af-449e-ab36-eebc90b7521a',
        project_id: '1faf6252-df1d-48b8-b734-53c35e3083af',
        created_at: new Date(),
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(PROJECT_TEAM_TABLE, null, {});
  },
};
