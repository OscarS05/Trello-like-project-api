const WorkspaceName = require('../value-objects/workspaceName');
const WorkspaceDescription = require('../value-objects/workspaceDescription');

class UpdateWorkspaceEntity {
  constructor({ name, description }) {
    this.name = new WorkspaceName(name).value;
    this.description = new WorkspaceDescription(description).value;
  }

  toPlainObject() {
    return {
      name: this.name.value,
      description: this.description.value,
    };
  }
}

module.exports = UpdateWorkspaceEntity;
