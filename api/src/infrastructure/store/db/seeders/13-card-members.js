/* eslint-disable no-param-reassign */
const { CARD_MEMBER_TABLE } = require('../models/card-member.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;

    return queryInterface.bulkInsert(CARD_MEMBER_TABLE, [
      // Card Set up environment
      {
        id: 'b79a2588-4be1-4777-9be5-a95330c59845',
        project_member_id: 'a1e1bc70-01a0-4e19-91f1-df1c5e5a01a1',
        card_id: '4600a009-a471-4416-bf24-e857d23d2ab3',
        added_at: new Date(),
      },
      {
        id: '44055f24-f48f-4bcf-8a50-05df14236141',
        project_member_id: 'b2f2cd71-02b1-4f2a-82f2-e11d6f6b02b2',
        card_id: '4600a009-a471-4416-bf24-e857d23d2ab3',
        added_at: new Date(),
      },

      // Card Design database schema
      {
        id: 'f8ac2de0-e7b4-45c7-86fa-b745825af97d',
        project_member_id: 'b2f2cd71-02b1-4f2a-82f2-e11d6f6b02b2',
        card_id: 'c9e0f514-3979-490e-8f9d-af2dfd069668',
        added_at: new Date(),
      },
      {
        id: '695e3bbb-5820-4469-8d13-d801c7acc20a',
        project_member_id: 'a1e1bc70-01a0-4e19-91f1-df1c5e5a01a1',
        card_id: 'c9e0f514-3979-490e-8f9d-af2dfd069668',
        added_at: new Date(),
      },

      // Card Design database schema
      {
        id: '5724dc63-1d59-41f9-b1a1-80fe46ed9c44',
        project_member_id: 'a1e1bc70-01a0-4e19-91f1-df1c5e5a01a1',
        card_id: '57f74c73-e129-4d18-a319-cceae505ce47',
        added_at: new Date(),
      },
    ]);
  },

  down: (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;
    return queryInterface.bulkDelete(CARD_MEMBER_TABLE, null, {});
  },
};
