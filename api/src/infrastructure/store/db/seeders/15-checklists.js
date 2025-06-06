/* eslint-disable no-param-reassign */
const { CHECKLIST_TABLE } = require('../models/checklist.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;

    return queryInterface.bulkInsert(CHECKLIST_TABLE, [
      // Card Set up environment
      {
        id: '407019fa-b920-4574-aeec-1cd1cf8bd225',
        name: 'New checklist 1',
        card_id: '4600a009-a471-4416-bf24-e857d23d2ab3',
        created_at: '2025-04-07T23:57:24.939Z',
      },
      {
        id: '74a0f3ff-6f9b-49c5-a9ea-2297dd15e1d3',
        name: 'New checklist 2',
        card_id: '4600a009-a471-4416-bf24-e857d23d2ab3',
        created_at: '2025-04-07T23:57:24.939Z',
      },
      // Card Set up environment
      {
        id: 'febc19d0-046b-435c-894a-0c37850e7670',
        name: 'New checklist 3',
        card_id: 'c9e0f514-3979-490e-8f9d-af2dfd069668',
        created_at: '2025-04-07T23:57:24.939Z',
      },
      {
        id: 'f25d8ab8-0465-4116-be75-840348863f88',
        name: 'New checklist 4',
        card_id: 'c9e0f514-3979-490e-8f9d-af2dfd069668',
        created_at: '2025-04-07T23:57:24.939Z',
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;
    return queryInterface.bulkDelete(CHECKLIST_TABLE, null, {});
  },
};
