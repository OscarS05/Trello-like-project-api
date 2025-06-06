/* eslint-disable no-param-reassign */
const {
  CHECKLIST_ITEM_MEMBER_TABLE,
} = require('../models/checklist-item-members.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;

    return queryInterface.bulkInsert(CHECKLIST_ITEM_MEMBER_TABLE, [
      // New checklist 1
      {
        id: '93cb4c3c-c9c4-420d-8d2e-0268b74036b0',
        checklist_item_id: '327c2217-6383-4305-b20a-ca6d9cb1758d',
        project_member_id: 'a1e1bc70-01a0-4e19-91f1-df1c5e5a01a1',
        added_at: '2025-04-09T00:57:42.282Z',
      },
      {
        id: '25124406-527c-42c4-8185-9c5910f8c1c0',
        checklist_item_id: '327c2217-6383-4305-b20a-ca6d9cb1758d',
        project_member_id: 'b2f2cd71-02b1-4f2a-82f2-e11d6f6b02b2',
        added_at: '2025-04-09T00:57:42.282Z',
      },

      // New checklist 2
      {
        id: 'c98b942e-e6e6-4757-a635-6e7a1e920314',
        checklist_item_id: '7d61287a-a565-4510-bdc0-31c76feda470',
        project_member_id: 'a1e1bc70-01a0-4e19-91f1-df1c5e5a01a1',
        added_at: '2025-04-09T00:57:42.282Z',
      },
      {
        id: '5cc35f19-79fa-4178-a6ec-e54b118e9bb2',
        checklist_item_id: '7d61287a-a565-4510-bdc0-31c76feda470',
        project_member_id: 'b2f2cd71-02b1-4f2a-82f2-e11d6f6b02b2',
        added_at: '2025-04-09T00:57:42.282Z',
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;
    return queryInterface.bulkDelete(CHECKLIST_ITEM_MEMBER_TABLE, null, {});
  },
};
