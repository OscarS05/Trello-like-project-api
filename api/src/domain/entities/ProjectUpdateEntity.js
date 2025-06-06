const boom = require('@hapi/boom');
const ProjectVisibility = require('../value-objects/projectVisibility');
const ProjectName = require('../value-objects/projectName');

class ProjectUpdateEntity {
  constructor({ name, visibility }) {
    if (!name && !visibility) {
      throw boom.badData(
        "At least one of 'name' or 'visibility' must be provided.",
      );
    }

    if (name) this.name = new ProjectName(name).getValue();
    if (visibility)
      this.visibility = new ProjectVisibility(visibility).toString();
  }
}

module.exports = ProjectUpdateEntity;
