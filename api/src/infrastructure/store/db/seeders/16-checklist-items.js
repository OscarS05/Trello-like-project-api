/* eslint-disable no-param-reassign */
const { CHECKLIST_ITEM_TABLE } = require('../models/checklist-item.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;

    return queryInterface.bulkInsert(CHECKLIST_ITEM_TABLE, [
      // New checklist 1
      {
        id: '327c2217-6383-4305-b20a-ca6d9cb1758d',
        name: 'item 1',
        checklist_id: '407019fa-b920-4574-aeec-1cd1cf8bd225',
        is_checked: false,
        created_at: '2025-04-09T00:57:42.275Z',
      },
      {
        id: '85611752-04a6-4f16-9e81-09a63c8f5fe3',
        name: 'item 2',
        checklist_id: '407019fa-b920-4574-aeec-1cd1cf8bd225',
        is_checked: false,
        created_at: '2025-04-09T00:57:42.275Z',
      },
      // New checklist 2
      {
        id: '7d61287a-a565-4510-bdc0-31c76feda470',
        name: 'item 3',
        checklist_id: '74a0f3ff-6f9b-49c5-a9ea-2297dd15e1d3',
        is_checked: false,
        created_at: '2025-04-09T00:57:42.275Z',
      },
      {
        id: 'f0c634ac-99d9-4d63-a9f5-b71739bf0f3e',
        name: 'item 4',
        checklist_id: '74a0f3ff-6f9b-49c5-a9ea-2297dd15e1d3',
        is_checked: false,
        created_at: '2025-04-09T00:57:42.275Z',
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;
    return queryInterface.bulkDelete(CHECKLIST_ITEM_TABLE, null, {});
  },
};
