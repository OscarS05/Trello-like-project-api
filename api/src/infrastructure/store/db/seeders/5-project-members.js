/* eslint-disable no-param-reassign */
const { PROJECT_MEMBER_TABLE } = require('../models/project-member.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }

    return queryInterface.bulkInsert(PROJECT_MEMBER_TABLE, [
      // Project 1
      {
        id: 'a1e1bc70-01a0-4e19-91f1-df1c5e5a01a1',
        workspace_member_id: '0c6650a2-59d4-411d-8709-3719030ee96b',
        project_id: '8f6e2597-057c-4d84-9851-ae6d7ca9a392', // Testing
        role: 'owner',
        added_at: '2025-04-02T23:03:49.253Z',
      },
      {
        id: 'b2f2cd71-02b1-4f2a-82f2-e11d6f6b02b2',
        workspace_member_id: '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
        project_id: '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
        role: 'member',
        added_at: '2025-04-02T23:03:49.253Z',
      },

      // Project 2
      {
        id: '9eac6780-c53d-4c26-92f2-3bc04e57d525',
        workspace_member_id: '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
        project_id: 'cba6445a-9bf3-4181-9b0a-60ab44ae746d', // NestJS
        role: 'owner',
        added_at: '2025-04-02T23:03:49.253Z',
      },
      {
        id: '380be1a0-432b-49b9-9111-a18bd9b8e104',
        workspace_member_id: '0c6650a2-59d4-411d-8709-3719030ee96b',
        project_id: 'cba6445a-9bf3-4181-9b0a-60ab44ae746d',
        role: 'admin',
        added_at: '2025-04-02T23:03:49.253Z',
      },

      // Workspace 2: 07d523b0-9a9d-4d7f-a615-56205f0399c6
      // Project 3
      {
        id: '873e1c7e-75d4-46a5-bfb2-58a91845799b',
        workspace_member_id: '484c8f02-4308-44f9-9a33-c93aab1482c4',
        project_id: '798995af-266b-4322-8cce-a8ab9c821d12', // E2E
        role: 'owner',
        added_at: '2025-04-02T23:03:49.253Z',
      },
      {
        id: 'baea7f37-dbb9-442b-9689-78bd3b75b1ba',
        workspace_member_id: '5ad6d9ba-7f86-47e3-a984-c00541d44c2b',
        project_id: '798995af-266b-4322-8cce-a8ab9c821d12',
        role: 'admin',
        added_at: '2025-04-02T23:03:49.253Z',
      },

      // Project 4
      {
        id: '003dd93b-50f8-4fed-9920-7a48155d0a14',
        workspace_member_id: '5ad6d9ba-7f86-47e3-a984-c00541d44c2b',
        project_id: '3a81c842-3ecd-465f-89a0-20bb61e7070d', // TypeScript
        role: 'owner',
        added_at: '2025-04-02T23:03:49.253Z',
      },
      {
        id: '6d5fe0ec-7195-4ad1-be75-e2a323025295',
        workspace_member_id: '484c8f02-4308-44f9-9a33-c93aab1482c4',
        project_id: '3a81c842-3ecd-465f-89a0-20bb61e7070d',
        role: 'member',
        added_at: '2025-04-02T23:03:49.253Z',
      },

      // Workspace 3: 08a78a8e-5aa5-4f12-a055-deb2055abf0e
      // Project 5
      {
        id: 'f4b4f7d5-a12f-43b5-afb3-e39154a82512',
        workspace_member_id: '4ac99e60-0de2-493e-a04e-7284e35aa21d',
        project_id: '74a0f3ff-6f9b-49c5-a9ea-2297dd15e1d3', // Socket io
        role: 'owner',
        added_at: '2025-04-02T23:03:49.253Z',
      },
      {
        id: '1241b008-6bd8-4856-b551-1c6e1cc5894e',
        workspace_member_id: '7ce23126-667c-4cbd-9d6d-cc7a66e2f118',
        project_id: '74a0f3ff-6f9b-49c5-a9ea-2297dd15e1d3',
        role: 'admin',
        added_at: '2025-04-02T23:03:49.253Z',
      },

      // Project 6
      {
        id: '31fa09b8-0fdf-41b1-9fd5-035c62a071fb',
        workspace_member_id: '7ce23126-667c-4cbd-9d6d-cc7a66e2f118',
        project_id: '1faf6252-df1d-48b8-b734-53c35e3083af', // Python
        role: 'owner',
        added_at: '2025-04-02T23:03:49.253Z',
      },
      {
        id: '32905f22-b0f2-42f2-8916-c775c9a8f30e',
        workspace_member_id: '4ac99e60-0de2-493e-a04e-7284e35aa21d',
        project_id: '1faf6252-df1d-48b8-b734-53c35e3083af',
        role: 'admin',
        added_at: '2025-04-02T23:03:49.253Z',
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(PROJECT_MEMBER_TABLE, null, {});
  },
};
