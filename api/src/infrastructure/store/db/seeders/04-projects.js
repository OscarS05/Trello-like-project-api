/* eslint-disable no-param-reassign */
const { PROJECT_TABLE } = require('../models/project.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }

    return queryInterface.bulkInsert(PROJECT_TABLE, [
      {
        id: '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
        name: 'Testing',
        visibility: 'private',
        background_url: 'https://images.unsplash.com/sadasdasdasdad',
        workspace_id: 'f4bbaf96-10d4-468e-b947-40e64f473cb6',
        workspace_member_id: '0c6650a2-59d4-411d-8709-3719030ee96b',
        created_at: '2025-04-23T23:40:07.036Z',
      },
      {
        id: 'cba6445a-9bf3-4181-9b0a-60ab44ae746d',
        name: 'NestJS',
        visibility: 'workspace',
        background_url:
          'https://res.cloudinary.com/dfprxzekh/image/upload/v1747271505/project-backgrounds/hdlo49ud9uqvbvfpjbcg.jpg',
        workspace_id: 'f4bbaf96-10d4-468e-b947-40e64f473cb6',
        workspace_member_id: '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
        created_at: '2025-04-03T21:11:29.499Z',
      },
      {
        id: '798995af-266b-4322-8cce-a8ab9c821d12',
        name: 'E2E',
        visibility: 'private',
        background_url: 'https://images.unsplash.com/sadasdasdasdad',
        workspace_id: '07d523b0-9a9d-4d7f-a615-56205f0399c6',
        workspace_member_id: '484c8f02-4308-44f9-9a33-c93aab1482c4',
        created_at: '2025-04-23T23:40:07.036Z',
      },
      {
        id: '3a81c842-3ecd-465f-89a0-20bb61e7070d',
        name: 'TypeScript',
        visibility: 'workspace',
        background_url:
          'https://res.cloudinary.com/dfprxzekh/image/upload/v1747271505/project-backgrounds/hdlo49ud9uqvbvfpjbcg.jpg',
        workspace_id: '07d523b0-9a9d-4d7f-a615-56205f0399c6',
        workspace_member_id: '5ad6d9ba-7f86-47e3-a984-c00541d44c2b',
        created_at: '2025-04-03T21:11:29.499Z',
      },
      {
        id: '74a0f3ff-6f9b-49c5-a9ea-2297dd15e1d3',
        name: 'Socket io',
        visibility: 'private',
        background_url: 'https://images.unsplash.com/sadasdasdasdad',
        workspace_id: '08a78a8e-5aa5-4f12-a055-deb2055abf0e',
        workspace_member_id: '4ac99e60-0de2-493e-a04e-7284e35aa21d',
        created_at: '2025-04-23T23:40:07.036Z',
      },
      {
        id: '1faf6252-df1d-48b8-b734-53c35e3083af',
        name: 'Python',
        visibility: 'workspace',
        background_url:
          'https://res.cloudinary.com/dfprxzekh/image/upload/v1747271505/project-backgrounds/hdlo49ud9uqvbvfpjbcg.jpg',
        workspace_id: '08a78a8e-5aa5-4f12-a055-deb2055abf0e',
        workspace_member_id: '7ce23126-667c-4cbd-9d6d-cc7a66e2f118',
        created_at: '2025-04-03T21:11:29.499Z',
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(PROJECT_TABLE, null, {});
  },
};
