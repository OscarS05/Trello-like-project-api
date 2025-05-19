const { v4: uuidv4 } = require('uuid');

class ChecklistItemMemberEntity {
  constructor({ projectMemberId, checklistItemId }) {
    this.id = uuidv4();
    this.projectMemberId = projectMemberId;
    this.checklistItemId = checklistItemId;
    this.addedAt = new Date().toISOString();
  }
}

module.exports = ChecklistItemMemberEntity;
