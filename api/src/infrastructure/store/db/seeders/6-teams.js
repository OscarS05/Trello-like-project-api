/* eslint-disable no-param-reassign */
const { TEAM_TABLE } = require('../models/team.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }

    return queryInterface.bulkInsert(TEAM_TABLE, [
      // Workspace 1: f4bbaf96-10d4-468e-b947-40e64f473cb6
      {
        id: 'a1e1a080-90e7-4fd4-8d6a-22b59b7eb6d0',
        name: 'Team Alpha',
        workspace_member_id: '0c6650a2-59d4-411d-8709-3719030ee96b', // user1 - owner
        workspace_id: 'f4bbaf96-10d4-468e-b947-40e64f473cb6',
        created_at: '2025-04-24T00:00:00.000Z',
      },
      {
        id: 'b2e2b190-1234-4aaa-8bbb-33c48d8fc7d1',
        name: 'Team Beta',
        workspace_member_id: '8bc9b526-4c33-4b88-af81-0fd6a7c05188', // user2 - admin
        workspace_id: 'f4bbaf96-10d4-468e-b947-40e64f473cb6',
        created_at: '2025-04-24T00:00:01.000Z',
      },

      // Workspace 2: 07d523b0-9a9d-4d7f-a615-56205f0399c6
      {
        id: 'c3f3c2a0-2345-4bbb-9ccc-44d59e9fd8e2',
        name: 'Team Gamma',
        workspace_member_id: '484c8f02-4308-44f9-9a33-c93aab1482c4', // user1 - owner
        workspace_id: '07d523b0-9a9d-4d7f-a615-56205f0399c6',
        created_at: '2025-04-24T00:00:02.000Z',
      },
      {
        id: 'd4a4d3b0-3456-4ccc-addd-55e60fafd9f3',
        name: 'Team Delta',
        workspace_member_id: '5ad6d9ba-7f86-47e3-a984-c00541d44c2b', // user2 - member
        workspace_id: '07d523b0-9a9d-4d7f-a615-56205f0399c6',
        created_at: '2025-04-24T00:00:03.000Z',
      },

      // Workspace 3: 08a78a8e-5aa5-4f12-a055-deb2055abf0e
      {
        id: 'e5b5e4c0-4567-4ddd-beee-66f71fbfeaf4',
        name: 'Team Epsilon',
        workspace_member_id: '4ac99e60-0de2-493e-a04e-7284e35aa21d', // user2 - owner
        workspace_id: '08a78a8e-5aa5-4f12-a055-deb2055abf0e',
        created_at: '2025-04-24T00:00:04.000Z',
      },
      {
        id: '0eaf9f08-84af-449e-ab36-eebc90b7521a',
        name: 'Team Zeta',
        workspace_member_id: '7ce23126-667c-4cbd-9d6d-cc7a66e2f118', // user1 - member
        workspace_id: '08a78a8e-5aa5-4f12-a055-deb2055abf0e',
        created_at: '2025-04-24T00:00:05.000Z',
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(TEAM_TABLE, null, {});
  },
};
