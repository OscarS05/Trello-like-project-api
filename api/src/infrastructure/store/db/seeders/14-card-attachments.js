/* eslint-disable no-param-reassign */
const { CARD_ATTACHMENT_TABLE } = require('../models/card-attachment.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;

    return queryInterface.bulkInsert(CARD_ATTACHMENT_TABLE, [
      // Card Set up environment
      {
        id: 'dbb98467-81ad-4018-90f6-cbf581eac82d',
        filename: 'Agroplus-db-scheme-1.jpg',
        url: 'https://res.cloudinary.com/dfprxzekh/image/upload/v1744326304/card-attachments/file_ysjlp7.jpg',
        card_id: '4600a009-a471-4416-bf24-e857d23d2ab3',
        type: 'image/jpeg',
        created_at: '2025-04-10T23:05:04.884Z',
      },
      {
        id: 'a5332d0a-6352-4599-89e6-48c70908f6ba',
        filename: 'Agroplus-db-scheme-2.jpg',
        url: 'https://github.com/OscarS05/Trello-like-project-api',
        card_id: '4600a009-a471-4416-bf24-e857d23d2ab3',
        type: 'external-link',
        created_at: '2025-04-10T23:05:04.884Z',
      },

      // Card Set up environment
      {
        id: '2741ab6d-5444-4112-8dd7-1fd0de7da37a',
        filename: 'Agroplus-db-scheme-3.jpg',
        url: 'https://res.cloudinary.com/dfprxzekh/image/upload/v1744326304/card-attachments/file_ysjlp7.jpg',
        card_id: 'c9e0f514-3979-490e-8f9d-af2dfd069668',
        type: 'image/jpeg',
        created_at: '2025-04-10T23:05:04.884Z',
      },
      {
        id: 'f480ca2c-1a01-4f6e-8ddd-f9f4d51309a6',
        filename: 'Agroplus-db-scheme-4.jpg',
        url: 'https://res.cloudinary.com/dfprxzekh/image/upload/v1744326304/card-attachments/file_ysjlp7.jpg',
        card_id: 'c9e0f514-3979-490e-8f9d-af2dfd069668',
        type: 'image/jpeg',
        created_at: '2025-04-10T23:05:04.884Z',
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;
    return queryInterface.bulkDelete(CARD_ATTACHMENT_TABLE, null, {});
  },
};
