const boom = require('@hapi/boom');
const ProjectVisibility = require('../value-objects/projectVisibility');
const ProjectName = require('../value-objects/projectName');

class ProjectUpdateEntity {
  constructor({ name, visibility }) {
    if (!name || !visibility) {
      throw boom.badData(
        "At least one of 'name' or 'visibility' must be provided.",
      );
    }

    this.name = name ? new ProjectName(name).getValue() : null;
    this.visibility = visibility
      ? new ProjectVisibility(visibility).toString()
      : null;
  }
}

module.exports = ProjectUpdateEntity;
