const { v4: uuidv4 } = require('uuid');

const WorkspaceName = require('../value-objects/workspaceName');
const WorkspaceDescription = require('../value-objects/workspaceDescription');

class WorkspaceEntity {
  constructor({ name, description, userId, createdAt }) {
    this.id = uuidv4();
    this.name = new WorkspaceName(name).value;
    if (description) {
      this.description = new WorkspaceDescription(description).value;
    }
    this.userId = userId;
    this.createdAt = createdAt || new Date().toISOString();
  }

  toPlainObject() {
    return {
      id: this.id,
      name: this.name.value,
      description: this.description.value,
      userId: this.userId,
      createdAt: this.createdAt,
    };
  }
}

module.exports = WorkspaceEntity;
