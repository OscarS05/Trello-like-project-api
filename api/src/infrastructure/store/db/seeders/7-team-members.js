/* eslint-disable no-param-reassign */
const { TEAM_MEMBER_TABLE } = require('../models/team-member.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }

    return queryInterface.bulkInsert(TEAM_MEMBER_TABLE, [
      // Team Alpha
      {
        id: '101a6e10-aaaa-4f00-91a0-aaa111111111',
        workspace_member_id: '0c6650a2-59d4-411d-8709-3719030ee96b',
        workspace_id: 'f4bbaf96-10d4-468e-b947-40e64f473cb6',
        team_id: 'a1e1a080-90e7-4fd4-8d6a-22b59b7eb6d0',
        role: 'owner',
        added_at: '2025-04-24T18:00:00.000Z',
      },
      {
        id: '102b7f20-bbbb-4f11-92b1-bbb222222222',
        workspace_member_id: '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
        workspace_id: 'f4bbaf96-10d4-468e-b947-40e64f473cb6',
        team_id: 'a1e1a080-90e7-4fd4-8d6a-22b59b7eb6d0',
        role: 'member',
        added_at: '2025-04-24T18:00:01.000Z',
      },

      // Team Beta
      {
        id: '103c8010-cccc-4f22-93c2-ccc333333333',
        workspace_member_id: '0c6650a2-59d4-411d-8709-3719030ee96b',
        workspace_id: 'f4bbaf96-10d4-468e-b947-40e64f473cb6',
        team_id: 'b2e2b190-1234-4aaa-8bbb-33c48d8fc7d1',
        role: 'member',
        added_at: '2025-04-24T18:00:02.000Z',
      },
      {
        id: '104d9020-dddd-4f33-94d3-ddd444444444',
        workspace_member_id: '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
        workspace_id: 'f4bbaf96-10d4-468e-b947-40e64f473cb6',
        team_id: 'b2e2b190-1234-4aaa-8bbb-33c48d8fc7d1',
        role: 'owner',
        added_at: '2025-04-24T18:00:03.000Z',
      },

      // Team Gamma
      {
        id: '105ea130-eeee-4f44-95e4-eee555555555',
        workspace_member_id: '484c8f02-4308-44f9-9a33-c93aab1482c4',
        workspace_id: '07d523b0-9a9d-4d7f-a615-56205f0399c6',
        team_id: 'c3f3c2a0-2345-4bbb-9ccc-44d59e9fd8e2',
        role: 'owner',
        added_at: '2025-04-24T18:00:04.000Z',
      },
      {
        id: '106fb240-ffff-4f55-96f5-fff666666666',
        workspace_member_id: '5ad6d9ba-7f86-47e3-a984-c00541d44c2b',
        workspace_id: '07d523b0-9a9d-4d7f-a615-56205f0399c6',
        team_id: 'c3f3c2a0-2345-4bbb-9ccc-44d59e9fd8e2',
        role: 'member',
        added_at: '2025-04-24T18:00:05.000Z',
      },

      // Team Delta
      {
        id: '1068e492-9398-40f8-a715-c81e0787e64d',
        workspace_member_id: '484c8f02-4308-44f9-9a33-c93aab1482c4',
        workspace_id: '07d523b0-9a9d-4d7f-a615-56205f0399c6',
        team_id: 'd4a4d3b0-3456-4ccc-addd-55e60fafd9f3',
        role: 'member',
        added_at: '2025-04-24T18:00:06.000Z',
      },
      {
        id: '020274f5-ab8f-4520-bb82-a26f3f6f7a4a',
        workspace_member_id: '5ad6d9ba-7f86-47e3-a984-c00541d44c2b',
        workspace_id: '07d523b0-9a9d-4d7f-a615-56205f0399c6',
        team_id: 'd4a4d3b0-3456-4ccc-addd-55e60fafd9f3',
        role: 'owner',
        added_at: '2025-04-24T18:00:07.000Z',
      },

      // Team Epsilon
      {
        id: '377b28be-b377-4e26-b12a-be560e2cad62',
        workspace_member_id: '4ac99e60-0de2-493e-a04e-7284e35aa21d',
        workspace_id: '08a78a8e-5aa5-4f12-a055-deb2055abf0e',
        team_id: 'e5b5e4c0-4567-4ddd-beee-66f71fbfeaf4',
        role: 'owner',
        added_at: '2025-04-24T18:00:08.000Z',
      },
      {
        id: '2d3a942a-d9aa-4eb7-b9b6-777516475967',
        workspace_member_id: '7ce23126-667c-4cbd-9d6d-cc7a66e2f118',
        workspace_id: '08a78a8e-5aa5-4f12-a055-deb2055abf0e',
        team_id: 'e5b5e4c0-4567-4ddd-beee-66f71fbfeaf4',
        role: 'member',
        added_at: '2025-04-24T18:00:09.000Z',
      },

      // Team Zeta
      {
        id: '60b25bb3-3771-4978-87bc-5d8912647a77',
        workspace_member_id: '4ac99e60-0de2-493e-a04e-7284e35aa21d',
        workspace_id: '08a78a8e-5aa5-4f12-a055-deb2055abf0e',
        team_id: '0eaf9f08-84af-449e-ab36-eebc90b7521a',
        role: 'member',
        added_at: '2025-04-24T18:00:10.000Z',
      },
      {
        id: 'e84af8bb-2413-4214-be53-01f42c578c1d',
        workspace_member_id: '7ce23126-667c-4cbd-9d6d-cc7a66e2f118',
        workspace_id: '08a78a8e-5aa5-4f12-a055-deb2055abf0e',
        team_id: '0eaf9f08-84af-449e-ab36-eebc90b7521a',
        role: 'owner',
        added_at: '2025-04-24T18:00:11.000Z',
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(TEAM_MEMBER_TABLE, null, {});
  },
};
