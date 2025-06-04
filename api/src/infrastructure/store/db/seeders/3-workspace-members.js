/* eslint-disable no-param-reassign */
const { WORKSPACE_MEMBER_TABLE } = require('../models/workspace-member.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }

    return queryInterface.bulkInsert(WORKSPACE_MEMBER_TABLE, [
      {
        id: '0c6650a2-59d4-411d-8709-3719030ee96b',
        user_id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
        role: 'owner',
        workspace_id: 'f4bbaf96-10d4-468e-b947-40e64f473cb6',
        added_at: '2025-04-03T17:03:07.224Z',
      },
      {
        id: '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
        user_id: '81f72543-69d9-4764-9b73-57e0cf785731',
        role: 'admin',
        workspace_id: 'f4bbaf96-10d4-468e-b947-40e64f473cb6',
        added_at: '2025-04-02T23:03:49.253Z',
      },
      {
        id: '484c8f02-4308-44f9-9a33-c93aab1482c4',
        user_id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
        role: 'owner',
        workspace_id: '07d523b0-9a9d-4d7f-a615-56205f0399c6',
        added_at: '2025-04-03T17:03:07.224Z',
      },
      {
        id: '5ad6d9ba-7f86-47e3-a984-c00541d44c2b',
        user_id: '81f72543-69d9-4764-9b73-57e0cf785731',
        role: 'member',
        workspace_id: '07d523b0-9a9d-4d7f-a615-56205f0399c6',
        added_at: '2025-04-02T23:03:49.253Z',
      },
      {
        id: '4ac99e60-0de2-493e-a04e-7284e35aa21d',
        user_id: '81f72543-69d9-4764-9b73-57e0cf785731',
        role: 'owner',
        workspace_id: '08a78a8e-5aa5-4f12-a055-deb2055abf0e',
        added_at: '2025-04-03T17:03:07.224Z',
      },
      {
        id: '7ce23126-667c-4cbd-9d6d-cc7a66e2f118',
        user_id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
        role: 'member',
        workspace_id: '08a78a8e-5aa5-4f12-a055-deb2055abf0e',
        added_at: '2025-04-02T23:03:49.253Z',
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(WORKSPACE_MEMBER_TABLE, null, {});
  },
};
