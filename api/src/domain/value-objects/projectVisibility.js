const boom = require('@hapi/boom');

class ProjectVisibility {
  static #VALID_VISIBILITIES = ['private', 'workspace'];

  constructor(value) {
    if (!ProjectVisibility.#VALID_VISIBILITIES.includes(value)) {
      throw boom.badData(
        `Invalid visibility value: ${value}. Allowed values are: ${ProjectVisibility.#VALID_VISIBILITIES.join(', ')}`,
      );
    }
    this.value = value;
  }

  static private() {
    return new ProjectVisibility('private');
  }

  static workspace() {
    return new ProjectVisibility('workspace');
  }

  isPrivate() {
    return this.value === 'private';
  }

  isWorkspace() {
    return this.value === 'workspace';
  }

  equals(other) {
    if (!(other instanceof ProjectVisibility)) {
      return false;
    }
    return this.value === other.value;
  }

  toString() {
    return this.value;
  }
}

module.exports = ProjectVisibility;
