const { v4: uuidv4 } = require('uuid');

const ProjectName = require('../value-objects/projectName');
const ProjectVisibility = require('../value-objects/projectVisibility');

class ProjectEntity {
  constructor({
    name,
    visibility,
    backgroundUrl,
    workspaceId,
    workspaceMemberId,
    createdAt,
  }) {
    this.id = uuidv4();
    this.name = new ProjectName(name).getValue();
    this.visibility = new ProjectVisibility(visibility).toString();
    this.backgroundUrl = backgroundUrl;
    this.workspaceId = workspaceId;
    this.workspaceMemberId = workspaceMemberId;
    this.createdAt = createdAt || new Date().toISOString();
  }

  toPlainObject() {
    return {
      id: this.id,
      name: this.name.value,
      visibility: this.visibility.value,
      workspaceMemberId: this.workspaceMemberId,
      createdAt: this.createdAt,
    };
  }
}

module.exports = ProjectEntity;
