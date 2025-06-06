/* eslint-disable no-param-reassign */
const { CARD_LABELS_TABLE } = require('../models/card-labels.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;

    return queryInterface.bulkInsert(CARD_LABELS_TABLE, [
      // Project NestJS
      {
        card_id: '4600a009-a471-4416-bf24-e857d23d2ab3',
        label_id: '28436f1c-b90e-4b0d-815f-0ad9016ce92b',
        is_visible: true,
      },
      {
        card_id: '4600a009-a471-4416-bf24-e857d23d2ab3',
        label_id: 'fdc5931d-a010-4789-8a13-00c708e111b8',
        is_visible: false,
      },
      {
        card_id: 'c9e0f514-3979-490e-8f9d-af2dfd069668',
        label_id: '28436f1c-b90e-4b0d-815f-0ad9016ce92b',
        is_visible: true,
      },
      {
        card_id: 'c9e0f514-3979-490e-8f9d-af2dfd069668',
        label_id: 'fdc5931d-a010-4789-8a13-00c708e111b8',
        is_visible: false,
      },
      {
        card_id: '57f74c73-e129-4d18-a319-cceae505ce47',
        label_id: '28436f1c-b90e-4b0d-815f-0ad9016ce92b',
        is_visible: true,
      },
      {
        card_id: '57f74c73-e129-4d18-a319-cceae505ce47',
        label_id: 'fdc5931d-a010-4789-8a13-00c708e111b8',
        is_visible: false,
      },
      // Project Testing
      {
        card_id: '8d4462a3-580d-4154-9cb1-95fe565770e5',
        label_id: '09e69ee8-ffe7-48bf-9767-7f1adb533f2a',
        is_visible: true,
      },
      {
        card_id: '8d4462a3-580d-4154-9cb1-95fe565770e5',
        label_id: '383e7380-7505-40fa-93ef-b0491f49db5f',
        is_visible: false,
      },
      {
        card_id: 'bc9cd69a-d646-4ce6-b6ab-36823a60b93c',
        label_id: '09e69ee8-ffe7-48bf-9767-7f1adb533f2a',
        is_visible: true,
      },
      {
        card_id: 'bc9cd69a-d646-4ce6-b6ab-36823a60b93c',
        label_id: '383e7380-7505-40fa-93ef-b0491f49db5f',
        is_visible: false,
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;
    return queryInterface.bulkDelete(CARD_LABELS_TABLE, null, {});
  },
};
